import { NextRequest, NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { page, source, referrer, userId, method } = await request.json();

    const db = getDbInstance();
    await addDoc(collection(db, 'analytics'), {
      page: page || '/',
      timestamp: Timestamp.now(),
      source: source || 'direct',
      referrer: referrer || null,
      userId: userId || null,
      method: method || 'GET',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur écriture analytics:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
