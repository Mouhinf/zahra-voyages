import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { getLead, LEAD_COLLECTIONS, type LeadCollection } from '@/lib/crm';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Fiche d'une demande (admin) : données, notes et historique.
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  try {
    await verifyAdminToken(request);
    const { collection, id } = await params;

    if (!(LEAD_COLLECTIONS as readonly string[]).includes(collection)) {
      return NextResponse.json({ error: 'Collection inconnue' }, { status: 404 });
    }
    if (!id || id.length > 128) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }

    const lead = await getLead(collection as LeadCollection, id);
    if (!lead) {
      return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 });
    }
    return NextResponse.json({ item: lead });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin lead GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
