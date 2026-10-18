import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { sendContactNotifications } from '@/lib/email';
import { createHash } from 'node:crypto';
import { contactSchema, type ContactInput } from '@/lib/schemas/contact-schema';
import { cleanFirestoreData } from '@/lib/schemas/quote-schema';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Formulaire de contact public.
//
// Fiabilité :
// - 200 uniquement si le document est bien écrit dans Firestore.
// - L'email à l'agence est best-effort : un échec est consigné dans le
//   document (notifyStatus) — la demande reste consultable côté admin.
//
// Anti-spam & Idempotence :
// - Rate limiting : 5 messages / 5 min / IP.
// - Champ pot de miel (website) : invisible pour les humains, rempli par
//   les robots → requête ignorée silencieusement (réponse 200 neutre).
// - Déduplication : même email + même empreinte de message moins de 10
//   minutes avant → pas de second document (réponse ok, flag deduped).
// - Nettoyage strict Firestore (cleanFirestoreData) contre tout 'undefined'.
// ---------------------------------------------------------------------------

function fingerprint(email: string, message: string): string {
  return createHash('sha256')
    .update(`${email.toLowerCase()}|${message.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIpFromHeaders(req.headers);
    if (!rateLimit('contact', ip, 5, 5 * 60 * 1000)) {
      return NextResponse.json({ error: 'Trop de messages, essayez plus tard' }, { status: 429 });
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 32 * 1024) {
      return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Champs invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data: ContactInput = parsed.data;

    // Pot de miel rempli → robot. Réponse neutre pour ne rien révéler.
    if (data.website) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    assertAdminConfigured();
    const db = getFirestore(adminApp);

    // Déduplication : identique (email + message) dans les 10 dernières minutes.
    const fp = fingerprint(data.email, data.message);
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const dupSnapshot = await db
      .collection('contacts')
      .where('fingerprint', '==', fp)
      .where('createdAt', '>=', tenMinAgo)
      .limit(1)
      .get();
    if (!dupSnapshot.empty) {
      return NextResponse.json({ ok: true, deduped: true });
    }

    const rawRecord: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message,
      fingerprint: fp,
      ip: ip === 'unknown' ? null : ip,
      createdAt: new Date().toISOString(),
      status: 'new',
      crmStatus: 'nouveau',
      priorite: 'normale',
      notifyStatus: 'pending',
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      referrer: data.referrer,
      landingPage: data.landingPage,
      locale: data.locale || 'fr',
    };

    const cleanRecord = cleanFirestoreData(rawRecord);
    const docRef = await db.collection('contacts').add(cleanRecord);

    // Notification transactionnelle résiliente (Client + Agence + Responsable)
    // avec persistance dans l'Outbox Firestore et clé d'idempotence.
    // L'échec éventuel de l'envoi n'annule jamais la demande enregistrée.
    const contactData = {
      id: docRef.id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message,
      lang: data.locale === 'en' ? ('en' as const) : ('fr' as const),
    };

    const notifyResults = await sendContactNotifications(docRef.id, contactData).catch((err) => {
      console.error('Contact notification dispatch error:', err);
      return null;
    });

    const agencyFailed = notifyResults?.agency && !notifyResults.agency.success;

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      // Signal explicite pour l'administration (non montré au visiteur).
      emailWarning: Boolean(agencyFailed),
    });
  } catch (err: unknown) {
    if (err instanceof ConfigError) {
      console.error('Contact API config:', err.message);
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le message pour le moment. Réessayez ou contactez-nous sur WhatsApp." },
      { status: 500 }
    );
  }
}
