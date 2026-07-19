'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hotel, Car, Ship, MapPinned, Briefcase, Zap } from 'lucide-react';
import Link from 'next/link';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';

const services = [
  {
    href: '/hebergement',
    icon: Hotel,
    title: 'Hébergement',
    description: "Hôtels, résidences et villas sélectionnés au Sénégal et à l'étranger. Confort et qualité garantis à chaque séjour.",
  },
  {
    href: '/transport',
    icon: Car,
    title: 'Transport',
    description: "Billetterie aérienne, location de véhicules avec chauffeur et transferts aéroport partout au Sénégal.",
  },
  {
    href: '/voyages-croisieres',
    icon: Ship,
    title: 'Voyages & Croisières',
    description: "Circuits organisés et croisières inoubliables vers les plus belles destinations du monde.",
  },
  {
    href: '/excursions',
    icon: MapPinned,
    title: 'Excursions',
    description: "Sorties guidées d'une journée au départ de Dakar : Gorée, Lac Rose, Bandia, Sine-Saloum et Casamance.",
  },
  {
    href: '/tourisme-affaires',
    icon: Briefcase,
    title: "Tourisme d'Affaires",
    description: "Séminaires, incentives, délégations et salles de réunion pour vos événements professionnels.",
  },
];

export default function HomeServicesGrid() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Nos 6 Services pour Voyager Serein</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            SLAAC Voyages couvre l'ensemble de vos besoins de voyage, du billet d'avion à l'organisation complète de votre séjour.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.title} href={service.href} className="block group">
                <Card className="text-center flex flex-col items-center p-6 h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl font-semibold text-primary">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </CardContent>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    Découvrir <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* 6e carte : Réservation express */}
          <QuoteRequestDialog>
            <Card className="text-center flex flex-col items-center p-6 h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-accent/5 border-accent/30 cursor-pointer">
              <div className="bg-accent/20 rounded-full p-4 mb-4">
                <Zap className="h-8 w-8 text-accent-foreground" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-semibold text-primary">Réservation Express</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-muted-foreground text-sm">
                  Besoin d'un devis rapide ? Décrivez votre projet, notre équipe vous répond sous 24h.
                </p>
              </CardContent>
              <div className="mt-4 flex items-center text-accent-foreground text-sm font-medium">
                Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Card>
          </QuoteRequestDialog>
        </div>
      </div>
    </section>
  );
}
