import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listAdminUsers, createAdminUser } from '@/lib/user-admin';
import { ADMIN_ROLES, type AdminRole } from '@/lib/rbac';
import { z } from 'zod';

export const runtime = 'nodejs';

const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(100),
  role: z.enum(ADMIN_ROLES),
  phoneNumber: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'users.view');
    const users = await listAdminUsers();
    return NextResponse.json({ items: users });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/users GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission(request, 'users.manage');
    const body = await request.json().catch(() => null);
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données utilisateur invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createAdminUser(
      {
        email: parsed.data.email,
        displayName: parsed.data.displayName,
        role: parsed.data.role as AdminRole,
        phoneNumber: parsed.data.phoneNumber,
      },
      actor
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user: result.user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/users POST error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
