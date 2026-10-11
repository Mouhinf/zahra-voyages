import { z } from 'zod';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';

// ---------------------------------------------------------------------------
// CRM — opérations serveur sur les demandes clients (quotes + contacts).
//
// Les demandes restent dans leurs collections d'origine (aucune migration,
// un seul endroit de vérité). Le CRM les enrichit de champs de suivi écrits
// EXCLUSIVEMENT par le serveur (les règles Firestore interdisent tout accès
// client à ces collections) :
//   crmStatus  — Nouveau | Contacte | En discussion | Devis envoyé |
//                Confirmé | Perdu
//   assignee   — responsable du suivi (email admin, libre)
//   notes      — [{ at, by, texte }] (plafonné à NOTES_CAP)
//   history    — [{ at, by, event }] (plafonné à HISTORY_CAP)
//   crmUpdatedAt
// ---------------------------------------------------------------------------

function db(): Firestore {
  return getFirestore(adminApp);
}

export const LEAD_STATUSES = ['nouveau', 'contacte', 'en_discussion', 'devis_envoye', 'confirme', 'perdu'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  en_discussion: 'En discussion',
  devis_envoye: 'Devis envoyé',
  confirme: 'Confirmé',
  perdu: 'Perdu',
};

const NOTES_CAP = 50;
const HISTORY_CAP = 100;
export const UNHANDLED_AFTER_HOURS = 48;

const noteSchema = z.object({
  texte: z.string().trim().min(1).max(2000),
});

const patchSchema = z.object({
  collection: z.enum(['quotes', 'contacts']),
  id: z.string().min(1).max(128),
  crmStatus: z.enum(LEAD_STATUSES).optional(),
  assignee: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  note: noteSchema.optional(),
});

export type LeadPatch = z.infer<typeof patchSchema>;
export { patchSchema };

function trimEvent(events: Array<Record<string, unknown>>, cap: number): Array<Record<string, unknown>> {
  return events.slice(Math.max(0, events.length - cap));
}

function asStringArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? (value.filter((e) => e && typeof e === 'object') as Array<Record<string, unknown>>) : [];
}

export type LeadPatchResult = {
  updated: boolean;
  crmStatus?: LeadStatus;
  error?: string;
};

/**
 * Applique une modification CRM sur une demande. Chaque action est
 * consignée dans l'historique horodaté du document.
 */
export async function patchLead(patch: LeadPatch, actor: string): Promise<LeadPatchResult> {
  const ref = db().collection(patch.collection).doc(patch.id);
  const now = new Date();
  const events: Array<Record<string, unknown>> = [];

  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      return { updated: false, error: 'Demande introuvable' };
    }
    const data = snap.data() ?? {};

    const notes = asStringArray(data.notes);
    const history = asStringArray(data.history);
    const updates: Record<string, unknown> = { crmUpdatedAt: now.toISOString() };

    if (patch.note) {
      notes.push({ at: now.toISOString(), by: actor, texte: patch.note.texte });
      updates.notes = trimEvent(notes, NOTES_CAP);
      events.push({ event: 'Note ajoutée' });
    }

    const previousStatus = typeof data.crmStatus === 'string' ? data.crmStatus : 'nouveau';
    if (patch.crmStatus && patch.crmStatus !== previousStatus) {
      updates.crmStatus = patch.crmStatus;
      events.push({ event: `Statut : ${LEAD_STATUS_LABELS[previousStatus as LeadStatus] ?? previousStatus} → ${LEAD_STATUS_LABELS[patch.crmStatus]}` });
    }

    if (patch.assignee !== undefined) {
      const previous = typeof data.assignee === 'string' ? data.assignee : '';
      if (patch.assignee !== previous) {
        updates.assignee = patch.assignee;
        events.push({ event: patch.assignee ? `Assignée à ${patch.assignee}` : 'Assignation retirée' });
      }
    }

    if (events.length > 0) {
      for (const e of events) {
        history.push({ at: now.toISOString(), by: actor, ...e });
      }
      updates.history = trimEvent(history, HISTORY_CAP);
      await tx.update(ref, updates);
    }

    return {
      updated: true,
      crmStatus: (updates.crmStatus as LeadStatus | undefined) ?? (previousStatus as LeadStatus),
    };
  });
}

/** Compteurs CRM pour le tableau de bord (données réelles uniquement). */
export async function crmOverview() {
  const quotesSnap = await db().collection('quotes').get();
  const contactsSnap = await db().collection('contacts').get();

  const statusCounts: Record<LeadStatus, number> = {
    nouveau: 0, contacte: 0, en_discussion: 0, devis_envoye: 0, confirme: 0, perdu: 0,
  };
  let total = 0;
  const unhandledCutoff = Date.now() - UNHANDLED_AFTER_HOURS * 60 * 60 * 1000;
  let unhandled = 0;
  const serviceCounts: Record<string, number> = {};
  const perDay: Record<string, number> = {};

  for (const doc of quotesSnap.docs) {
    const d = doc.data();
    total++;
    const status = (LEAD_STATUSES as readonly string[]).includes(String(d.crmStatus)) ? (d.crmStatus as LeadStatus) : 'nouveau';
    statusCounts[status]++;
    const created = typeof d.createdAt === 'string' ? new Date(d.createdAt).getTime() : NaN;
    if (Number.isFinite(created)) {
      if (status === 'nouveau' && created < unhandledCutoff) unhandled++;
      const day = new Date(created).toISOString().slice(0, 10);
      perDay[day] = (perDay[day] ?? 0) + 1;
    }
    const svc = String(d.service || 'inconnu');
    serviceCounts[svc] = (serviceCounts[svc] ?? 0) + 1;
  }

  // Les messages de contact sont des prospects aussi (sans service).
  let contactsTotal = 0;
  for (const doc of contactsSnap.docs) {
    const d = doc.data();
    contactsTotal++;
    const status = (LEAD_STATUSES as readonly string[]).includes(String(d.crmStatus)) ? (d.crmStatus as LeadStatus) : 'nouveau';
    statusCounts[status]++;
    const created = typeof d.createdAt === 'string' ? new Date(d.createdAt).getTime() : NaN;
    if (Number.isFinite(created)) {
      if (status === 'nouveau' && created < unhandledCutoff) unhandled++;
      const day = new Date(created).toISOString().slice(0, 10);
      perDay[day] = (perDay[day] ?? 0) + 1;
    }
  }

  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([service, count]) => ({ service, count }));

  return { total, contactsTotal, statusCounts, unhandled, topServices, perDay };
}
