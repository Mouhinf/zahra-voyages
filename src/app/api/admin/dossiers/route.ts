import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listDossiers, createDossier, DOSSIER_STATUSES, type DossierStatus } from '@/lib/dossiers';
import { z } from 'zod';

export const runtime = 'nodejs';

const createDossierSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  service: z.string().min(2),
  destination: z.string().min(2),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  passengersCount: z.number().int().min(1).default(1),
  assignedTo: z.string().optional(),
  status: z.enum(DOSSIER_STATUSES).default('devis_en_cours'),
  totalAmountFcfa: z.number().nonnegative().default(0),
  paidAmountFcfa: z.number().nonnegative().default(0),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'dossiers.view');
    const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
    const status = request.nextUrl.searchParams.get('status') as DossierStatus | null;
    const assignedTo = request.nextUrl.searchParams.get('assignedTo') || undefined;

    const items = await listDossiers(limit, status || undefined, assignedTo);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/dossiers GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission(request, 'dossiers.manage');
    const body = await request.json().catch(() => null);
    const parsed = createDossierSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de dossier invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createDossier(parsed.data, actor);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, dossier: result.dossier }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/dossiers POST error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
