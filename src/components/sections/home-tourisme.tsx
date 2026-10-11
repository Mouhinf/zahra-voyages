import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Briefcase, Users, Building2, CalendarCheck } from 'lucide-react';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import Link from 'next/link';

// Teaser « Tourisme d'affaires » pour la page d'accueil — résumé de la page
// /tourisme-affaires avec un devis prérempli (service tourisme-affaires).

const points = [
  { icon: Briefcase, label: 'Missions professionnelles organisées de bout en bout' },
  { icon: Users, label: 'Séminaires et incentives pour vos équipes' },
  { icon: Building2, label: 'Salles de réunion équipées et délégations accompagnées' },
  { icon: CalendarCheck, label: 'Logistique complète : vol, hôtel, transferts, activités' },
];

export default function HomeTourisme() {
  return (
    <section id="tourisme-affaires" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Tourisme d'affaires</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Vos Événements Professionnels, Sans Stress</h2>
            <div className="w-16 h-0.5 bg-accent my-5" />
            <p className="text-lg text-muted-foreground text-balance">
              Séminaires, incentives, salons ou délégations officielles : SLAAC Voyages coordonne chaque détail pour que vous vous concentriez sur l'essentiel.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.label} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-sm md:text-base text-foreground/90">{p.label}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="tourisme-affaires"
                source="accueil-tourisme-affaires"
              >
                Organiser un événement
              </QuoteRequestButton>
              <Link href="/tourisme-affaires" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 h-11 text-sm font-medium text-primary hover:bg-accent/10">
                Voir les offres dédiées
              </Link>
            </div>
          </div>
          <Card className="overflow-hidden shadow-xl p-0">
            <div className="relative h-72 lg:h-[26rem]">
              <Image
                src="https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-affaires.png"
                alt="Séminaire d'entreprise organisé par SLAAC Voyages"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
