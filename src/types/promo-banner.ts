// Bandeau publicitaire dynamique — types partagés client/serveur/admin.

export const PROMO_CAMPAIGN_TYPES = [
  'generale',
  'excursion',
  'hebergement',
  'transport',
  'evenement',
  'autre',
] as const;
export type PromoCampaignType = (typeof PROMO_CAMPAIGN_TYPES)[number];

export const PROMO_VARIANTS = ['or', 'marine', 'vert'] as const;
export type PromoVariant = (typeof PROMO_VARIANTS)[number];

export const PROMO_STATUSES = ['brouillon', 'publie', 'archive'] as const;
export type PromoStatus = (typeof PROMO_STATUSES)[number];

/** Document Firestore complet (collection `promotionalBanners`). */
export interface PromoBanner {
  id: string;
  message: string;
  campaignType: PromoCampaignType;
  /** Lien de destination : chemin interne (/…) ou https:// — jamais autre chose. */
  href: string;
  ctaLabel: string;
  variant: PromoVariant;
  order: number;
  status: PromoStatus;
  /** ISO 8601 (UTC) — interprété en heure locale Africa/Dakar (GMT, sans heure d'été). */
  startAt: string;
  endAt: string;
  newTab: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/** Vue publique diffusable aux visiteurs (aucun champ d'administration). */
export interface PublicPromoBanner {
  id: string;
  message: string;
  href: string;
  ctaLabel: string;
  variant: PromoVariant;
  newTab: boolean;
}
