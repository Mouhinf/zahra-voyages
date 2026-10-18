/**
 * Gestionnaire du pattern Transactional Outbox dans Cloud Firestore.
 * Collection: `emailOutbox`
 * Clé d'idempotence: `${leadCollection}_${leadId}_${recipientType}`
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp, assertAdminConfigured } from '../firebase-admin';
import {
  EmailOptions,
  EmailOutboxRecord,
  LeadKind,
  OutboxStatus,
  RecipientDeliverySummary,
  RecipientType,
  DispatchResult,
} from './types';
import { getEmailProvider } from './providers';

function db(): Firestore {
  return getFirestore(adminApp);
}

export function buildOutboxId(leadCollection: LeadKind, leadId: string, recipientType: RecipientType): string {
  return `${leadCollection}_${leadId}_${recipientType}`;
}

export interface CreateOutboxParams {
  leadCollection: LeadKind;
  leadId: string;
  recipientType: RecipientType;
  options: EmailOptions;
  metadata?: Record<string, unknown>;
  maxAttempts?: number;
}

/**
 * Calcule le délai de rejeu avec backoff exponentiel et jitter aléatoire (en ms).
 */
export function calculateBackoffMs(attemptCount: number, baseSeconds = 30): number {
  const exponent = Math.max(0, attemptCount - 1);
  const factor = Math.pow(2, exponent);
  const delaySec = Math.min(3600, baseSeconds * factor);
  // Jitter de 0 à 15 secondes pour éviter le thundering herd
  const jitterSec = Math.floor(Math.random() * 15);
  return (delaySec + jitterSec) * 1000;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanData(obj: any): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = cleanData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Crée ou récupère une entrée d'outbox dans Firestore avec clé d'idempotence.
 * Si le message est déjà marqué comme 'sent', il ne sera pas recréé ni réémis sans forçage.
 */
export async function queueOutboxEmail(params: CreateOutboxParams): Promise<EmailOutboxRecord> {
  assertAdminConfigured();
  const id = buildOutboxId(params.leadCollection, params.leadId, params.recipientType);
  const ref = db().collection('emailOutbox').doc(id);

  const now = new Date().toISOString();
  const snap = await ref.get();

  if (snap.exists) {
    const existing = snap.data() as EmailOutboxRecord;
    // Si déjà envoyé, on le conserve sans l'écraser
    if (existing.status === 'sent') {
      return existing;
    }
  }

  const record: EmailOutboxRecord = {
    id,
    leadCollection: params.leadCollection,
    leadId: params.leadId,
    recipientType: params.recipientType,
    to: params.options.to,
    from: params.options.from || 'SLAAC Voyages <contact@slaacvoyages.com>',
    replyTo: params.options.replyTo || null,
    subject: params.options.subject,
    htmlBody: params.options.html,
    textBody: params.options.text,
    status: 'pending',
    attemptCount: snap.exists ? (snap.data()?.attemptCount || 0) : 0,
    maxAttempts: params.maxAttempts || 5,
    nextRetryAt: null,
    lastAttemptAt: null,
    sentAt: null,
    lastError: null,
    createdAt: snap.exists ? snap.data()?.createdAt || now : now,
    updatedAt: now,
    metadata: params.metadata || null,
  };

  await ref.set(cleanData(record), { merge: true });
  return record;
}

export { type DispatchResult };

/**
 * Traite et expédie une entrée d'outbox spécifique.
 * Met à jour le statut dans `emailOutbox` et synchronise le lead parent (`quotes` ou `contacts`).
 */
export async function dispatchOutboxEmail(outboxId: string, force = false): Promise<DispatchResult> {
  assertAdminConfigured();
  const ref = db().collection('emailOutbox').doc(outboxId);
  const snap = await ref.get();

  if (!snap.exists) {
    return {
      outboxId,
      success: false,
      status: 'failed',
      error: `Entrée Outbox ${outboxId} introuvable`,
    };
  }

  const record = snap.data() as EmailOutboxRecord;

  // Idempotence : si déjà expédié et non forcé, on ne réexpédie pas
  if (record.status === 'sent' && !force) {
    return {
      outboxId,
      success: true,
      status: 'sent',
      messageId: record.providerMessageId,
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();

  // Passer en statut 'processing'
  await ref.update({
    status: 'processing',
    lastAttemptAt: nowIso,
    updatedAt: nowIso,
  });

  const provider = getEmailProvider();
  const attemptCount = (record.attemptCount || 0) + 1;

  try {
    const result = await provider.send({
      to: record.to,
      from: record.from,
      replyTo: record.replyTo || undefined,
      subject: record.subject,
      html: record.htmlBody,
      text: record.textBody,
    });

    if (result.success) {
      const updates: Partial<EmailOutboxRecord> = {
        status: 'sent',
        sentAt: nowIso,
        lastError: null,
        providerUsed: result.provider,
        providerMessageId: result.messageId,
        attemptCount,
        updatedAt: nowIso,
      };

      await ref.update(updates);

      // Mise à jour de la fiche lead
      await syncLeadEmailStatus(record.leadCollection, record.leadId, record.recipientType, {
        to: record.to,
        status: 'sent',
        sentAt: nowIso,
        lastAttemptAt: nowIso,
        attemptCount,
        provider: result.provider,
      });

      return {
        outboxId,
        success: true,
        status: 'sent',
        messageId: result.messageId,
      };
    } else {
      // Échec d'envoi
      const isPermanent = attemptCount >= record.maxAttempts;
      const nextDelayMs = calculateBackoffMs(attemptCount);
      const nextRetryAt = new Date(now.getTime() + nextDelayMs).toISOString();

      const newStatus: OutboxStatus = isPermanent ? 'permanently_failed' : 'failed';

      await ref.update({
        status: newStatus,
        lastError: result.error || 'Erreur inconnue',
        attemptCount,
        nextRetryAt: isPermanent ? null : nextRetryAt,
        providerUsed: result.provider,
        updatedAt: nowIso,
      });

      await syncLeadEmailStatus(record.leadCollection, record.leadId, record.recipientType, {
        to: record.to,
        status: newStatus,
        lastAttemptAt: nowIso,
        attemptCount,
        lastError: result.error,
        provider: result.provider,
      });

      return {
        outboxId,
        success: false,
        status: newStatus,
        error: result.error,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const isPermanent = attemptCount >= record.maxAttempts;
    const nextDelayMs = calculateBackoffMs(attemptCount);
    const nextRetryAt = new Date(now.getTime() + nextDelayMs).toISOString();
    const newStatus: OutboxStatus = isPermanent ? 'permanently_failed' : 'failed';

    await ref.update({
      status: newStatus,
      lastError: errorMsg,
      attemptCount,
      nextRetryAt: isPermanent ? null : nextRetryAt,
      updatedAt: nowIso,
    });

    await syncLeadEmailStatus(record.leadCollection, record.leadId, record.recipientType, {
      to: record.to,
      status: newStatus,
      lastAttemptAt: nowIso,
      attemptCount,
      lastError: errorMsg,
    });

    return {
      outboxId,
      success: false,
      status: newStatus,
      error: errorMsg,
    };
  }
}

/**
 * Synchronise l'état de livraison sur le document principal du lead (quotes ou contacts).
 * Met également à jour le champ historique `notifyStatus` pour rétrocompatibilité.
 */
async function syncLeadEmailStatus(
  collectionName: LeadKind,
  leadId: string,
  recipientType: RecipientType,
  summary: RecipientDeliverySummary,
): Promise<void> {
  if (collectionName === 'newsletter') return;

  try {
    const leadRef = db().collection(collectionName).doc(leadId);
    const nowIso = new Date().toISOString();

    const updates: Record<string, unknown> = {
      [`emailStatus.${recipientType}`]: cleanData(summary),
      'emailStatus.updatedAt': nowIso,
    };

    // Pour l'ancien badge notifyStatus (basé historiquement sur l'agence)
    if (recipientType === 'agency') {
      updates.notifyStatus = summary.status === 'sent' ? 'sent' : `failed:${summary.lastError || 'unknown'}`;
    }

    await leadRef.update(updates);
  } catch (e) {
    console.error(`Erreur lors de la synchronisation de emailStatus sur ${collectionName}/${leadId}:`, e);
  }
}

/**
 * Récupère tous les documents outbox rattachés à une demande.
 */
export async function getOutboxForLead(collectionName: LeadKind, leadId: string): Promise<EmailOutboxRecord[]> {
  assertAdminConfigured();
  const snapshot = await db()
    .collection('emailOutbox')
    .where('leadCollection', '==', collectionName)
    .where('leadId', '==', leadId)
    .get();

  return snapshot.docs.map((d) => d.data() as EmailOutboxRecord);
}
