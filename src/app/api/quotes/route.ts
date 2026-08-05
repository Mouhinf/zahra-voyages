import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.phone) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const docRef = await db.collection('quotes').add({
      ...body,
      createdAt: new Date().toISOString(),
      status: 'new',
    });

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (err: any) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
