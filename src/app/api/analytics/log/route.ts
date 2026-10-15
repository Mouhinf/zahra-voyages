import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { logAnalyticsEvent } from '@/lib/admin-db';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { isBot } from '@/lib/analytics';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Journalisation des événements analytics (balise et actions CTA).
//
// Sécurité & Performance :
// - Rate limiting : 120 événements / min / IP.
// - Filtrage des robots (User-Agent bots ignorés sans consommer d'écritures).
// - Aucune IP brute stockée en base.
// - Pays extrait de l'en-tête anonyme Vercel `x-vercel-ip-country`.
// - Incréments atomiques dans les documents journaliers pré-agrégés.
// ---------------------------------------------------------------------------

const eventSchema = z.object({
  page: z.string().max(200).regex(/^\//, 'page doit commencer par /').optional(),
  eventType: z.enum(['page_view', 'cta_click', 'whatsapp_click', 'quote_start']).optional(),
  source: z.string().max(50).optional(),
  medium: z.string().max(50).optional(),
  campaign: z.string().max(80).optional(),
  referrer: z.string().max(500).optional().nullable(),
  device: z.enum(['mobile', 'desktop', 'tablet']).optional(),
  method: z.string().max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    if (isBot(userAgent)) {
      // Ignorer silencieusement les robots
      return NextResponse.json({ success: true, ignored: 'bot' });
    }

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

    const vercelCountry = request.headers.get('x-vercel-ip-country');

    await logAnalyticsEvent({
      page: (event.page || '/').slice(0, 200),
      eventType: event.eventType || 'page_view',
      source: event.source || 'direct',
      medium: event.medium,
      campaign: event.campaign,
      referrer: event.referrer ? String(event.referrer).slice(0, 500) : null,
      device: event.device || 'desktop',
      ip,
      userAgent,
      vercelCountry,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur écriture analytics:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
