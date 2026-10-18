/**
 * Gestion du Répertoire Clients et Rapprochement de Profils — SLAAC Voyages.
 *
 * Distingue la personne physique ou morale (Client) de ses demandes ponctuelles (Quotes, Contacts)
 * et de ses dossiers de voyages (Bookings).
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';

function db(): Firestore {
  return getFirestore(adminApp);
}

const COLLECTION = 'clients';

export interface CustomerProfile {
  id: string;
  nom: string;
  prenom?: string;
  nomComplet: string;
  email?: string;
  telephone?: string;
  whatsapp?: string;
  locale: 'fr' | 'en';
  adresse?: string;
  ville?: string;
  pays?: string;
  totalDemandes: number;
  totalDevisGagnes: number;
  totalBookings?: number;
  valeurCumuleeFcfa: number;
  statut: 'prospect' | 'client_actif' | 'vip' | 'inactif';
  tags: string[];
  notes?: string;
  premiereInteractionAt: string;
  derniereInteractionAt: string;
}

/**
 * Normalise un numéro de téléphone pour la recherche (sans espaces, sans symboles).
 */
export function normalizePhone(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Recherche ou crée un profil client à partir des données d'un lead (devis ou contact).
 */
export async function findOrCreateCustomer(data: {
  nom?: string;
  prenom?: string;
  nomComplet?: string;
  email?: string;
  telephone?: string;
  whatsapp?: string;
  locale?: 'fr' | 'en';
  service?: string;
  estimatedValue?: number;
}): Promise<string> {
  try {
    const email = data.email?.trim().toLowerCase();
    const phone = normalizePhone(data.telephone || data.whatsapp);
    const now = new Date().toISOString();

    let matchedDocId: string | null = null;

    // 1. Rapprochement par email prioritaire si présent
    if (email) {
      const emailSnap = await db()
        .collection(COLLECTION)
        .where('email', '==', email)
        .limit(1)
        .get();
      if (!emailSnap.empty) {
        matchedDocId = emailSnap.docs[0].id;
      }
    }

    // 2. Rapprochement par téléphone si pas trouvé par email
    if (!matchedDocId && phone && phone.length >= 8) {
      const phoneSnap = await db()
        .collection(COLLECTION)
        .where('telephoneNormalized', '==', phone)
        .limit(1)
        .get();
      if (!phoneSnap.empty) {
        matchedDocId = phoneSnap.docs[0].id;
      }
    }

    const fullName = (
      data.nomComplet ||
      `${data.prenom || ''} ${data.nom || ''}`.trim() ||
      email?.split('@')[0] ||
      'Client Inconnu'
    ).trim();

    if (matchedDocId) {
      // Mise à jour de la dernière interaction
      const clientRef = db().collection(COLLECTION).doc(matchedDocId);
      const existing = (await clientRef.get()).data() as CustomerProfile;
      await clientRef.update({
        totalDemandes: (existing.totalDemandes || 0) + 1,
        derniereInteractionAt: now,
        ...(data.service ? { tags: Array.from(new Set([...(existing.tags || []), data.service])) } : {}),
      });
      return matchedDocId;
    }

    // Création d'un nouveau profil client
    const newDocRef = db().collection(COLLECTION).doc();
    const newProfile = {
      nom: data.nom || fullName,
      prenom: data.prenom || '',
      nomComplet: fullName,
      email: email || undefined,
      telephone: data.telephone || undefined,
      whatsapp: data.whatsapp || undefined,
      telephoneNormalized: phone || undefined,
      locale: data.locale || 'fr',
      totalDemandes: 1,
      totalDevisGagnes: 0,
      valeurCumuleeFcfa: 0,
      statut: 'prospect',
      tags: data.service ? [data.service] : [],
      premiereInteractionAt: now,
      derniereInteractionAt: now,
    };

    await newDocRef.set(newProfile);
    return newDocRef.id;
  } catch (err) {
    console.error('[Customers] Erreur findOrCreateCustomer:', err);
    return '';
  }
}

/**
 * Liste les clients avec recherche par mot-clé (nom, email, téléphone).
 */
export async function listCustomers(
  limit = 50,
  queryText?: string
): Promise<CustomerProfile[]> {
  try {
    const snapshot = await db()
      .collection(COLLECTION)
      .orderBy('derniereInteractionAt', 'desc')
      .limit(Math.min(limit, 200))
      .get();

    let items = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CustomerProfile, 'id'>),
    }));

    if (queryText && queryText.trim()) {
      const q = queryText.trim().toLowerCase();
      items = items.filter(
        (c) =>
          c.nomComplet.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.telephone?.includes(q)
      );
    }

    return items;
  } catch (err) {
    console.error('[Customers] Erreur listCustomers:', err);
    return [];
  }
}
