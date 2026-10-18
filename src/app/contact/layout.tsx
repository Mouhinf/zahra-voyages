import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// La page contact est un composant client : les métadonnées vivent ici.
export const metadata: Metadata = {
  title: 'Contact & Agence Dakar Plateau | SLAAC Voyages',
  description: "Contactez SLAAC Voyages à Dakar Plateau : devis gratuit sous 24 h, WhatsApp +221 77 312 90 90, email contact@slaacvoyages.com et accueil à l’agence.",
  alternates: {
    canonical: '/contact',
    languages: {
      fr: '/contact',
      en: '/en/contact',
      'x-default': '/contact',
    },
  },
  openGraph: {
    title: 'Contact & Agence Dakar Plateau | SLAAC Voyages',
    description: "Formulaire de contact, devis en 24 h et coordonnées officielles de l'agence SLAAC Voyages à Dakar Plateau.",
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
