import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// Sitemap dynamique : routes statiques + offres publiées (Firestore).
// Les offres sont interrogées via le SDK Admin ; en cas d'indisponibilité
// (build local sans clés), le sitemap reste valide avec les seules routes
// statiques — jamais d'erreur 500 sur /sitemap.xml.

type Offre = { id: string; disponible?: boolean };

async function offreIds(collectionName: string): Promise<string[]> {
  try {
    const { getFirestore } = await import('firebase-admin/firestore');
    const { adminApp } = await import('@/lib/firebase-admin');
    const snap = await getFirestore(adminApp).collection(collectionName).limit(200).get();
    const ids: string[] = [];
    snap.forEach((doc) => {
      const d = doc.data() as Offre;
      if (d.disponible !== false) ids.push(doc.id);
    });
    return ids;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statiques: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1, lastModified: now },
    { url: `${SITE_URL}/en`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/hebergement`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/transport`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/voyages-croisieres`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/excursions`, changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/tourisme-affaires`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/assistance-voyage`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/destinations`, changeFrequency: 'monthly', priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/about`, changeFrequency: 'yearly', priority: 0.5, lastModified: now },
    { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/dakar-2026`, changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/confidentialite`, changeFrequency: 'yearly', priority: 0.2, lastModified: now },
  ];

  const modules: Array<[string, string]> = [
    ['hebergements', '/hebergement'],
    ['transports', '/transport'],
    ['voyagesCroisieres', '/voyages-croisieres'],
    ['excursions', '/excursions'],
    ['offresAffaires', '/tourisme-affaires'],
  ];

  const offres: MetadataRoute.Sitemap = [];
  for (const [collectionName, basePath] of modules) {
    const ids = await offreIds(collectionName);
    for (const id of ids) {
      offres.push({
        url: `${SITE_URL}${basePath}/${encodeURIComponent(id)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastModified: now,
      });
    }
  }

  return [...statiques, ...offres];
}
