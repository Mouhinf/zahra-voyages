/**
 * Gestion des Tâches et Relances Collaborateurs — SLAAC Voyages.
 *
 * Permet l'organisation du travail quotidien :
 * todo -> in_progress -> done (ou cancelled).
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp, type AdminSession } from './firebase-admin';
import { logAuditEvent } from './audit';

function db(): Firestore {
  return getFirestore(adminApp);
}

const COLLECTION = 'team_tasks';

export * from './tasks-types';
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_PRIORITIES,
  type TaskStatus,
  type TaskPriority,
  type TeamTask,
} from './tasks-types';

export async function listTasks(filter?: {
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  limit?: number;
}): Promise<TeamTask[]> {
  try {
    let query = db().collection(COLLECTION).orderBy('dueDate', 'asc');

    if (filter?.assignedTo) {
      query = query.where('assignedTo', '==', filter.assignedTo);
    }
    if (filter?.status) {
      query = query.where('status', '==', filter.status);
    }
    if (filter?.priority) {
      query = query.where('priority', '==', filter.priority);
    }

    const snapshot = await query.limit(filter?.limit || 100).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<TeamTask, 'id'>),
    }));
  } catch (err) {
    console.error('[Tasks] Erreur listTasks:', err);
    return [];
  }
}

export async function createTask(
  data: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt' | 'completedAt' | 'assignedBy'>,
  actor: AdminSession
): Promise<{ ok: boolean; task?: TeamTask; error?: string }> {
  try {
    const now = new Date().toISOString();
    const newDocRef = db().collection(COLLECTION).doc();

    const task: TeamTask = {
      ...data,
      id: newDocRef.id,
      assignedBy: actor.email,
      createdAt: now,
      updatedAt: now,
    };

    await newDocRef.set(task);

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'TASK_CREATED',
      resource: 'tasks',
      resourceId: newDocRef.id,
      details: { title: data.title, assignedTo: data.assignedTo, priority: data.priority },
    });

    return { ok: true, task };
  } catch (err: unknown) {
    console.error('[Tasks] Erreur createTask:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}

export async function updateTask(
  id: string,
  patch: Partial<Omit<TeamTask, 'id' | 'createdAt' | 'assignedBy'>>,
  actor: AdminSession
): Promise<{ ok: boolean; task?: TeamTask; error?: string }> {
  try {
    const docRef = db().collection(COLLECTION).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return { ok: false, error: 'Tâche introuvable.' };
    }

    const now = new Date().toISOString();
    const isCompleted = patch.status === 'done';

    const updated = {
      ...patch,
      updatedAt: now,
      ...(isCompleted ? { completedAt: now } : {}),
    };

    await docRef.update(updated);

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: isCompleted ? 'TASK_COMPLETED' : 'TASK_UPDATED',
      resource: 'tasks',
      resourceId: id,
      details: { patch },
    });

    return {
      ok: true,
      task: {
        ...(existing.data() as TeamTask),
        ...updated,
        id,
      },
    };
  } catch (err: unknown) {
    console.error(`[Tasks] Erreur updateTask ${id}:`, err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}
