// Configuration centrale du site : URL canonique, identité et contacts.
// Sert au SEO (sitemap, robots, canonical, hreflang) et aux schémas JSON-LD.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://slaacvoyages.com').replace(/\/$/, '');

export const SITE_NAME = 'SLAAC Voyages';
export const SITE_TAGLINE = 'Votre Passeport pour le Monde';

export const CONTACT = {
  phone: '+221 77 312 90 90',
  phoneIntl: '+221773129090',
  whatsapp: 'https://wa.me/221773129090',
  email: 'mdslaacvoyages@gmail.com',
  address: {
    street: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
    city: 'Dakar',
    country: 'SN',
  },
} as const;
