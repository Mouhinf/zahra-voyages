'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Hotel, Car, Ship, MapPinned, Briefcase, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const FALLBACK_IMAGES: Record<string, string> = {
  hebergements: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-hebergement.png',
  transports: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-transport.png',
  voyagesCroisieres: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png',
  excursions: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-excursions.png',
  offresAffaires: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-affaires.png',
};

type ServiceDef = {
  href: string;
  icon: typeof Hotel;
  title: string;
  description: string;
  collectionName: string;
};

const services: ServiceDef[] = [
  {
    href: '/hebergement',
    icon: Hotel,
    title: 'Hébergement',
    description: "Hôtels, résidences et villas sélectionnés au Sénégal et à l'étranger. Confort et qualité garantis à chaque séjour.",
    collectionName: 'hebergements',
  },
  {
    href: '/transport',
    icon: Car,
    title: 'Transport',
    description: "Billetterie aérienne, location de véhicules avec chauffeur et transferts aéroport partout au Sénégal.",
    collectionName: 'transports',
  },
  {
    href: '/voyages-croisieres',
    icon: Ship,
    title: 'Voyages & Croisières',
    description: "Circuits organisés et croisières inoubliables vers les plus belles destinations du monde.",
    collectionName: 'voyagesCroisieres',
  },
  {
    href: '/excursions',
    icon: MapPinned,
    title: 'Excursions',
    description: "Sorties guidées d'une journée au départ de Dakar : Gorée, Lac Rose, Bandia, Sine-Saloum et Casamance.",
    collectionName: 'excursions',
  },
  {
    href: '/tourisme-affaires',
    icon: Briefcase,
    title: "Tourisme d'Affaires",
    description: "Séminaires, incentives, délégations et salles de réunion pour vos événements professionnels.",
    collectionName: 'offresAffaires',
  },
];

export default function HomeServicesGrid() {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const db = getDbInstance();
      const result: Record<string, string> = {};
      for (const service of services) {
        try {
          const q = query(collection(db, service.collectionName), orderBy('ordre', 'asc'), limit(1));
          const snap = await getDocs(q);
          snap.forEach((docSnap) => {
            const d = docSnap.data() as { image?: string; disponible?: boolean };
            if (d.disponible !== false && d.image) {
              result[service.collectionName] = d.image;
            }
          });
        } catch (e) {
          console.error(`Erreur fetch image ${service.collectionName}:`, e);
        }
      }
      if (mounted) setImages(result);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Nos prestations</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Nos 6 Services pour Voyager Serein</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
            SLAAC Voyages couvre l'ensemble de vos besoins de voyage, du billet d'avion à l'organisation complète de votre séjour.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const img = images[service.collectionName] || FALLBACK_IMAGES[service.collectionName];
            return (
              <Link key={service.title} href={service.href} className="block group">
                <Card className="overflow-hidden h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col p-0">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={img}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-primary">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground flex-grow">{service.description}</p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                      Découvrir <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* 6e carte : Réservation express */}
          <QuoteRequestDialog>
            <button type="button" className="text-left w-full h-full cursor-pointer">
            <Card className="overflow-hidden h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-accent/5 border-accent/30 flex flex-col p-0">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop"
                  alt="Réservation express"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
                <div className="absolute bottom-3 left-3 w-11 h-11 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-primary">Réservation Express</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-grow">
                  Besoin d'un devis rapide ? Décrivez votre projet, notre équipe vous répond sous 24h.
                </p>
                <div className="mt-4 flex items-center text-accent-foreground text-sm font-medium">
                  Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Card>
            </button>
          </QuoteRequestDialog>
        </div>
      </div>
    </section>
  );
}
