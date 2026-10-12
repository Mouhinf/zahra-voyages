import { z } from 'zod';
import type { PromoBanner, PublicPromoBanner } from '@/types/promo-banner';

// ---------------------------------------------------------------------------
// Bandeau publicitaire — validation partagée et logique de diffusion.
//
// Fuseau horaire : Africa/Dakar = GMT toute l'année (pas d'heure d'été).
// Les dates sont donc stockées en ISO UTC et comparées directement à
// l'horloge serveur : « 2026-10-20T08:00 » saisi par l'admin signifie
// 08 h 00 à Dakar = 08:00Z. L'évaluation de la fenêtre de diffusion se
// fait côté serveur (API), jamais sur l'horloge du navigateur.
// ---------------------------------------------------------------------------

/**
 * Lien autorisé : chemin interne commençant par un seul « / » (pas de
 * « // » protocol-relative), ou URL https:// explicite. Tout autre schéma
 * (javascript:, data:, http:) est refusé à la publication.
 */
const hrefSchema = z
  .string()
  .trim()
  .max(300, 'Lien trop long (300 caractères maximum).')
  .refine(
    (value) =>
      value === '' ||
      (/^\/[^/]/.test(value) && !value.includes('..')) ||
      /^https:\/\/[\w.-]+/i.test(value),
    { message: 'Lien invalide : utilisez un chemin interne (/hebergement…) ou une URL https://' }
  );

export const bannerInputSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(3, 'Le message doit contenir au moins 3 caractères.')
      .max(110, 'Le message est limité à 110 caractères pour rester lisible dans le bandeau.'),
    campaignType: z.enum(['generale', 'excursion', 'hebergement', 'transport', 'evenement', 'autre']).default('generale'),
    href: hrefSchema.optional().or(z.literal('')),
    ctaLabel: z.string().trim().max(30, 'Le libellé d’action est limité à 30 caractères.').optional().or(z.literal('')),
    variant: z.enum(['or', 'marine', 'vert']).default('or'),
    order: z.coerce.number().int().min(0).max(9999).default(100),
    status: z.enum(['brouillon', 'publie', 'archive']).default('brouillon'),
    startAt: z.string().optional().or(z.literal('')),
    endAt: z.string().optional().or(z.literal('')),
    newTab: z.boolean().default(false),
  })
  .refine((v) => !v.startAt || !v.endAt || v.startAt < v.endAt, {
    message: 'La date de fin doit être postérieure à la date de début.',
    path: ['endAt'],
  })
  .refine(
    (v) => !v.startAt || !Number.isNaN(Date.parse(normaliseIso(v.startAt))),
    { message: 'Date de début invalide.', path: ['startAt'] }
  )
  .refine(
    (v) => !v.endAt || !Number.isNaN(Date.parse(normaliseIso(v.endAt))),
    { message: 'Date de fin invalide.', path: ['endAt'] }
  );

export type BannerInput = z.infer<typeof bannerInputSchema>;

/** Convertit une saisie datetime-local (« 2026-10-20T08:00 ») en ISO UTC. */
export function normaliseIso(value: string): string {
  if (!value) return '';
  if (value.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(value)) return value;
  return `${value}:00.000Z`; // heure saisie = heure de Dakar (GMT) = UTC
}

/** Annonce visible maintenant ? (fenêtre + statut, horloge serveur). */
export function isBannerActiveNow(banner: PromoBanner, now: Date = new Date()): boolean {
  if (banner.status !== 'publie') return false;
  if (banner.startAt && now.getTime() < Date.parse(banner.startAt)) return false;
  if (banner.endAt && now.getTime() > Date.parse(banner.endAt)) return false;
  return true;
}

/** Vue publique : uniquement les champs destinés aux visiteurs. */
export function toPublicBanner(banner: PromoBanner): PublicPromoBanner {
  return {
    id: banner.id,
    message: banner.message,
    href: banner.href ?? '',
    ctaLabel: banner.ctaLabel ?? '',
    variant: banner.variant ?? 'or',
    newTab: Boolean(banner.newTab),
  };
}

/** Tri de diffusion : ordre administré croissant, puis ancienneté. */
export function compareBanners(a: PromoBanner, b: PromoBanner): number {
  const order = (a.order ?? 100) - (b.order ?? 100);
  if (order !== 0) return order;
  return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
}
