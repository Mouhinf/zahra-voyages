import { SITE_URL, SITE_NAME, CONTACT } from '@/lib/site';

/**
 * Générateur de données structurées Schema.org pour SLAAC Voyages
 * Respecte strictement les consignes Google Search Central :
 * - Aucune note inventée (pas de faux avis ni d'AggregateRating fictif)
 * - Coordonnées réelles de l'établissement à Dakar Plateau
 * - Sérialisation sécurisée sans injection XSS
 */

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ['SLAAC'],
    url: `${SITE_URL}/`,
  };
}

export function getTravelAgencySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TravelAgency', 'LocalBusiness'],
    '@id': `${SITE_URL}/#travelagency`,
    name: SITE_NAME,
    legalName: 'SLAAC Voyages SARL',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-slaac.png`,
    image: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png',
    description:
      "Agence de voyages et conciergerie touristique à Dakar Plateau. Billetterie aérienne, transferts aéroport AIBD, hébergements vérifiés, excursions au Sénégal et visas d'affaires.",
    telephone: CONTACT.phoneIntl,
    email: CONTACT.email,
    hasMap: CONTACT.directionsUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${CONTACT.address.street}, Dakar Plateau`,
      addressLocality: CONTACT.address.city,
      addressRegion: CONTACT.address.district,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACT.geo.latitude, // Coordonnées GPS Dakar Plateau 14.6687 (~14.67)
      longitude: CONTACT.geo.longitude,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: CONTACT.phoneIntl,
        contactType: 'customer service',
        areaServed: 'SN',
        availableLanguage: ['French', 'English', 'Wolof'],
      },
      {
        '@type': 'ContactPoint',
        telephone: CONTACT.phoneSecondaryIntl,
        contactType: 'sales',
        areaServed: 'SN',
        availableLanguage: ['French', 'English'],
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '18:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '15:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'XOF, EUR, USD',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, Wave, Orange Money',
    areaServed: [
      { '@type': 'Country', name: 'Sénégal' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italie' },
      { '@type': 'Country', name: 'Espagne' },
      { '@type': 'Country', name: 'Belgique' },
      { '@type': 'Country', name: 'États-Unis' },
      { '@type': 'Country', name: 'Canada' },
    ],
    sameAs: [
      CONTACT.whatsapp,
      CONTACT.directionsUrl,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prestations de Voyage & Mobilité SLAAC Voyages',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Transferts Aéroport AIBD',
          url: `${SITE_URL}/transport`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Hébergements & Résidences Vérifiées',
          url: `${SITE_URL}/hebergement`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Circuits & Excursions au Sénégal',
          url: `${SITE_URL}/excursions`,
        },
        {
          '@type': 'OfferCatalog',
          name: "Tourisme d'Affaires & MICE",
          url: `${SITE_URL}/tourisme-affaires`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Assistance Visas & Formalités',
          url: `${SITE_URL}/assistance-voyage`,
        },
      ],
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getServiceSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
  serviceType?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
      telephone: CONTACT.phoneIntl,
    },
    serviceType: opts.serviceType || 'TravelService',
    ...(opts.image ? { image: opts.image } : {}),
  };
}

export function getLodgingSchema(opts: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  addressLocality?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: opts.name,
    description: opts.description || `Hébergement de prestige sélectionné par ${SITE_NAME}`,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    ...(opts.image ? { image: opts.image } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: opts.addressLocality || 'Dakar, Sénégal',
      addressCountry: 'SN',
    },
    containedInPlace: {
      '@type': 'Place',
      name: opts.addressLocality || 'Sénégal',
    },
  };
}

export function getTouristAttractionSchema(opts: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  addressLocality?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: opts.name,
    description: opts.description || `Circuit guidé et excursion avec ${SITE_NAME}`,
    url: opts.url.startsWith('http') ? opts.url : `${SITE_URL}${opts.url}`,
    ...(opts.image ? { image: opts.image } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: opts.addressLocality || 'Sénégal',
      addressCountry: 'SN',
    },
  };
}
