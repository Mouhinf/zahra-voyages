import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import { verifyAdminToken, AuthError, ConfigError } from '@/lib/firebase-admin';
import { retryLeadNotifications } from '@/lib/email';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// CRM Admin — Rejeu forcé ou reprise des notifications pour une demande
// Protégé par verifyAdminToken (Firebase Admin Token).
// ---------------------------------------------------------------------------

const retrySchema = z.object({
  collection: z.enum(['quotes', 'contacts']),
  id: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
  try {
    await verifyAdminToken(req);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = retrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Paramètres invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { collection, id } = parsed.data;

    const outcome = await retryLeadNotifications(collection, id);

    return NextResponse.json({
      ok: true,
      total: outcome.total,
      retried: outcome.retried,
      successes: outcome.successes,
      results: outcome.results,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof ConfigError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin retry email error:', error);
    return NextResponse.json({ error: 'Erreur interne lors du rejeu des emails' }, { status: 500 });
  }
}
