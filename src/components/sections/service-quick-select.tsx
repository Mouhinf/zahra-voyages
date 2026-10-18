'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Globe2, Briefcase, Car, Hotel, MapPinned, FileCheck2, Ship, ShieldCheck } from 'lucide-react';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ServiceQuickSelect() {
  return (
    <section aria-label="Identifier votre besoin de voyage" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slaac-gold-600">
            Orientation Express
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-headline mt-1.5">
            Quel voyage préparez-vous aujourd'hui ?
          </h2>
          <div className="w-16 h-0.5 bg-slaac-gold-500 mx-auto my-3.5" />
          <p className="text-sm sm:text-base text-slate-600">
            Choisissez votre situation pour accéder directement aux solutions et forfaits adaptés à vos attentes.
          </p>
        </div>

        {/* Grille des 3 parcours stratégiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Parcours 1 : Je viens au Sénégal */}
          <div className="card-premium p-6 sm:p-7 flex flex-col justify-between relative group hover:border-slaac-gold-400">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-slaac-gold-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Compass className="h-6 w-6" />
              </div>
              <Badge variant="gold" className="mb-3 text-[11px]">Incoming & Séjour Réceptif</Badge>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Je viens au Sénégal
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Touristes, familles et diaspora : sécurisez votre arrivée à l’aéroport AIBD, vos résidences haut de gamme à Dakar et vos excursions régionales.
              </p>
              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slaac-gold-500 shrink-0" />
                  <span>Transfert AIBD dès 30 000 FCFA (accueil pancarte)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Hotel className="h-4 w-4 text-slaac-gold-500 shrink-0" />
                  <span>Résidences vérifiées (Fibre & Générateur 24/7)</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-slaac-gold-500 shrink-0" />
                  <span>Excursions privées : Gorée, Lac Rose, Bandia</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 pt-4 border-t border-slate-100">
              <Button asChild variant="outline" className="w-full sm:flex-1 lg:w-full xl:flex-1 justify-between hover:bg-slaac-gold-50 hover:text-slaac-gold-700">
                <Link href="/transport">
                  <span>Explorer les forfaits</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <QuoteRequestButton
                variant="gold"
                size="default"
                defaultService="transport"
                source="accueil-parcours-incoming"
                className="w-full sm:w-auto lg:w-full xl:w-auto shrink-0"
              >
                Devis rapide
              </QuoteRequestButton>
            </div>
          </div>

          {/* Parcours 2 : Je voyage à l'international */}
          <div className="card-premium p-6 sm:p-7 flex flex-col justify-between relative group hover:border-slaac-gold-400">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-slaac-navy-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Globe2 className="h-6 w-6" />
              </div>
              <Badge variant="navy" className="mb-3 text-[11px]">Outgoing & Mobilité Globale</Badge>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Je voyage à l'international
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Commerçants dakarois, pèlerins et étudiants : facilitez vos formalités administratives, vos billets d’avion négociés et votre hébergement à l'étranger.
              </p>
              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-slaac-navy-700 shrink-0" />
                  <span>Visas express : Chine, Dubaï, Schengen, Turquie</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slaac-navy-700 shrink-0" />
                  <span>Assurance voyage consulaire immédiate</span>
                </li>
                <li className="flex items-center gap-2">
                  <Ship className="h-4 w-4 text-slaac-navy-700 shrink-0" />
                  <span>Forfaits Omra grand confort & croisières</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 pt-4 border-t border-slate-100">
              <Button asChild variant="outline" className="w-full sm:flex-1 lg:w-full xl:flex-1 justify-between hover:bg-slate-100">
                <Link href="/assistance-voyage">
                  <span>Assistance & Visas</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <QuoteRequestButton
                variant="gold"
                size="default"
                defaultService="assistance-visa"
                source="accueil-parcours-outgoing"
                className="w-full sm:w-auto lg:w-full xl:w-auto shrink-0"
              >
                Devis rapide
              </QuoteRequestButton>
            </div>
          </div>

          {/* Parcours 3 : Voyage professionnel & Événements */}
          <div className="card-premium p-6 sm:p-7 flex flex-col justify-between relative group hover:border-slaac-gold-400">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <Badge variant="verified" className="mb-3 text-[11px]">B2B, MICE & JOJ 2026</Badge>
              <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                Voyage d'affaires & Délégation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Entreprises, ONG, comités olympiques et délégations : confiez votre logistique au sol à un DMC rigoureux garantissant réactivité et facturation conforme.
              </p>
              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Chauffeurs bilingues dédiés & flotte VIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Organisation séminaires & accueil salon AIBD</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Opérateur logistique pour JOJ Dakar 2026</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 pt-4 border-t border-slate-100">
              <Button asChild variant="outline" className="w-full sm:flex-1 lg:w-full xl:flex-1 justify-between hover:bg-emerald-50 hover:text-emerald-800">
                <Link href="/tourisme-affaires">
                  <span>Solutions Corporate</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <QuoteRequestButton
                variant="gold"
                size="default"
                defaultService="tourisme-affaires"
                source="accueil-parcours-b2b"
                className="w-full sm:w-auto lg:w-full xl:w-auto shrink-0"
              >
                Devis rapide
              </QuoteRequestButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
