import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// robots.txt : indexation ouverte sur le site public,
// fermeture de l'administration et des API.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
