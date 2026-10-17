import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { createHash } from 'node:crypto';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { sendQuoteNotifications, type QuoteEmailData } from '@/lib/email';
import {
  quoteSchema,
  cleanFirestoreData,
  type QuoteInput,
} from '@/lib/schemas/quote-schema';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Réception des demandes de devis (formulaire public).
//
// Sécurité :
// - Validation stricte Zod partagée (schéma universel client/serveur).
// - Pot de miel anti-robots (champ `website` caché).
// - Rate limiting : 5 demandes / 5 min / IP.
// - reCAPTCHA (optionnel, actif si RECAPTCHA_SECRET est défini).
// - Écriture via SDK Admin (règles Firestore protégeant la collection).
//
// Fiabilité commerciale :
// - Idempotence double-clic : vérification par `clientSubmissionId` et
//   empreinte cryptographique (fingerprint) sur 2 minutes.
// - Référence lisible et unique (ex. DV-20261017-4821) renvoyée au client.
// - Nettoyage strict des valeurs `undefined` pour Firestore (aucun crash).
// - Notification email outbox best-effort, statut consigné en base.
// ---------------------------------------------------------------------------

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // non configuré => pas de blocage
  if (!token) return false;
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      signal: AbortSignal.timeout(5000),
    });
    const j = await res.json();
    return j.success === true && j.score && j.score >= 0.3;
  } catch (e) {
    console.error('Recaptcha verify error', e);
    return false;
  }
}

/** Référence lisible et unique : DV-AAAAMMJJ-XXXX */
function buildReference(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DV-${y}${m}${d}-${rand}`;
}

/** Empreinte de requête pour déduplication rapide */
function buildFingerprint(ip: string, quote: QuoteInput): string {
  const parts = [
    ip,
    quote.phone.replace(/\s+/g, ''),
    quote.service,
    (quote.destination || '').trim().toLowerCase(),
    (quote.departureDate || '').trim(),
  ];
  return createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting avant tout traitement
    const ip = clientIpFromHeaders(req.headers);
    if (!rateLimit('quotes', ip, 5, 5 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Trop de demandes reçues depuis cette adresse. Veuillez patienter 5 minutes ou nous contacter sur WhatsApp.' },
        { status: 429 }
      );
    }

    // Garde-fou sur la taille brute de la requête
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
      return NextResponse.json(
        { error: 'Champs invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const quote: QuoteInput = parsed.data;

    // Pot de miel anti-robots : si le champ caché 'website' est rempli, répondre 200 neutre sans écrire
    if (quote.website) {
      return NextResponse.json({ ok: true, reference: 'DV-PROCESSED', deduped: true });
    }

    // Vérification reCAPTCHA si configuré
    const captchaOk = await verifyRecaptcha(quote.captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: 'Vérification captcha échouée' }, { status: 400 });
    }

    assertAdminConfigured();
    const db = getFirestore(adminApp);

    // -------------------------------------------------------------------------
    // VÉRIFICATION D'IDEMPOTENCE ET DÉDUPLICATION (DOUBLE CLIC VISITEUR)
    // -------------------------------------------------------------------------
    const nowIso = new Date().toISOString();
    const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    // 1. Idempotence par clientSubmissionId
    if (quote.clientSubmissionId) {
      const existingSubSnap = await db
        .collection('quotes')
        .where('clientSubmissionId', '==', quote.clientSubmissionId)
        .where('createdAt', '>=', tenMinAgo)
        .limit(1)
        .get();

      if (!existingSubSnap.empty) {
        const doc = existingSubSnap.docs[0];
        const docData = doc.data();
        return NextResponse.json({
          ok: true,
          id: doc.id,
          reference: docData.reference,
          deduped: true,
        });
      }
    }

    // 2. Déduplication par empreinte payload courte durée (2 min)
    const fp = buildFingerprint(ip, quote);
    const existingFpSnap = await db
      .collection('quotes')
      .where('fingerprint', '==', fp)
      .where('createdAt', '>=', twoMinAgo)
      .limit(1)
      .get();

    if (!existingFpSnap.empty) {
      const doc = existingFpSnap.docs[0];
      const docData = doc.data();
      return NextResponse.json({
        ok: true,
        id: doc.id,
        reference: docData.reference,
        deduped: true,
      });
    }

    // -------------------------------------------------------------------------
    // ENREGISTREMENT SÉCURISÉ DANS FIRESTORE
    // -------------------------------------------------------------------------
    const reference = buildReference();

    // Nettoyage de l'objet pour exclure tokens et champs superflus
    const rawRecord: Record<string, unknown> = {
      ...quote,
      reference,
      fingerprint: fp,
      ip: ip === 'unknown' ? null : ip,
      createdAt: nowIso,
      status: 'new',
      crmStatus: 'nouveau',
      priorite: 'normale',
      notifyStatus: 'pending',
    };
    delete rawRecord.captchaToken;
    delete rawRecord.website;

    // Suppression récursive de toute clé 'undefined' pour prévenir tout rejet Firestore
    const cleanRecord = cleanFirestoreData(rawRecord);

    const docRef = await db.collection('quotes').add(cleanRecord);

    // -------------------------------------------------------------------------
    // DISPATCH DES NOTIFICATIONS EMAIL TRANSACTIONNELLES (PROMPT 01)
    // -------------------------------------------------------------------------
    const quoteEmailData: QuoteEmailData = {
      reference,
      name: quote.name,
      email: quote.email ?? null,
      phone: quote.phone,
      service: quote.service,
      destination: quote.destination ?? null,
      departureDate: quote.departureDate ?? null,
      returnDate: quote.returnDate ?? null,
      travelers: quote.travelers ?? (quote.attendees ? String(quote.attendees) : null),
      notes: quote.message ?? null,
      message: quote.message ?? null,
      budget: quote.preferredCurrency ? `Devise : ${quote.preferredCurrency}` : null,
      accommodation: quote.roomType
        ? `${quote.roomType}${quote.nights ? ` (${quote.nights} nuits)` : ''}`
        : null,
      transport: quote.transportClass ?? null,
    };

    const notifyResults = await sendQuoteNotifications(docRef.id, quoteEmailData).catch((err) => {
      console.error('Quote notification dispatch error:', err);
      return null;
    });

    const agencyFailed = notifyResults?.agency && !notifyResults.agency.success;

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      reference,
      emailWarning: Boolean(agencyFailed),
    });
  } catch (err: unknown) {
    if (err instanceof ConfigError) {
      console.error('Quote API config error:', err.message);
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('Quote API error:', err);
    return NextResponse.json(
      {
        error: "Impossible d'enregistrer la demande pour le moment. Réessayez ou contactez directement nos conseillers sur WhatsApp.",
      },
      { status: 500 }
    );
  }
}
