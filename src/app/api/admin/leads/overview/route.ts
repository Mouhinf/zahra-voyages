import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { crmOverview, recentLeads } from '@/lib/crm';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Vue d'ensemble CRM (page Demandes) : compteurs réels et dernières demandes.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);
    const [crm, recent] = await Promise.all([crmOverview(), recentLeads(6)]);
    return NextResponse.json({ crm, recent });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin leads overview error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
