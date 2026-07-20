'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Temoignage } from '@/types';

const temoignages: Temoignage[] = [
  {
    id: 't1',
    nom: 'Awa Diop',
    ville: 'Dakar, Sénégal',
    note: 5,
    texte: "Voyage inoubliable à Dubaï organisé par SLAAC Voyages. Tout était parfait : vol, hôtel, transferts et excursions. Une équipe à l'écoute qui a su comprendre nos envies. Je recommande sans hésiter.",
    service: 'Voyage à Dubaï',
    date: '2025-03-15',
    visible: true,
    ordre: 1,
  },
  {
    id: 't2',
    nom: 'Mamadou Sow',
    ville: 'Thiès, Sénégal',
    note: 5,
    texte: "Excursion à l'île de Gorée parfaitement organisée. Le guide était passionné et le déjeuner excellent. Une journée riche en émotions et en découvertes. Merci à toute l'équipe de SLAAC.",
    service: 'Excursion Gorée',
    date: '2025-01-20',
    visible: true,
    ordre: 2,
  },
  {
    id: 't3',
    nom: 'Fatou Ndiaye',
    ville: 'Paris, France',
    note: 5,
    texte: "Séminaire d'entreprise à Saly pour 30 collaborateurs : organisation impeccable, salle équipée, hébergement de qualité et activités de cohésion réussies. SLAAC a répondu à toutes nos exigences.",
    service: "Séminaire d'entreprise",
    date: '2024-11-08',
    visible: true,
    ordre: 3,
  },
  {
    id: 't4',
    nom: 'Cheikh Fall',
    ville: 'Dakar, Sénégal',
    note: 4,
    texte: "Location d'un 4x4 avec chauffeur pour un séjour en Casamance. Véhicule en parfait état, chauffeur ponctuel et très professionnel. Un service sérieux pour découvrir le Sénégal en toute tranquillité.",
    service: 'Location véhicule',
    date: '2025-02-10',
    visible: true,
    ordre: 4,
  },
];

function getDiceBearAvatarUrl(nom: string): string {
  const seed = encodeURIComponent(nom);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=0f4c81,f59e0b,1e3a5f&backgroundType=gradientLinear&radius=50`;
}

function renderStars(note: number) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= note ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export default function HomeTestimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Témoignages</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Ils Nous Font Confiance</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            La satisfaction de nos voyageurs est notre plus belle récompense. Découvrez leurs témoignages.
          </p>
        </div>
        <div className="mt-12">
          <Carousel
            opts={{ align: 'start', loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {temoignages.map((t) => (
                <CarouselItem key={t.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                  <Card className="h-full shadow-md p-6 flex flex-col">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <Quote className="h-8 w-8 text-primary/20" />
                        {renderStars(t.note)}
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic flex-grow">"{t.texte}"</p>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.avatarUrl || getDiceBearAvatarUrl(t.nom)}
                            alt={t.nom}
                            className="w-12 h-12 rounded-full border-2 border-primary/20 bg-primary/5"
                          />
                          <div>
                            <p className="font-semibold text-primary">{t.nom}</p>
                            <p className="text-xs text-muted-foreground">{t.ville}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <Badge variant="outline" className="text-xs">{t.service}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
