import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// La page services est un composant client : les métadonnées vivent ici.
export const metadata: Metadata = {
  title: 'Nos prestations de voyages et mobilité à Dakar | SLAAC Voyages',
  description: "Billetterie d’avion, transferts aéroport AIBD, hébergements vérifiés, excursions au Sénégal et assistance visas par SLAAC Voyages à Dakar Plateau.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Nos prestations de voyages et mobilité à Dakar | SLAAC Voyages',
    description: "Catalogue des services touristiques, conciergerie locale et mobilité d'affaires proposés par SLAAC Voyages.",
    url: '/services',
  },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
