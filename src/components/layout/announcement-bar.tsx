'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PublicPromoBanner } from '@/types/promo-banner';

// ---------------------------------------------------------------------------
// Bandeau publicitaire dynamique (remplace l'ancien bandeau statique).
//
// - Source : /api/promo-banners (annonces actives uniquement, filtrées par
//   le serveur). Repli sûr si l'API est vide/indisponible : l'annonce
//   Dakar 2026 statique, validée, conserve la ligne — le site ne casse jamais.
// - Rotation : 5 s, transition en fondu sans décalage de page (les slides
//   sont empilées dans une grille de hauteur fixe) ; pause au survol et au
//   focus clavier ; respect de prefers-reduced-motion (pas d'auto-rotation).
// - Une seule annonce : pas de contrôles, pas de minuteur.
// ---------------------------------------------------------------------------

const ROTATION_MS = 5000;

/** Annonce de repli (validée) — affichée si aucune annonce active ne vient de l'admin. */
const FALLBACK: PublicPromoBanner = {
  id: 'fallback-dakar-2026',
  message: 'Dakar 2026 : préparez transferts AIBD, hébergements et excursions',
  href: '/dakar-2026',
  ctaLabel: '',
  variant: 'or',
  newTab: false,
};

const VARIANT_CLASSES: Record<string, string> = {
  or: 'bg-accent text-accent-foreground',
  marine: 'bg-primary text-primary-foreground',
  vert: 'bg-green-700 text-white',
};

function BannerContent({ banner }: { banner: PublicPromoBanner }) {
  const label = banner.ctaLabel ? (
    <>
      <span className="line-clamp-2 sm:line-clamp-1">{banner.message}</span>
      <span className="hidden sm:inline shrink-0 font-semibold underline underline-offset-2">
        {banner.ctaLabel}
      </span>
    </>
  ) : (
    banner.message
  );

  const classes = 'flex items-center justify-center gap-2 w-full h-full';

  if (!banner.href) {
    return <span className={classes}>{label}</span>;
  }
  if (banner.href.startsWith('/') && !banner.newTab) {
    return (
      <Link href={banner.href} className={`${classes} hover:underline underline-offset-2`}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={banner.href}
      target={banner.newTab ? '_blank' : undefined}
      rel={banner.newTab ? 'noopener noreferrer' : undefined}
      className={`${classes} hover:underline underline-offset-2`}
    >
      {label}
    </a>
  );
}

export default function AnnouncementBar() {
  const [banners, setBanners] = useState<PublicPromoBanner[]>([FALLBACK]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/promo-banners');
        const body = await res.json().catch(() => ({}));
        const list: PublicPromoBanner[] = Array.isArray(body?.banners) ? body.banners : [];
        if (!cancelled && list.length > 0) {
          setBanners(list.filter((b) => b && typeof b.message === 'string'));
        }
      } catch {
        // En cas d'erreur réseau, FALLBACK reste affiché sans perturber l'UI
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const list = banners.length > 0 ? banners : [FALLBACK];

  const next = useCallback(() => {
    setIndex((i) => (list ? (i + 1) % list.length : 0));
  }, [list]);

  const prev = useCallback(() => {
    setIndex((i) => (list ? (i - 1 + list.length) % list.length : 0));
  }, [list]);

  // Rotation automatique — uniquement si plusieurs annonces, pas de pause,
  // pas de préférence de réduction des animations.
  useEffect(() => {
    if (!list || list.length < 2 || paused || reducedMotion.current) return;
    const timer = setInterval(next, ROTATION_MS);
    return () => clearInterval(timer);
  }, [list, paused, next]);

  // Garde l'index dans les bornes après une modification en administration.
  useEffect(() => {
    if (list && index >= list.length) setIndex(0);
  }, [list, index]);

  if (!list) return null; // chargement initial : aucune ligne réservée

  const current = list[Math.min(index, list.length - 1)];
  const variantClass = VARIANT_CLASSES[current.variant] ?? VARIANT_CLASSES.or;
  const many = list.length > 1;

  return (
    <section
      aria-label="Annonces promotionnelles"
      className={`w-full ${variantClass}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Hauteur fixe : la rotation ne décale jamais la page. */}
      <div className="relative h-11 sm:h-9 overflow-hidden">
        {/* Slides empilées (grille) : fondu sans décalage de mise en page. */}
        <div className="grid h-full">
          {list.map((banner, idx) => (
            <div
              key={banner.id}
              aria-hidden={idx !== index}
              aria-live={idx === index ? 'polite' : 'off'}
              className={`[grid-area:1/1] col-start-1 row-start-1 h-full px-12 transition-opacity duration-500 ease-in-out ${
                idx === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <BannerContent banner={banner} />
            </div>
          ))}
        </div>

        {many && (
          <div className="absolute inset-y-0 right-1 sm:right-2 flex items-center gap-0.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Annonce précédente"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Annonce suivante"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
