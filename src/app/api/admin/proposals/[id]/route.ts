import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { generateProposalHtml, type CommercialProposal, PROPOSAL_STATUSES, type ProposalStatus } from '@/lib/quotes-workflow';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';
import { logAuditEvent } from '@/lib/audit';
import { z } from 'zod';

export const runtime = 'nodejs';

function db() {
  return getFirestore(adminApp);
}

const patchProposalSchema = z.object({
  status: z.enum(PROPOSAL_STATUSES).optional(),
  approvedBy: z.string().optional(),
  sentAt: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(request, 'quotes.view');
    const { id } = await params;
    const doc = await db().collection('commercial_proposals').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
    }

    const proposal = { id: doc.id, ...(doc.data() as Omit<CommercialProposal, 'id'>) };

    const format = request.nextUrl.searchParams.get('format');
    const acceptHeader = request.headers.get('accept') || '';

    if (format === 'html' || acceptHeader.includes('text/html')) {
      const html = generateProposalHtml(proposal);
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    return NextResponse.json({ item: proposal });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/proposals/[id] GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requirePermission(request, 'quotes.manage');
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = patchProposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides', details: parsed.error.flatten() }, { status: 400 });
    }

    const docRef = db().collection('commercial_proposals').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updated = {
      ...parsed.data,
      updatedAt: now,
      ...(parsed.data.status === 'valide' ? { approvedBy: actor.email } : {}),
      ...(parsed.data.status === 'envoye' ? { sentAt: now } : {}),
    };

    await docRef.update(updated);

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: parsed.data.status === 'valide' ? 'QUOTE_APPROVED' : parsed.data.status === 'envoye' ? 'QUOTE_SENT' : 'QUOTE_UPDATED',
      resource: 'quotes',
      resourceId: id,
      details: { patch: parsed.data },
    });

    return NextResponse.json({
      ok: true,
      proposal: {
        ...(existing.data() as CommercialProposal),
        ...updated,
        id,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/proposals/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
