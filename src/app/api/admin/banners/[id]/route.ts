import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { verifyAdminToken, AuthError } from '@/lib/firebase-admin';
import { bannerInputSchema, normaliseIso } from '@/lib/promo-banners';

export const runtime = 'nodejs';

// Modification / suppression d'une annonce — authentification serveur
// identique à POST/GET (verifyAdminToken). La suppression est définitive ;
// l'archivage (status=archive) est disponible sans suppression.

async function resolveId(req: NextRequest, params: { id: string }) {
  await verifyAdminToken(req);
  const id = String(params.id || '').trim();
  if (!id || id.length > 128) {
    return null;
  }
  return id;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await resolveId(req, await params);
    if (!id) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
    }

    // Patch partiel autorisé : bascule rapide de statut sans renvoyer
    // tout le formulaire, ou mise à jour complète via le même schéma.
    const isStatusOnly =
      typeof body === 'object' && body !== null && Object.keys(body as object).length === 1 && 'status' in (body as object);

    const parsed = bannerInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Champs invalides', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (isStatusOnly) {
      patch.status = input.status;
    } else {
      Object.assign(patch, {
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
      });
    }

    const ref = getFirestore().collection('promotionalBanners').doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }
    await ref.update(patch);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin banners PATCH error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await resolveId(req, await params);
    if (!id) {
      return NextResponse.json({ error: 'Identifiant invalide' }, { status: 400 });
    }
    const ref = getFirestore().collection('promotionalBanners').doc(id);
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Annonce introuvable' }, { status: 404 });
    }
    await ref.delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('Admin banners DELETE error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
