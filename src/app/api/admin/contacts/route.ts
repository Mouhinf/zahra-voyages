import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { pageOfLeads } from '@/lib/lead-api';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Messages de contact (admin) — même pagination que les devis.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);
    return await pageOfLeads(request, 'contacts');
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin contacts API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
