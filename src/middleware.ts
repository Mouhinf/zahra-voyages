// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next|api|favicon|[\\w-]+\\.\\w+).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

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

  const analyticsPayload = {
    page: url.pathname,
    source,
    referrer: referrer || null,
    userId: null,
    method: req.method,
  };

  fetch(`${url.origin}/api/analytics/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analyticsPayload),
  }).catch(() => {});

  return NextResponse.next();
}