'use client';

import * as React from 'react';
import Image from 'next/image';
import { Calendar, Globe, Users, Handshake } from 'lucide-react';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

type Stat = {
  valeur: number;
  suffixe: string;
  label: string;
  icone: React.ElementType;
};

const stats: Stat[] = [
  { valeur: 15, suffixe: '+', label: "Années d'expérience", icone: Calendar },
  { valeur: 40, suffixe: '+', label: 'Destinations couvertes', icone: Globe },
  { valeur: 2500, suffixe: '+', label: 'Clients satisfaits', icone: Users },
  { valeur: 120, suffixe: '+', label: 'Partenaires de confiance', icone: Handshake },
];

const FALLBACK_BG = 'https://images.unsplash.com/photo-1436491865332-7a61d1096790?w=1920&h=600&fit=crop';

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function StatItem({ stat, started }: { stat: Stat; started: boolean }) {
  const Icon = stat.icone;
  const value = useCountUp(stat.valeur, 2000, started);
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm mb-4 border border-white/20">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-4xl md:text-5xl font-bold font-headline">
        {value.toLocaleString('fr-FR')}{stat.suffixe}
      </div>
      <p className="mt-2 text-sm md:text-base text-white/85">{stat.label}</p>
    </div>
  );
}

export default function HomeStats() {
  const [started, setStarted] = React.useState(false);
  const [bgImage, setBgImage] = React.useState<string>(FALLBACK_BG);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = getDbInstance();
        const q = query(collection(db, 'voyagesCroisieres'), orderBy('ordre', 'asc'), limit(1));
        const snap = await getDocs(q);
        snap.forEach((docSnap) => {
          const d = docSnap.data() as { image?: string; disponible?: boolean };
          if (d.disponible !== false && d.image && mounted) {
            setBgImage(d.image);
          }
        });
      } catch (e) {
        console.error('Erreur fetch bg stats:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section ref={ref} className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-primary/85" />
      </div>
      <div className="container mx-auto max-w-7xl px-4 text-primary-foreground">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
