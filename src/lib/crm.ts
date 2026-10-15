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

export type LeadCollection = 'quotes' | 'contacts';
export const LEAD_COLLECTIONS: readonly LeadCollection[] = ['quotes', 'contacts'];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compteurs CRM pour le tableau de bord.
 *
 * Ne lit PAS l'intégralité des collections : les totaux et répartitions par
 * statut sont des agrégations `count()`, et les séries temporelles ne portent
 * que sur les 30 derniers jours. Les demandes non traitées (> 48 h) sont
 * recherchées dans les 90 derniers jours.
 */
export async function crmOverview() {
  const now = Date.now();
  const cutoff48h = new Date(now - UNHANDLED_AFTER_HOURS * 60 * 60 * 1000).toISOString();
  const since30d = new Date(now - 30 * DAY_MS).toISOString();
  const since90d = new Date(now - 90 * DAY_MS).toISOString();

  const statusCounts: Record<LeadStatus, number> = {
    nouveau: 0, contacte: 0, en_discussion: 0, devis_envoye: 0, confirme: 0, perdu: 0,
  };
  const totals: Record<LeadCollection, number> = { quotes: 0, contacts: 0 };

  // Exécution parallèle de tous les comptages et requêtes temporelles
  const [
    quotesTotalSnap,
    contactsTotalSnap,
    quotesStatusSnaps,
    contactsStatusSnaps,
    staleQuotesSnap,
    staleContactsSnap,
    quotesRecent,
    contactsRecent,
  ] = await Promise.all([
    db().collection('quotes').count().get(),
    db().collection('contacts').count().get(),
    Promise.all(
      LEAD_STATUSES.filter((s) => s !== 'nouveau').map((s) =>
        db().collection('quotes').where('crmStatus', '==', s).count().get()
      )
    ),
    Promise.all(
      LEAD_STATUSES.filter((s) => s !== 'nouveau').map((s) =>
        db().collection('contacts').where('crmStatus', '==', s).count().get()
      )
    ),
    db().collection('quotes').where('createdAt', '>=', since90d).where('createdAt', '<', cutoff48h).select('crmStatus').get(),
    db().collection('contacts').where('createdAt', '>=', since90d).where('createdAt', '<', cutoff48h).select('crmStatus').get(),
    db().collection('quotes').where('createdAt', '>=', since30d).select('createdAt', 'service').get(),
    db().collection('contacts').where('createdAt', '>=', since30d).select('createdAt').get(),
  ]);

  totals.quotes = quotesTotalSnap.data().count;
  totals.contacts = contactsTotalSnap.data().count;

  const nonNewStatuses = LEAD_STATUSES.filter((s) => s !== 'nouveau');
  let quotesExplicit = 0;
  let contactsExplicit = 0;

  nonNewStatuses.forEach((status, idx) => {
    const qCount = quotesStatusSnaps[idx].data().count;
    const cCount = contactsStatusSnaps[idx].data().count;
    statusCounts[status] = qCount + cCount;
    quotesExplicit += qCount;
    contactsExplicit += cCount;
  });

  statusCounts.nouveau = Math.max(0, totals.quotes - quotesExplicit) + Math.max(0, totals.contacts - contactsExplicit);

  // Demandes non traitées : statut « nouveau » (ou absent) et plus de 48 h.
  const unhandled = [...staleQuotesSnap.docs, ...staleContactsSnap.docs].filter((d) => {
    const status = String(d.get('crmStatus') ?? 'nouveau');
    return status === 'nouveau';
  }).length;

  const perDay: Record<string, number> = {};
  const serviceCounts: Record<string, number> = {};
  for (const doc of quotesRecent.docs) {
    const day = String(doc.get('createdAt')).slice(0, 10);
    perDay[day] = (perDay[day] ?? 0) + 1;
    const svc = String(doc.get('service') || 'inconnu');
    serviceCounts[svc] = (serviceCounts[svc] ?? 0) + 1;
  }
  for (const doc of contactsRecent.docs) {
    const day = String(doc.get('createdAt')).slice(0, 10);
    perDay[day] = (perDay[day] ?? 0) + 1;
  }

  const topServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([service, count]) => ({ service, count }));

  return {
    total: totals.quotes,
    contactsTotal: totals.contacts,
    statusCounts,
    unhandled,
    topServices,
    perDay,
  };
}

// ---------------------------------------------------------------------------
// Lecture d'une demande et pagination (liste admin)
// ---------------------------------------------------------------------------

export type LeadRow = Record<string, unknown> & { id: string };

/** Une page de demandes, les plus récentes d'abord. `cursor` = id du dernier élément reçu. */
export async function listLeads(
  collection: LeadCollection,
  limit: number,
  cursor?: string,
): Promise<{ items: LeadRow[]; nextCursor: string | null } | { error: string }> {
  let query = db().collection(collection).orderBy('createdAt', 'desc');
  if (cursor) {
    const cursorSnap = await db().collection(collection).doc(cursor).get();
    if (!cursorSnap.exists) return { error: 'Curseur de pagination invalide' };
    query = query.startAfter(cursorSnap);
  }
  const snap = await query.limit(limit + 1).get();
  const docs = snap.docs.slice(0, limit);
  return {
    items: docs.map((d) => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.length > limit ? docs[docs.length - 1].id : null,
  };
}

/** Une demande complète (avec notes et historique), ou null si absente. */
export async function getLead(collection: LeadCollection, id: string): Promise<LeadRow | null> {
  const snap = await db().collection(collection).doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
}

/** Dernières demandes reçues, devis et contacts confondus. */
export async function recentLeads(limit = 6): Promise<Array<LeadRow & { kind: LeadCollection }>> {
  const [quotes, contacts] = await Promise.all([
    db().collection('quotes').orderBy('createdAt', 'desc').limit(limit).get(),
    db().collection('contacts').orderBy('createdAt', 'desc').limit(limit).get(),
  ]);
  const rows = [
    ...quotes.docs.map((d) => ({ kind: 'quotes' as const, id: d.id, ...d.data() })),
    ...contacts.docs.map((d) => ({ kind: 'contacts' as const, id: d.id, ...d.data() })),
  ] as Array<LeadRow & { kind: LeadCollection }>;
  return rows
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
    .slice(0, limit);
}
