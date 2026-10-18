import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { getDossier, updateDossier, DOSSIER_STATUSES, type DossierStatus } from '@/lib/dossiers';
import { z } from 'zod';

export const runtime = 'nodejs';

const patchDossierSchema = z.object({
  status: z.enum(DOSSIER_STATUSES).optional(),
  assignedTo: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  passengersCount: z.number().int().min(1).optional(),
  totalAmountFcfa: z.number().nonnegative().optional(),
  paidAmountFcfa: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(request, 'dossiers.view');
    const { id } = await params;
    const dossier = await getDossier(id);
    if (!dossier) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 });
    }
    return NextResponse.json({ item: dossier });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/dossiers/[id] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission(request, 'dossiers.manage');
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = patchDossierSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de mise à jour invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await updateDossier(
      id,
      {
        status: parsed.data.status as DossierStatus | undefined,
        assignedTo: parsed.data.assignedTo,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        passengersCount: parsed.data.passengersCount,
        totalAmountFcfa: parsed.data.totalAmountFcfa,
        paidAmountFcfa: parsed.data.paidAmountFcfa,
        notes: parsed.data.notes,
      },
      actor
    );

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, dossier: result.dossier });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/dossiers/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
