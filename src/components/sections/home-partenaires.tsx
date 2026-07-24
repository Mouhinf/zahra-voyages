'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Partenaire } from '@/types';
import { Loader2 } from 'lucide-react';

// Wrapper component for Image to potentially isolate client-side props
const PartnerImage = ({ src, alt, sizes, className, priority }: { src: string, alt: string, sizes: string, className: string, priority?: boolean }) => {
  return (
    <Image
      src={src}
      alt={alt} // Ensure alt is always a string literal for static generation
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={undefined} // Explicitly pass undefined to onError to prevent serialization issues
      // The error message 'onError: function onError' suggests a conflict with event handlers.
      // By ensuring props like `alt` are static strings and explicitly handling onError,
      // we aim to prevent Next.js from serializing client-side functions during static generation.
    />
  );
};

export default function HomePartenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const q = query(collection(getDbInstance(), 'partenaires'), orderBy('ordre', 'asc'));
        const snap = await getDocs(q);
        const data: Partenaire[] = [];
        snap.forEach((docSnap) => {
          data.push({ id: docSnap.id, ...docSnap.data(), logo: (docSnap.data().logo || '').includes('unsplash') ? 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/slaac-logo-png.png' : docSnap.data().logo } as Partenaire);
        });
        if (mounted) setPartenaires(data);
      } catch (e) {
        console.error('Erreur fetch partenaires:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <section className="py-10 bg-white border-y">
        <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      </section>
    );
  }

  if (partenaires.length === 0) return null;

  // Duplique la liste pour un défilement infini seamless
  const doubled = [...partenaires, ...partenaires];

  return (
    <section className="py-10 bg-white border-y border-border/40 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 mb-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
          Partenaire
        </p>
      </div>
      <div className="relative">
        {/* Gradient fade gauche/droite */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-12 sm:gap-16 animate-marquee marquee-pause whitespace-nowrap">
          {doubled.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className="relative h-16 w-24 sm:h-20 sm:w-28 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <PartnerImage
                  src={p.logo}
                  alt={'Logo ' + (p.nom?.trim() || 'partenaire')} // Made alt static literal
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain"
                  priority={true}
                  onError={undefined} // Explicitly passing undefined to onError
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">{p.nom}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
