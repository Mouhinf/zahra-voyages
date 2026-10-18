import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Directives robots.txt pour SLAAC Voyages :
// - Exploration complète et prioritaire du site public, des images et des styles
// - Interdiction stricte d'accès aux routes d'administration et aux endpoints API
// - Référence explicite et absolue au sitemap XML dynamique
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
