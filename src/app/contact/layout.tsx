import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// La page contact est un composant client : les métadonnées vivent ici.
export const metadata: Metadata = {
  title: 'Contact — SLAAC Voyages, Dakar',
  description: "Contactez SLAAC Voyages à Dakar : formulaire, WhatsApp +221 77 312 90 90, email et agence à Dakar Plateau. Réponse sous 24 h, devis gratuit.",
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
