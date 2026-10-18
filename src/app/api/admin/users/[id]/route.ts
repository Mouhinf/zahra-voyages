import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { getAdminUser, updateAdminUser, deactivateAdminUser } from '@/lib/user-admin';
import { ADMIN_ROLES, type AdminRole } from '@/lib/rbac';
import { z } from 'zod';

export const runtime = 'nodejs';

const patchUserSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  isActive: z.boolean().optional(),
  phoneNumber: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(request, 'users.view');
    const { id } = await params;
    const user = await getAdminUser(id);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }
    return NextResponse.json({ item: user });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/users/[id] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission(request, 'users.manage');
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = patchUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de mise à jour invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await updateAdminUser(
      id,
      {
        displayName: parsed.data.displayName,
        role: parsed.data.role as AdminRole | undefined,
        isActive: parsed.data.isActive,
        phoneNumber: parsed.data.phoneNumber,
      },
      actor
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user: result.user });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/users/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission(request, 'users.manage');
    const { id } = await params;

    const result = await deactivateAdminUser(id, actor);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: 'Compte désactivé avec succès' });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/users/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
