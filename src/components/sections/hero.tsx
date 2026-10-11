'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Send, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.79 1.499h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor"/>
  </svg>
);

const slides = [
  {
    url: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784493934/hero-slide-1.png',
    alt: 'Voyages SLAAC — Slide 1',
  },
  {
    url: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784493949/hero-slide-2.png',
    alt: 'Voyages SLAAC — Slide 2',
  },
  {
    url: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784493955/hero-slide-3.png',
    alt: 'Voyages SLAAC — Slide 3',
  },
  {
    url: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784493960/hero-slide-4.png',
    alt: 'Voyages SLAAC — Slide 4',
  },
];

const SLIDE_INTERVAL = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = (idx: number) => setCurrent(idx);

  useEffect(() => {
    // Respect de prefers-reduced-motion : pas de défilement automatique.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={idx !== current}
        >
          <Image
            src={slide.url}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={idx === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-black/50 to-black/70 z-10" />

      {/* Contenu */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 text-white">
          Agence de voyage premium · Dakar
        </span>
        <h1 className="text-4xl md:text-7xl font-bold tracking-tight drop-shadow-lg font-headline text-white">
          Votre Passeport pour le Monde
        </h1>
        <div className="w-20 h-0.5 bg-accent mx-auto my-6" />
        <p className="text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md text-white/90 text-balance">
          Voyages sur mesure, billetterie, visas et séjours organisés par une équipe dakaroise à votre écoute.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <QuoteRequestButton variant="gold" size="lg" source="accueil-hero" className="w-full sm:w-auto">
            <Send className="mr-2 h-5 w-5" /> Demander un devis
          </QuoteRequestButton>
          <Link href="#services" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              Explorer les offres
            </Button>
          </Link>
          <a
            href="https://wa.me/221773129090"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <WhatsAppIcon className="mr-2 h-5 w-5 fill-current" /> WhatsApp
            </Button>
          </a>
        </div>

        {/* Réassurance */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" aria-hidden="true" /> Réponse sous 24 h</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" /> Devis gratuit et sans engagement</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" aria-hidden="true" /> Agence à Dakar Plateau</span>
        </div>
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Image précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Image suivante"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      {/* Indicateurs (points) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Aller au slide ${idx + 1}`}
            aria-current={idx === current}
            className="p-1.5 flex items-center"
          >
            <span className={`block rounded-full transition-all ${
              idx === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
}
