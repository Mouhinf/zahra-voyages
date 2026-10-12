import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp, assertAdminConfigured, ConfigError } from '@/lib/firebase-admin';
import { compareBanners, isBannerActiveNow, toPublicBanner } from '@/lib/promo-banners';
import type { PromoBanner } from '@/types/promo-banner';

export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Diffusion publique des annonces du bandeau.
//
// - Lecture via le SDK Admin : les brouillons, annonces archivées et
//   métadonnées d'administration ne quittent JAMAIS le serveur — seules les
//   annonces actives, réduites à leur vue publique, sont renvoyées.
// - Fenêtre de validité évaluée sur l'horloge serveur (Africa/Dakar = GMT).
// - Aucune règle Firestore modifiée : la collection reste inaccessible
//   aux clients (refus par défaut), cette route est l'unique canal.
// ---------------------------------------------------------------------------

export async function GET() {
  try {
    assertAdminConfigured();
    const snap = await getFirestore(adminApp)
      .collection('promotionalBanners')
      .limit(50)
      .get();

    const banners: PromoBanner[] = [];
    snap.forEach((docSnap) => {
      banners.push({ id: docSnap.id, ...docSnap.data() } as PromoBanner);
    });

    const active = banners
      .filter((b) => isBannerActiveNow(b))
      .sort(compareBanners)
      .map(toPublicBanner);

    return NextResponse.json(
      { banners: active },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    // Firestore indisponible : repli sûr côté client (annonce statique),
    // la page principale ne doit jamais être bloquée par le bandeau.
    if (error instanceof ConfigError) {
      return NextResponse.json({ banners: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }
    console.error('Promo banners GET error:', error);
    return NextResponse.json(
      { banners: [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
