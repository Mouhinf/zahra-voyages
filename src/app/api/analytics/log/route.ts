import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { logAnalyticsEvent } from '@/lib/admin-db';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Journalisation des visites (appelé par le middleware).
//
// Sécurité :
// - Écriture via SDK Admin (les règles Firestore interdisent tout accès
//   client à `analytics`).
// - Validation stricte : seuls page/source/referrer/method sont acceptés,
//   avec formats et longueurs bornés.
// - Rate limiting : 120 événements / min / IP (un onglet qui boucle ne
//   doit pas saturer la base).
// ---------------------------------------------------------------------------

const eventSchema = z.object({
  page: z.string().max(200).regex(/^\//, 'page doit commencer par /').optional(),
  source: z.enum(['direct', 'googlebot', 'facebook', 'google', 'twitter', 'referral']).optional(),
  referrer: z.string().max(500).optional().nullable(),
  userId: z.null().optional(),
  method: z.enum(['GET', 'POST']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = clientIpFromHeaders(request.headers);
    if (!rateLimit('analytics', ip, 120, 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
    }

    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Événement invalide' }, { status: 400 });
    }
    const event = parsed.data;

    await logAnalyticsEvent({
      page: (event.page || '/').slice(0, 200),
      source: event.source || 'direct',
      referrer: event.referrer ? String(event.referrer).slice(0, 500) : null,
      userId: null,
      method: event.method || 'GET',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur écriture analytics:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
