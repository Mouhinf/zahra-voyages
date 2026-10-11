import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import * as z from 'zod';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';
import { sendAgencyEmail } from '@/lib/notify';
import { createHash } from 'node:crypto';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Formulaire de contact public.
//
// Fiabilité (le formulaire ne doit JAMAIS afficher "Message envoyé" si
// l'enregistrement a échoué) :
// - 200 uniquement si le document est bien écrit dans Firestore.
// - L'email à l'agence est best-effort : un échec est consigné dans le
//   document (notifyStatus) — la demande reste consultable côté admin.
//
// Anti-spam :
// - Rate limiting : 5 messages / 5 min / IP.
// - Champ pot de miel (website) : invisible pour les humains, rempli par
//   les robots → requête ignorée silencieusement (réponse 200 factice).
// - Déduplication : même email + même empreinte de message moins de 10
//   minutes avant → pas de second document (réponse ok, flag deduped).
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis').max(100),
  email: z.string().trim().email('Email invalide').max(150),
  phone: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
  message: z.string().trim().min(10, 'Message trop court').max(3000),
  // Pot de miel anti-robots — doit rester vide. Accepté dans le schéma pour
  // qu'un robot reçoive une réponse neutre (200 factice) et ne sache pas
  // qu'il a été détecté ; la requête est ensuite ignorée.
  website: z.string().max(200).optional().or(z.literal('').transform(() => undefined)),
});

function fingerprint(email: string, message: string): string {
  return createHash('sha256').update(`${email.toLowerCase()}|${message.trim().toLowerCase()}`).digest('hex').slice(0, 32);
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
      return NextResponse.json({ error: 'Champs invalides', details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = parsed.data;

    // Pot de miel rempli → robot. Réponse neutre pour ne rien révéler.
    if (data.website !== undefined) {
      return NextResponse.json({ ok: true });
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

    const docRef = await db.collection('contacts').add({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message,
      fingerprint: fp,
      ip: ip === 'unknown' ? null : ip,
      createdAt: new Date().toISOString(),
      status: 'new',
      notifyStatus: 'pending',
    });

    // Notification best-effort — n'affecte pas le succès de la demande.
    const notify = await sendAgencyEmail(
      `Nouveau message de contact — ${data.name}`,
      [
        ['Nom', data.name],
        ['Email', data.email],
        ['Téléphone', data.phone ?? '—'],
        ['Message', data.message],
        ['Reçu le', new Date().toLocaleString('fr-FR')],
        ['Réf. document', docRef.id],
      ],
    );
    const notifyStatus = notify.sent ? 'sent' : `failed:${notify.reason ?? 'unknown'}`;
    await docRef.update({ notifyStatus }).catch(() => {});

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      // Signal explicite pour l'administration (non montré au visiteur).
      emailWarning: !notify.sent && notify.reason !== 'not-configured',
    });
  } catch (err: unknown) {
    if (err instanceof ConfigError) {
      console.error('Contact API config:', err.message);
      return NextResponse.json({ error: err.message }, { status: err.statusCode });
    }
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Impossible d\'enregistrer le message pour le moment. Réessayez ou contactez-nous sur WhatsApp.' }, { status: 500 });
  }
}
