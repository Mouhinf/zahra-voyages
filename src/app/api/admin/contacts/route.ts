import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Messages de contact (admin) — consultation des demandes reçues via
// /api/contact. Protégé par verifyAdminToken.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const limitParam = Number(request.nextUrl.searchParams.get('limit') || '200');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 500) : 200;

    const db = getFirestore((await import('@/lib/firebase-admin')).adminApp);
    const snapshot = await db
      .collection('contacts')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin contacts API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
