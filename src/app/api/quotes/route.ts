import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import * as z from 'zod';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { sendQuoteNotifications, type QuoteEmailData } from '@/lib/email';

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
//
// Fiabilité :
// - 200 uniquement si le document est écrit ; référence lisible unique
//   (ex. DV-20261011-4821) renvoyée au client et stockée.
// - Notification email best-effort, statut consigné dans le document.
// ---------------------------------------------------------------------------

// Services réellement commercialisés (catalogue + page /assistance-voyage).
const SERVICE_VALUES = [
  'hebergement',
  'transport',
  'voyages-croisieres',
  'excursions',
  'tourisme-affaires',
  'reservation-express',
  'assistance-visa',
  'assurance-voyage',
  'preinscription-universitaire',
  'prise-de-rendez-vous',
] as const;

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis').max(100),
  phone: z.string().trim().min(6, 'Téléphone requis').max(30),
  email: z.string().trim().email().max(150).optional().or(z.literal('').transform(() => undefined)),
  service: z.enum(SERVICE_VALUES).default('reservation-express'),
  destination: z.string().trim().max(120).optional(),
  departureCountry: z.string().trim().max(80).optional(),
  preferredCurrency: z.enum(['XOF', 'EUR', 'USD']).optional(),
  travelers: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional(),
  // Champs conditionnels par service (bornés, tous optionnels).
  nights: z.coerce.number().int().min(1).max(365).optional(),
  roomType: z.enum(['standard', 'deluxe', 'suite']).optional(),
  transportClass: z.enum(['economy', 'business', 'first']).optional(),
  roundTrip: z.boolean().optional(),
  departureDate: z.string().trim().max(30).optional(),
  returnDate: z.string().trim().max(30).optional(),
  durationDays: z.coerce.number().int().min(1).max(365).optional(),
  cabinType: z.enum(['inside', 'oceanview', 'balcony', 'suite']).optional(),
  excursionDate: z.string().trim().max(30).optional(),
  pickupLocation: z.string().trim().max(120).optional(),
  attendees: z.coerce.number().int().min(1).max(10000).optional(),
  eventType: z.string().trim().max(120).optional(),
  // Traçabilité commerciale : page / bouton à l'origine de la demande.
  source: z.string().trim().max(60).optional(),
  captchaToken: z.string().max(2000).optional(),
});

type QuoteInput = z.infer<typeof quoteSchema>;

const SERVICE_LABELS: Record<string, string> = {
  'hebergement': 'Hébergement',
  'transport': 'Transport',
  'voyages-croisieres': 'Voyages & Croisières',
  'excursions': 'Excursions',
  'tourisme-affaires': 'Tourisme d\'affaires',
  'reservation-express': 'Réservation Express',
  'assistance-visa': 'Assistance visa',
  'assurance-voyage': 'Assurance voyage',
  'preinscription-universitaire': 'Préinscription universitaire',
  'prise-de-rendez-vous': 'Prise de rendez-vous',
};

async function verifyRecaptcha(token?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return true; // not configured => skip
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

/** Référence lisible et unique : DV-AAAAMMJJ-XXXX (identifiant aléatoire). */
function buildReference(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DV-${y}${m}${d}-${rand}`;
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

    assertAdminConfigured();
    const db = getFirestore(adminApp);
    const record = { ...quote };
    delete record.captchaToken;

    const reference = buildReference();
    const docRef = await db.collection('quotes').add({
      ...record,
      reference,
      ip: ip === 'unknown' ? null : ip,
      createdAt: new Date().toISOString(),
      status: 'new',
      notifyStatus: 'pending',
    });

    // Notification transactionnelle résiliente (Client + Agence + Responsable)
    // avec persistance dans l'Outbox Firestore et clé d'idempotence.
    // L'échec éventuel de l'envoi n'annule jamais la demande enregistrée.
    const quoteData: QuoteEmailData = {
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
      accommodation: quote.roomType ? `${quote.roomType}${quote.nights ? ` (${quote.nights} nuits)` : ''}` : null,
      transport: quote.transportClass ?? null,
    };

    const notifyResults = await sendQuoteNotifications(docRef.id, quoteData).catch((err) => {
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
      console.error('Quote API config:', err.message);
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Impossible d\'enregistrer la demande pour le moment. Réessayez ou contactez-nous sur WhatsApp.' }, { status: 500 });
  }
}

