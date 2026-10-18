import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listTasks, createTask, TASK_STATUSES, TASK_PRIORITIES, type TaskStatus, type TaskPriority } from '@/lib/tasks';
import { z } from 'zod';

export const runtime = 'nodejs';

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  assignedTo: z.string().min(2),
  dueDate: z.string().min(4),
  priority: z.enum(TASK_PRIORITIES).default('normale'),
  status: z.enum(TASK_STATUSES).default('todo'),
  linkedLeadId: z.string().optional(),
  linkedDossierId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requirePermission(request, 'tasks.view');
    const assignedTo = request.nextUrl.searchParams.get('assignedTo') || undefined;
    const status = request.nextUrl.searchParams.get('status') as TaskStatus | null;
    const priority = request.nextUrl.searchParams.get('priority') as TaskPriority | null;

    // Si rôle COMMERCIAL, restreindre à ses tâches si non précisé autrement
    const targetAssignee = session.role === 'COMMERCIAL' && !assignedTo ? session.email : assignedTo;

    const items = await listTasks({
      assignedTo: targetAssignee,
      status: status || undefined,
      priority: priority || undefined,
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/tasks GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission(request, 'tasks.manage');
    const body = await request.json().catch(() => null);
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de tâche invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createTask(
      {
        title: parsed.data.title,
        description: parsed.data.description,
        assignedTo: parsed.data.assignedTo,
        dueDate: parsed.data.dueDate,
        priority: parsed.data.priority as TaskPriority,
        status: parsed.data.status as TaskStatus,
        linkedLeadId: parsed.data.linkedLeadId,
        linkedDossierId: parsed.data.linkedDossierId,
      },
      actor
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, task: result.task }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/tasks POST error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
