import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { listQuotes } from '@/lib/admin-db';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// CRM devis (admin) — liste des demandes reçues.
// Avant correction : fichier vide (route inutilisable). Désormais implémenté
// et protégé par verifyAdminToken (token admin + rôle vérifiés côté serveur).
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const limitParam = Number(request.nextUrl.searchParams.get('limit') || '200');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 500) : 200;

    const items = await listQuotes(limit);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin quotes API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
