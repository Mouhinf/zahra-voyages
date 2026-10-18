import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { featuredHebergements } from '@/data/featured-hebergements';
import { featuredExcursions } from '@/data/featured-excursions';
import { featuredDestinations } from '@/data/featured-destinations';
import { featuredTransfertsAeroport } from '@/data/featured-transferts';
import { featuredTransfertsPlage } from '@/data/featured-transferts-plage';
import { featuredTourismeOffers } from '@/data/featured-tourisme';
import { guidesData } from '@/data/guides';

// Date de référence de la dernière revue majeure du contenu éditorial statique
const STATIC_CONTENT_LASTMOD = new Date('2026-10-18T00:00:00.000Z');

interface FirestoreOfferDoc {
  id: string;
  disponible?: boolean;
  publie?: boolean;
  statut?: string;
  status?: string;
  supprime?: boolean;
  updatedAt?: { toDate?: () => Date } | string | number;
  publishedAt?: { toDate?: () => Date } | string | number;
  createdAt?: { toDate?: () => Date } | string | number;
}

interface OfferEntry {
  id: string;
  lastModified?: Date;
}

function parseFirestoreDate(val: unknown): Date | undefined {
  if (!val) return undefined;
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    const d = (val as { toDate: () => Date }).toDate();
    if (!isNaN(d.getTime())) return d;
  }
  if (typeof val === 'string' || typeof val === 'number') {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }
  return undefined;
}

async function fetchCollectionOffers(
  collectionName: string,
  staticFallbackIds: string[] = []
): Promise<OfferEntry[]> {
  const results: OfferEntry[] = [];
  const seenIds = new Set<string>();

  try {
    const { getFirestore } = await import('firebase-admin/firestore');
    const { adminApp } = await import('@/lib/firebase-admin');

    // Requête bornée à 1 000 documents avec garde-fou de temporisation (2,5s max)
    // Permet un repli instantané vers le catalogue certifié lors des builds sans connectivité Firestore
    const fetchPromise = getFirestore(adminApp)
      .collection(collectionName)
      .limit(1000)
      .get();

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Firestore timeout')), 2500);
    });

    const snap = await Promise.race([fetchPromise, timeoutPromise]);

    snap.forEach((doc) => {
      const data = doc.data() as FirestoreOfferDoc;

      // Exclusion stricte des brouillons, offres supprimées ou explicitement non publiées
      const isDraft = data.statut === 'brouillon' || data.status === 'draft';
      const isDeleted = data.supprime === true;
      const isUnpublished = data.publie === false;
      const isUnavailable = data.disponible === false;

      if (!isDraft && !isDeleted && !isUnpublished && !isUnavailable) {
        seenIds.add(doc.id);
        const lastMod =
          parseFirestoreDate(data.updatedAt) ||
          parseFirestoreDate(data.publishedAt) ||
          parseFirestoreDate(data.createdAt);

        results.push({
          id: doc.id,
          lastModified: lastMod,
        });
      }
    });
  } catch (error) {
    // Repli contrôlé en cas d'indisponibilité Firestore (build local, coupure réseau)
    console.warn(`[Sitemap] Firestore indisponible pour ${collectionName}, utilisation du catalogue statique certifié.`);
  }

  // Intégration du catalogue statique garanti si Firestore n'a pas retourné l'offre
  for (const staticId of staticFallbackIds) {
    if (!seenIds.has(staticId)) {
      seenIds.add(staticId);
      results.push({
        id: staticId,
        lastModified: STATIC_CONTENT_LASTMOD,
      });
    }
  }

  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Pages publiques statiques principales
  const statiques: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
          'x-default': `${SITE_URL}/`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
          'x-default': `${SITE_URL}/`,
        },
      },
    },
    // Transport & Airport Transfers
    {
      url: `${SITE_URL}/transport`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${SITE_URL}/transport`,
          en: `${SITE_URL}/en/transport`,
          'x-default': `${SITE_URL}/transport`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/transport`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/transport`,
          en: `${SITE_URL}/en/transport`,
          'x-default': `${SITE_URL}/transport`,
        },
      },
    },
    // Accommodation
    {
      url: `${SITE_URL}/hebergement`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${SITE_URL}/hebergement`,
          en: `${SITE_URL}/en/hebergement`,
          'x-default': `${SITE_URL}/hebergement`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/hebergement`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/hebergement`,
          en: `${SITE_URL}/en/hebergement`,
          'x-default': `${SITE_URL}/hebergement`,
        },
      },
    },
    // Excursions & Guided Tours
    {
      url: `${SITE_URL}/excursions`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/excursions`,
          en: `${SITE_URL}/en/excursions`,
          'x-default': `${SITE_URL}/excursions`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/excursions`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/excursions`,
          en: `${SITE_URL}/en/excursions`,
          'x-default': `${SITE_URL}/excursions`,
        },
      },
    },
    // Corporate Travel & MICE
    {
      url: `${SITE_URL}/tourisme-affaires`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/tourisme-affaires`,
          en: `${SITE_URL}/en/tourisme-affaires`,
          'x-default': `${SITE_URL}/tourisme-affaires`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/tourisme-affaires`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/tourisme-affaires`,
          en: `${SITE_URL}/en/tourisme-affaires`,
          'x-default': `${SITE_URL}/tourisme-affaires`,
        },
      },
    },
    // Travel Assistance & Visas
    {
      url: `${SITE_URL}/assistance-voyage`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/assistance-voyage`,
          en: `${SITE_URL}/en/assistance-voyage`,
          'x-default': `${SITE_URL}/assistance-voyage`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/assistance-voyage`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.75,
      alternates: {
        languages: {
          fr: `${SITE_URL}/assistance-voyage`,
          en: `${SITE_URL}/en/assistance-voyage`,
          'x-default': `${SITE_URL}/assistance-voyage`,
        },
      },
    },
    // Dakar 2026 Event Hub
    {
      url: `${SITE_URL}/dakar-2026`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/dakar-2026`,
          en: `${SITE_URL}/en/dakar-2026`,
          'x-default': `${SITE_URL}/dakar-2026`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/dakar-2026`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/dakar-2026`,
          en: `${SITE_URL}/en/dakar-2026`,
          'x-default': `${SITE_URL}/dakar-2026`,
        },
      },
    },
    // Destinations
    {
      url: `${SITE_URL}/destinations`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${SITE_URL}/destinations`,
          en: `${SITE_URL}/en/destinations`,
          'x-default': `${SITE_URL}/destinations`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/destinations`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${SITE_URL}/destinations`,
          en: `${SITE_URL}/en/destinations`,
          'x-default': `${SITE_URL}/destinations`,
        },
      },
    },
    // Contact
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${SITE_URL}/contact`,
          en: `${SITE_URL}/en/contact`,
          'x-default': `${SITE_URL}/contact`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/contact`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          fr: `${SITE_URL}/contact`,
          en: `${SITE_URL}/en/contact`,
          'x-default': `${SITE_URL}/contact`,
        },
      },
    },
    // About
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${SITE_URL}/about`,
          en: `${SITE_URL}/en/about`,
          'x-default': `${SITE_URL}/about`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/about`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${SITE_URL}/about`,
          en: `${SITE_URL}/en/about`,
          'x-default': `${SITE_URL}/about`,
        },
      },
    },
    // French-only Services and Religious Tourism
    {
      url: `${SITE_URL}/voyages-croisieres`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/omra`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/guides`,
          en: `${SITE_URL}/en/guides`,
          'x-default': `${SITE_URL}/guides`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/guides`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          fr: `${SITE_URL}/guides`,
          en: `${SITE_URL}/en/guides`,
          'x-default': `${SITE_URL}/guides`,
        },
      },
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: STATIC_CONTENT_LASTMOD,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. Modules dynamiques et correspondances d'URLs
  const modules: Array<{
    collection: string;
    basePath: string;
    priority: number;
    staticFallbacks: string[];
  }> = [
    {
      collection: 'hebergements',
      basePath: '/hebergement',
      priority: 0.75,
      staticFallbacks: featuredHebergements.map((h) => h.id),
    },
    {
      collection: 'transports',
      basePath: '/transport',
      priority: 0.75,
      staticFallbacks: [
        ...featuredDestinations,
        ...featuredTransfertsAeroport,
        ...featuredTransfertsPlage,
      ].map((t) => t.id),
    },
    {
      collection: 'excursions',
      basePath: '/excursions',
      priority: 0.75,
      staticFallbacks: featuredExcursions.map((e) => e.id),
    },
    {
      collection: 'offresAffaires',
      basePath: '/tourisme-affaires',
      priority: 0.7,
      staticFallbacks: featuredTourismeOffers.map((o) => o.id),
    },
    {
      collection: 'voyagesCroisieres',
      basePath: '/voyages-croisieres',
      priority: 0.7,
      staticFallbacks: [],
    },
  ];

  // 3. Agrégation de toutes les offres publiées éligibles (chargement parallèle)
  const dynamiques: MetadataRoute.Sitemap = [];

  const allModuleEntries = await Promise.all(
    modules.map((mod) => fetchCollectionOffers(mod.collection, mod.staticFallbacks))
  );

  allModuleEntries.forEach((entries, idx) => {
    const mod = modules[idx];
    for (const entry of entries) {
      dynamiques.push({
        url: `${SITE_URL}${mod.basePath}/${encodeURIComponent(entry.id)}`,
        ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
        changeFrequency: 'weekly',
        priority: mod.priority,
      });
    }
  });

  // 4. Intégration des guides pratiques pérennes (versions FR et EN avec hreflang réciproque)
  const guidesEntries: MetadataRoute.Sitemap = guidesData.flatMap((g) => [
    {
      url: `${SITE_URL}/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/guides/${g.slug}`,
          en: `${SITE_URL}/en/guides/${g.slug}`,
          'x-default': `${SITE_URL}/guides/${g.slug}`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/guides/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          fr: `${SITE_URL}/guides/${g.slug}`,
          en: `${SITE_URL}/en/guides/${g.slug}`,
          'x-default': `${SITE_URL}/guides/${g.slug}`,
        },
      },
    },
  ]);

  return [...statiques, ...guidesEntries, ...dynamiques];
}
