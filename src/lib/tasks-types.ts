export const TASK_STATUSES = ['todo', 'in_progress', 'done', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminée',
  cancelled: 'Annulée',
};

export const TASK_PRIORITIES = ['basse', 'normale', 'haute', 'urgente'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string; // Email ou UID du collaborateur
  assignedBy: string; // Email ou UID de l'assignateur
  dueDate: string;    // Date d'échéance ISO (ex: YYYY-MM-DD ou ISO string)
  priority: TaskPriority;
  status: TaskStatus;
  linkedLeadId?: string;
  linkedDossierId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
