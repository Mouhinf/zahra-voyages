import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import * as z from 'zod';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { sendNewsletterNotifications } from '@/lib/email';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Inscription newsletter (footer).
//
// Avant correction : le formulaire affichait « Merci pour votre
// inscription ! » sans rien enregistrer nulle part — trompeur.
// Désormais : validation, anti-abus (rate limit), dédoublonnage par email,
// enregistrement dans la collection `newsletter` (écriture SDK Admin —
// la collection est fermée aux clients par les règles Firestore).
// ---------------------------------------------------------------------------

const newsletterSchema = z.object({
  email: z.string().trim().email('Email invalide').max(150).toLowerCase(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = clientIpFromHeaders(req.headers);
    if (!rateLimit('newsletter', ip, 5, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de tentatives, essayez plus tard' }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }
    const { email } = parsed.data;

    assertAdminConfigured();
    const db = getFirestore(adminApp);

    // Dédoublonnage : un email = un document (identifiant = email).
    const existing = await db.collection('newsletter').doc(email).get();
    if (existing.exists) {
      return NextResponse.json({ ok: true, already: true });
    }

    await db.collection('newsletter').doc(email).set({
      email,
      ip: ip === 'unknown' ? null : ip,
      createdAt: new Date().toISOString(),
      status: 'subscribed',
    });

    // Envoi de l'accusé de réception / bienvenue et notification agence (asynchrone)
    sendNewsletterNotifications(email).catch((err) => {
      console.error('Newsletter welcome email dispatch error:', err);
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof ConfigError) {
      console.error('Newsletter API config:', err.message);
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('Newsletter API error:', err);
    return NextResponse.json({ error: 'Inscription impossible pour le moment. Réessayez plus tard.' }, { status: 500 });
  }
}
