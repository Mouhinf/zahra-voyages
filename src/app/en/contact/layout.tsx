import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Contact page is a client component: metadata is defined in layout.
export const metadata: Metadata = {
  title: 'Contact Our Agency in Dakar Plateau | SLAAC Voyages',
  description:
    'Contact SLAAC Voyages in Dakar Plateau: free travel quote within 24 hours, WhatsApp +221 77 312 90 90, email, directions, and English-speaking concierge assistance.',
  alternates: {
    canonical: '/en/contact',
    languages: {
      fr: '/contact',
      en: '/en/contact',
      'x-default': '/contact',
    },
  },
  openGraph: {
    title: 'Contact Our Agency in Dakar Plateau | SLAAC Voyages',
    description:
      'Contact form, office location, directions, and coordinates for SLAAC Voyages travel agency in Dakar, Senegal.',
    url: '/en/contact',
    locale: 'en_US',
  },
};

export default function EnglishContactLayout({ children }: { children: ReactNode }) {
  return children;
}
