// Configuration centrale du site : URL canonique, identité et contacts.
// Sert au SEO (sitemap, robots, canonical, hreflang) et aux schémas JSON-LD.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://slaacvoyages.com').replace(/\/$/, '');

export const SITE_NAME = 'SLAAC Voyages';
export const SITE_TAGLINE = 'Votre Passeport pour le Monde';

export const CONTACT = {
  phone: '+221 77 312 90 90',
  phoneIntl: '+221773129090',
  phoneSecondary: '+221 77 624 58 58',
  phoneSecondaryIntl: '+221776245858',
  whatsapp: 'https://wa.me/221773129090',
  email: 'contact@slaacvoyages.com',
  emailInternal: 'mdslaacvoyages@gmail.com',
  emailInfo: 'infoslaac@slaacvoyages.com',
  address: {
    street: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
    district: 'Dakar Plateau',
    city: 'Dakar',
    postalCode: '10200',
    country: 'SN',
    formatted: 'Dakar Plateau, Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
  },
  geo: {
    latitude: 14.6687,
    longitude: -17.4344,
  },
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=14.6686685,-17.4343981',
  openingHours: {
    weekdays: '08:30 - 18:30',
    saturday: '09:00 - 15:00',
    sunday: 'Fermé',
  },
} as const;
