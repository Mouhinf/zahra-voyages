/**
 * Système de Journal d'Audit et Traçabilité — SLAAC Voyages.
 *
 * Enregistre côté serveur les opérations critiques dans la collection Firestore `admin_audit_logs`.
 * Règle d'or : Aucune donnée sensible (mot de passe, jeton, carte bancaire) n'est jamais journalisée.
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp } from './firebase-admin';
import type { AdminRole } from './rbac';

function db(): Firestore {
  return getFirestore(adminApp);
}

export const AUDIT_ACTIONS = [
  'LOGIN',
  'USER_CREATED',
  'USER_UPDATED',
  'USER_DEACTIVATED',
  'USER_ROLE_CHANGED',
  'LEAD_VIEWED',
  'LEAD_ASSIGNED',
  'LEAD_STATUS_CHANGED',
  'LEAD_NOTE_ADDED',
  'QUOTE_CREATED',
  'QUOTE_UPDATED',
  'QUOTE_APPROVED',
  'QUOTE_SENT',
  'BOOKING_CREATED',
  'BOOKING_UPDATED',
  'BOOKING_CONFIRMED',
  'TASK_CREATED',
  'TASK_UPDATED',
  'TASK_COMPLETED',
  'CONTENT_CREATED',
  'CONTENT_UPDATED',
  'CONTENT_PUBLISHED',
  'CONTENT_DELETED',
  'EXPORT_DOWNLOADED',
  'SETTINGS_CHANGED',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditLogEntry {
  id?: string;
  actorId: string;
  actorEmail: string;
  actorRole: AdminRole | string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  timestamp: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

/**
 * Assainit les détails de l'événement pour exclure tout mot de passe, secret ou token.
 */
export function sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const sanitized = { ...details };
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.serviceAccount;
  delete sanitized.apiKey;
  return sanitized;
}

/**
 * Écrit une entrée d'audit dans Firestore (`admin_audit_logs`).
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>): Promise<string> {
  try {
    const docRef = db().collection('admin_audit_logs').doc();
    const payload: AuditLogEntry = {
      ...entry,
      details: sanitizeDetails(entry.details),
      timestamp: new Date().toISOString(),
    };

    await docRef.set(payload);
    return docRef.id;
  } catch (err) {
    console.error('[AuditLog] Erreur lors de l\'enregistrement de l\'audit:', err);
    return '';
  }
}

/**
 * Récupère les entrées d'audit récentes (réservé aux Super Administrateurs et Administrateurs).
 */
export async function listAuditLogs(
  limit = 100,
  actionFilter?: AuditAction,
  resourceFilter?: string
): Promise<AuditLogEntry[]> {
  try {
    let query = db().collection('admin_audit_logs').orderBy('timestamp', 'desc');

    if (actionFilter) {
      query = query.where('action', '==', actionFilter);
    }
    if (resourceFilter) {
      query = query.where('resource', '==', resourceFilter);
    }

    const snapshot = await query.limit(Math.min(limit, 200)).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<AuditLogEntry, 'id'>),
    }));
  } catch (err) {
    console.error('[AuditLog] Erreur lecture audit logs:', err);
    return [];
  }
}
