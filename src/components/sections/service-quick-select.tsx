'use client';

// Sélection rapide de services — bandeau sous le hero : l'internaute choisit
// son besoin en un clic (navigation) ou ouvre directement le devis prérempli.

import Link from 'next/link';
import { Hotel, Car, Ship, MapPinned, Briefcase, Send } from 'lucide-react';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';

const quickLinks = [
  { href: '/hebergement', label: 'Hébergement', icon: Hotel },
  { href: '/transport', label: 'Billetterie & Transport', icon: Car },
  { href: '/voyages-croisieres', label: 'Voyages & Croisières', icon: Ship },
  { href: '/excursions', label: 'Circuits & Excursions', icon: MapPinned },
  { href: '/tourisme-affaires', label: "Tourisme d'Affaires", icon: Briefcase },
];

export default function ServiceQuickSelect() {
  return (
    <section aria-label="Sélection rapide de services" className="border-b bg-secondary/60">
      <div className="container mx-auto max-w-7xl px-4 py-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <p className="text-sm font-semibold text-primary whitespace-nowrap">
            Que souhaitez-vous organiser ?
          </p>
          <nav aria-label="Services" className="flex flex-wrap gap-2 flex-1">
            {quickLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" /> {l.label}
                </Link>
              );
            })}
          </nav>
          <QuoteRequestButton
            variant="gold"
            size="sm"
            source="accueil-selection-rapide"
            className="shrink-0"
          >
            <Send className="h-4 w-4" /> Devis sur mesure
          </QuoteRequestButton>
        </div>
      </div>
    </section>
  );
}
