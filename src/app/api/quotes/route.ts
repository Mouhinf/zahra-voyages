import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

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

async function sendNotificationEmail(quote: any) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@' + (process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'slaac-voyages');
  if (!SENDGRID_API_KEY || !NOTIFY_EMAIL) return;

  const content = Object.entries(quote).map(([k,v])=>`- ${k}: ${v}`).join('\n');
  const payload = {
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
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('SendGrid error', e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name || !body.phone) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // verify recaptcha when configured
    const captchaOk = await verifyRecaptcha(body.captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: 'Vérification captcha échouée' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const docRef = await db.collection('quotes').add({
      ...body,
      createdAt: new Date().toISOString(),
      status: 'new',
    });

    // send notification email if configured (best-effort)
    sendNotificationEmail({ id: docRef.id, ...body }).catch(() => {});

    return NextResponse.json({ ok: true, id: docRef.id });
  } catch (err: any) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
