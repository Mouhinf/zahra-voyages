import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { adminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Inscriptions newsletter (admin) — consultation. Protégé par verifyAdminToken.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    await verifyAdminToken(request);

    const limitParam = Number(request.nextUrl.searchParams.get('limit') || '500');
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(Math.trunc(limitParam), 1), 1000) : 500;

    const db = getFirestore(adminApp);
    const snapshot = await db
      .collection('newsletter')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin newsletter API error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
