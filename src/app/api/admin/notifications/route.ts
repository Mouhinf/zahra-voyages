import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, AuthError } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

function db() {
  return getFirestore(adminApp);
}

export async function GET(request: NextRequest) {
  try {
    await requirePermission(request, 'notifications.view');
    const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
    const status = request.nextUrl.searchParams.get('status') || undefined;

    // Support des collections email_outbox et notifications
    const collectionName = 'email_outbox';
    let query = db().collection(collectionName).orderBy('createdAt', 'desc');
    if (status) {
      query = query.where('status', '==', status);
    }

    let snapshot = await query.limit(Math.min(limit, 100)).get();
    if (snapshot.empty) {
      // Fallback sur la collection notifications ou emailOutbox
      const fallbackQuery = db().collection('notifications').orderBy('createdAt', 'desc');
      snapshot = await fallbackQuery.limit(Math.min(limit, 100)).get();
    }

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('API /api/admin/notifications GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
