import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { updateTask, TASK_STATUSES, TASK_PRIORITIES, type TaskStatus, type TaskPriority } from '@/lib/tasks';
import { z } from 'zod';

export const runtime = 'nodejs';

const patchTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  status: z.enum(TASK_STATUSES).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission(request, 'tasks.manage');
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = patchTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de mise à jour invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await updateTask(
      id,
      {
        title: parsed.data.title,
        description: parsed.data.description,
        assignedTo: parsed.data.assignedTo,
        dueDate: parsed.data.dueDate,
        priority: parsed.data.priority as TaskPriority | undefined,
        status: parsed.data.status as TaskStatus | undefined,
      },
      actor
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, task: result.task });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/tasks/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
