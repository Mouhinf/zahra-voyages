import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { verifyAdminToken, AuthError, assertAdminConfigured } from '@/lib/firebase-admin';
import { bannerInputSchema, normaliseIso } from '@/lib/promo-banners';
import type { PromoBanner } from '@/types/promo-banner';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Administration des annonces du bandeau (collection `promotionalBanners`).
//
// Sécurité : Bearer ID token vérifié côté serveur (verifyAdminToken :
// signature, révocation, rôle admin) — identique aux autres routes admin.
// Aucune écriture cliente directe : la collection est hors du périmètre des
// règles publiques (refus par défaut).
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    await verifyAdminToken(req);
    assertAdminConfigured();

    const snap = await getFirestore()
      .collection('promotionalBanners')
      .limit(200)
      .get();

    const banners = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as PromoBanner)
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || String(a.createdAt ?? '').localeCompare(String(b.createdAt ?? '')));

    return NextResponse.json({ banners });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin banners GET error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifyAdminToken(req);
    assertAdminConfigured();

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    const parsed = bannerInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Champs invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const now = new Date().toISOString();
    const doc = {
      message: input.message,
      campaignType: input.campaignType,
      href: input.href ?? '',
      ctaLabel: input.ctaLabel ?? '',
      variant: input.variant,
      order: input.order,
      status: input.status,
      startAt: input.startAt ? normaliseIso(input.startAt) : '',
      endAt: input.endAt ? normaliseIso(input.endAt) : '',
      newTab: input.newTab,
      createdAt: now,
      updatedAt: now,
      createdBy: session.email ?? session.uid,
    };

    const ref = await getFirestore().collection('promotionalBanners').add(doc);
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin banners POST error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
