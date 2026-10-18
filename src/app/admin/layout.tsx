import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Protection SEO absolue de l'espace d'administration CRM :
// Directives noindex, nofollow, noarchive pour tous les moteurs de recherche.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
