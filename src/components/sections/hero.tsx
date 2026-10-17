'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Send, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
  </svg>
);

export default function Hero() {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex items-center justify-center text-white overflow-hidden bg-slaac-navy-950">
      {/* Photographie de fond premium avec optimisation Cloudinary LCP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784493934/hero-slide-1.png"
          alt="Séjour et voyage d'exception au Sénégal avec SLAAC Voyages"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Dégradé cinématographique équilibré garantissant un contraste WCAG AAA */}
        <div className="absolute inset-0 bg-gradient-to-t from-slaac-navy-950/95 via-slaac-navy-900/75 to-slaac-navy-900/60" />
      </div>

      {/* Contenu éditorial centré */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Badge de statut institutionnel */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-white/95">
          <span className="w-2 h-2 rounded-full bg-slaac-gold-400 animate-pulse" />
          <span>Conciergerie Touristique & Réceptif DMC · Dakar Plateau</span>
        </div>

        {/* Accroche H1 majeure */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight text-white drop-shadow-md max-w-4xl leading-[1.15]">
          Votre Conciergerie de Voyage au Sénégal et dans le Monde
        </h1>

        {/* Filet décoratif or Teranga */}
        <div className="w-20 h-1 bg-slaac-gold-500 rounded-full my-6 sm:my-7 shadow-sm" />

        {/* Sous-titre rassurant et explicite */}
        <p className="text-base sm:text-xl text-slate-100/90 max-w-3xl leading-relaxed text-balance drop-shadow">
          Navettes aéroport AIBD avec accueil pancarte, résidences meublées avec fibre et groupe électrogène, circuits privés d'exception et assistance visas d'affaires : l'exigence du service et la maîtrise du terrain à Dakar.
        </p>

        {/* Deux CTAs clairs et hiérarchisés sans friction */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-stretch sm:items-center">
          <QuoteRequestButton
            variant="gold"
            size="xl"
            source="accueil-hero"
            className="w-full sm:w-auto shadow-lg gold-glow font-semibold"
          >
            <Send className="mr-2 h-5 w-5" /> Demander un devis
          </QuoteRequestButton>

          <a
            href="https://wa.me/221773129090?text=Bonjour%20SLAAC%20Voyages%2C%20je%20souhaite%20des%20informations%20sur%20vos%20prestations."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="whatsapp"
              size="xl"
              className="w-full sm:w-auto font-medium"
            >
              <WhatsAppIcon className="mr-2 h-5 w-5 fill-current" /> WhatsApp Concierge
            </Button>
          </a>
        </div>

        {/* Barre de réassurance immédiate sous le Hero */}
        <div className="mt-10 sm:mt-14 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-200/95 w-full max-w-4xl">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4 text-slaac-gold-400 shrink-0" />
            <span>Bureau physique au Plateau</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-slaac-gold-400 shrink-0" />
            <span>Devis sous 24h ouvrées</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slaac-gold-400 shrink-0" />
            <span>Chauffeurs professionnels AIBD</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-slaac-gold-400 shrink-0" />
            <span>Résidences Fibre & Générateur</span>
          </div>
        </div>
      </div>
    </section>
  );
}
