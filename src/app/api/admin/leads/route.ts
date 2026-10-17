import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { patchLead, patchSchema } from '@/lib/crm';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// CRM (admin) — mise à jour d'une demande : statut, notes internes,
// responsable attribué. Protégé par verifyAdminToken (identité + rôle
// vérifiés côté serveur) ; l'historique horodaté est tenu par le serveur.
// ---------------------------------------------------------------------------

export async function PATCH(req: NextRequest) {
  let actor = 'admin';
  try {
    const session = await verifyAdminToken(req);
    actor = session.email ?? session.uid;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Champs invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const patch = parsed.data;
    if (
      patch.crmStatus === undefined &&
      patch.priorite === undefined &&
      patch.nextFollowUpAt === undefined &&
      patch.assignee === undefined &&
      !patch.note
    ) {
      return NextResponse.json({ error: 'Aucune modification demandée' }, { status: 400 });
    }

    const result = await patchLead(patch, actor);
    if (!result.updated) {
      return NextResponse.json({ error: result.error ?? 'Modification impossible' }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      crmStatus: result.crmStatus,
      priorite: result.priorite,
      nextFollowUpAt: result.nextFollowUpAt,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin leads PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
