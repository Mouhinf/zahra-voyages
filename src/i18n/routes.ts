import type { Locale } from './config';

/**
 * Table de correspondance bi-directionnelle entre les URLs françaises et anglaises.
 * Toutes les URLs candidates anglaises sont documentées ici.
 */
export const ROUTE_PAIRS: Array<{ fr: string; en: string }> = [
  { fr: '/', en: '/en' },
  { fr: '/transport', en: '/en/transport' },
  { fr: '/hebergement', en: '/en/hebergement' },
  { fr: '/excursions', en: '/en/excursions' },
  { fr: '/tourisme-affaires', en: '/en/tourisme-affaires' },
  { fr: '/assistance-voyage', en: '/en/assistance-voyage' },
  { fr: '/destinations', en: '/en/destinations' },
  { fr: '/about', en: '/en/about' },
  { fr: '/contact', en: '/en/contact' },
  { fr: '/dakar-2026', en: '/en/dakar-2026' },
];

/**
 * Calcule l'URL alternative dans la langue cible en préservant le contexte utilisateur.
 * Si aucun équivalent direct n'existe (ex. guide spécifique non encore traduit),
 * renvoie vers la racine de la langue cible (/en ou /) pour éviter les erreurs 404.
 */
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  // Normalisation du chemin (suppression du slash final superflu sauf racine)
  const normalized = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  if (targetLocale === 'en') {
    if (normalized === '/en' || normalized.startsWith('/en/')) {
      return normalized; // Déjà en anglais
    }
    const match = ROUTE_PAIRS.find((p) => p.fr === normalized);
    if (match) return match.en;

    // Gestion des préfixes pour sous-chemins
    const prefixMatch = ROUTE_PAIRS.find((p) => p.fr !== '/' && normalized.startsWith(p.fr));
    if (prefixMatch) {
      return prefixMatch.en;
    }
    return '/en';
  } else {
    // Cible française
    if (!normalized.startsWith('/en')) {
      return normalized; // Déjà en français
    }
    const match = ROUTE_PAIRS.find((p) => p.en === normalized);
    if (match) return match.fr;

    // Gestion des préfixes anglais
    const prefixMatch = ROUTE_PAIRS.find((p) => normalized.startsWith(p.en));
    if (prefixMatch) {
      return prefixMatch.fr;
    }
    return '/';
  }
}

/**
 * Retourne le lien hreflang alternatif pour les balises SEO et le sitemap.
 */
export function getHreflangAlternates(canonicalPath: string, baseUrl: string): {
  fr: string;
  en: string;
  'x-default': string;
} {
  const isEn = canonicalPath === '/en' || canonicalPath.startsWith('/en/');
  const frPath = isEn ? getAlternatePath(canonicalPath, 'fr') : canonicalPath;
  const enPath = isEn ? canonicalPath : getAlternatePath(canonicalPath, 'en');

  return {
    fr: `${baseUrl}${frPath === '/' ? '' : frPath}`,
    en: `${baseUrl}${enPath}`,
    'x-default': `${baseUrl}${frPath === '/' ? '' : frPath}`,
  };
}
