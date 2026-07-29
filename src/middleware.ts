// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const config = {
  matcher: [
    '/((?!_next|api|favicon|[\\w-]+\\.\\w+).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const db = getDbInstance();
  const analyticsCol = collection(db, 'analytics');

  // Détermine la source
  const ua = req.headers.get('user-agent') || '';
  let source = 'direct';
  const referrer = req.headers.get('referer') || '';

  if (ua.includes('Googlebot')) {
    source = 'googlebot';
  } else if (referrer) {
    // Détecte quelques réseaux sociaux par leur domaine
    if (referrer.includes('facebook.com')) source = 'facebook';
    else if (referrer.includes('google.com')) source = 'google';
    else if (referrer.includes('twitter.com')) source = 'twitter';
    else source = 'referral';
  }

  // L'ID utilisateur sera ajouté côté client (via client‑side logging)
  const userId = null;

  const analyticsDoc = {
    page: url.pathname,
    timestamp: Timestamp.now(),
    source,
    referrer,
    userId,
    method: req.method,
  };

  try {
    await addDoc(analyticsCol, analyticsDoc);
  } catch (e) {
    console.error('Erreur lors de l\'écriture d\'un log analytics:', e);
  }

  return NextResponse.next();
}