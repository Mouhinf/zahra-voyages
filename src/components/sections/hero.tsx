'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';

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
      <div className="absolute inset-0 bg-black/60 z-10" />

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
          Découvrez des destinations incroyables et vivez des expériences uniques avec SLAAC Voyages.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/destinations">
            <Button size="lg" variant="default" className="w-full sm:w-auto">
              Explorer les Destinations
            </Button>
          </Link>
          <a href="/brochure-slaac-voyages.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <Download className="mr-2 h-5 w-5" />
              Notre Brochure
            </Button>
          </a>
        </div>
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transition-colors"
        aria-label="Image précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transition-colors"
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
            className={`h-2.5 rounded-full transition-all ${
              idx === current ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
