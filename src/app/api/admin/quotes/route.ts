import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { pageOfLeads } from '@/lib/lead-api';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// CRM devis (admin) — une page de demandes, les plus récentes d'abord.
// Pagination par curseur : ?limit=50&cursor=<id du dernier élément reçu>.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);
    return await pageOfLeads(request, 'quotes');
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin quotes API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
