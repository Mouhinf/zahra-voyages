// src/middleware.ts
import { NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Middleware qui enregistre chaque requête dans Firestore (collection "analytics").
// Enregistre :
//   - page (pathname)
//   - timestamp
//   - source (direct, facebook, google, googlebot, referral)
//   - referrer (url d'origine)
//   - userId (null côté serveur, rempli côté client)
//   - method (GET/POST/etc)
//
// On ignore les requêtes OPTIONS (preflight CORS).

export async function middleware(req: Request) {
  // Clone de l'URL pour préserver l'original
  const url = req.nextUrl.clone();

  // Exécute la requête (middleware suivant)
  await NextResponse.next();

  // Si c'est une requête OPTIONS (preflight CORS), on ne logge pas
  if (req.method === 'OPTIONS') {
    return NextResponse.next();
  }

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