/**
 * Gestion des Dossiers de Voyage et Prestations Opérationnelles — SLAAC Voyages.
 *
 * Cycle de vie d'un dossier :
 * devis_en_cours -> confirme -> en_preparation -> pret -> en_cours -> termine (ou annule).
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp, type AdminSession } from './firebase-admin';
import { logAuditEvent } from './audit';

function db(): Firestore {
  return getFirestore(adminApp);
}

const COLLECTION = 'travel_files';

export * from './dossiers-types';
import {
  DOSSIER_STATUSES,
  DOSSIER_STATUS_LABELS,
  DOSSIER_STATUS_FLOW,
  type DossierStatus,
  type TravelFile,
} from './dossiers-types';

/**
 * Génère une référence de dossier standardisée : DV-DOS-YYYYMMDD-XXXX.
 */
export function generateDossierReference(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DV-DOS-${y}${m}${d}-${rand}`;
}

export async function listDossiers(
  limit = 50,
  statusFilter?: DossierStatus,
  assignedToFilter?: string
): Promise<TravelFile[]> {
  try {
    let query = db().collection(COLLECTION).orderBy('createdAt', 'desc');

    if (statusFilter) {
      query = query.where('status', '==', statusFilter);
    }
    if (assignedToFilter) {
      query = query.where('assignedTo', '==', assignedToFilter);
    }

    const snapshot = await query.limit(Math.min(limit, 200)).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<TravelFile, 'id'>),
    }));
  } catch (err) {
    console.error('[Dossiers] Erreur listDossiers:', err);
    return [];
  }
}

export async function getDossier(id: string): Promise<TravelFile | null> {
  try {
    const doc = await db().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return {
      id: doc.id,
      ...(doc.data() as Omit<TravelFile, 'id'>),
    };
  } catch (err) {
    console.error(`[Dossiers] Erreur getDossier ${id}:`, err);
    return null;
  }
}

export async function createDossier(
  data: Omit<TravelFile, 'id' | 'reference' | 'createdAt' | 'updatedAt'>,
  actor: AdminSession
): Promise<{ ok: boolean; dossier?: TravelFile; error?: string }> {
  try {
    const ref = generateDossierReference();
    const now = new Date().toISOString();
    const newDocRef = db().collection(COLLECTION).doc();

    const dossier: TravelFile = {
      ...data,
      id: newDocRef.id,
      reference: ref,
      createdAt: now,
      updatedAt: now,
    };

    await newDocRef.set(dossier);

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'BOOKING_CREATED',
      resource: 'bookings',
      resourceId: newDocRef.id,
      details: { reference: ref, customerName: data.customerName, status: data.status },
    });

    return { ok: true, dossier };
  } catch (err: unknown) {
    console.error('[Dossiers] Erreur createDossier:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}

export async function updateDossier(
  id: string,
  patch: Partial<Omit<TravelFile, 'id' | 'reference' | 'createdAt'>>,
  actor: AdminSession
): Promise<{ ok: boolean; dossier?: TravelFile; error?: string }> {
  try {
    const docRef = db().collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return { ok: false, error: 'Dossier introuvable.' };
    }

    const now = new Date().toISOString();
    const updated = {
      ...patch,
      updatedAt: now,
    };

    await docRef.update(updated);

    const isConfirmed = patch.status === 'confirme';
    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: isConfirmed ? 'BOOKING_CONFIRMED' : 'BOOKING_UPDATED',
      resource: 'bookings',
      resourceId: id,
      details: { patch },
    });

    return {
      ok: true,
      dossier: {
        ...(existing.data() as TravelFile),
        ...updated,
        id,
      },
    };
  } catch (err: unknown) {
    console.error(`[Dossiers] Erreur updateDossier ${id}:`, err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}
