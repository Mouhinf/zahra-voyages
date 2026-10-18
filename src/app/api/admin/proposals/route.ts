import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { listProposals, createProposal, PROPOSAL_STATUSES, type ProposalStatus } from '@/lib/quotes-workflow';
import { z } from 'zod';

export const runtime = 'nodejs';

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPriceFcfa: z.number().nonnegative(),
});

const createProposalSchema = z.object({
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  service: z.string().min(2),
  destination: z.string().optional(),
  items: z.array(lineItemSchema).min(1),
  taxRatePct: z.number().min(0).max(100).default(0),
  discountFcfa: z.number().nonnegative().default(0),
  validDays: z.number().int().positive().default(15),
  termsAndConditions: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'quotes.view');
    const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
    const status = request.nextUrl.searchParams.get('status') as ProposalStatus | null;

    const items = await listProposals(limit, status || undefined);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/proposals GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission(request, 'quotes.manage');
    const body = await request.json().catch(() => null);
    const parsed = createProposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données de devis invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const result = await createProposal(parsed.data, actor);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, proposal: result.proposal }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/proposals POST error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
