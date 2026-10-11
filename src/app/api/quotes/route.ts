import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import * as z from 'zod';
import { adminApp } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Réception des demandes de devis (formulaire public).
//
// Sécurité :
// - Validation stricte Zod : seuls les champs listés sont acceptés, avec
//   longueurs bornées (les champs inconnus sont écartés — plus d'écriture
//   de données arbitraires en base).
// - Rate limiting : 5 demandes / 5 min / IP.
// - reCAPTCHA (optionnel, activé si RECAPTCHA_SECRET est défini).
// - Écriture via SDK Admin (les règles Firestore interdisent l'écriture
//   client sur `quotes`).
// ---------------------------------------------------------------------------

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis').max(100),
  phone: z.string().trim().min(6, 'Téléphone requis').max(30),
  email: z.string().trim().email().max(150).optional().or(z.literal('').transform(() => undefined)),
  service: z.string().trim().max(80).optional(),
  destination: z.string().trim().max(120).optional(),
  departureCountry: z.string().trim().max(80).optional(),
  preferredCurrency: z.enum(['XOF', 'EUR', 'USD']).optional(),
  travelers: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional(),
  captchaToken: z.string().max(2000).optional(),
});

type QuoteInput = z.infer<typeof quoteSchema>;

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // not configured => skip
  if (!token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const j = await res.json();
    return j.success === true && j.score && j.score >= 0.3;
  } catch (e) {
    console.error('Recaptcha verify error', e);
    return false;
  }
}

async function sendNotificationEmail(quote: Record<string, unknown>) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@' + (process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'slaac-voyages');
  if (!SENDGRID_API_KEY || !NOTIFY_EMAIL) return;

  const payload = { ...quote };
  delete payload.captchaToken;
  const content = Object.entries(payload).map(([k, v]) => `- ${k}: ${String(v ?? '')}`).join('\n');
  const body = {
    personalizations: [{ to: [{ email: NOTIFY_EMAIL }] }],
    from: { email: FROM_EMAIL },
    subject: `Nouveau devis SLAAC Voyages — ${quote.service || 'devis'}`,
    content: [{ type: 'text/plain', value: `Nouveau devis reçu:\n\n${content}` }],
  };

  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error('SendGrid error', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting avant tout traitement lourd.
    const ip = clientIpFromHeaders(req.headers);
    if (!rateLimit('quotes', ip, 5, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de demandes, essayez plus tard' }, { status: 429 });
    }

    // Garde-fou sur la taille brute de la requête.
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 64 * 1024) {
      return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = quoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Champs invalides', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const quote: QuoteInput = parsed.data;

    // verify recaptcha when configured
    const captchaOk = await verifyRecaptcha(quote.captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: 'Vérification captcha échouée' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const record = { ...quote };
    delete record.captchaToken;
    const docRef = await db.collection('quotes').add({
      ...record,
      ip: ip === 'unknown' ? null : ip,
      createdAt: new Date().toISOString(),
      status: 'new',
    });

    // send notification email if configured (best-effort)
    sendNotificationEmail({ id: docRef.id, ...record }).catch(() => {});

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (err: unknown) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
