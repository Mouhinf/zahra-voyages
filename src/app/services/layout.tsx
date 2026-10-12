import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// La page services est un composant client : les métadonnées vivent ici.
export const metadata: Metadata = {
  title: 'Nos services — billetterie, visas, séjours, transport',
  description: "SLAAC Voyages : billetterie aérienne, packages sur mesure, assistance visas et assurance, réservation d'hôtels, circuits, import/export et location de véhicules à Dakar.",
  alternates: { canonical: '/services' },
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
