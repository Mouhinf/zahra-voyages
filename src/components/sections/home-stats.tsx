'use client';

import * as React from 'react';
import { Calendar, Globe, Users, Handshake } from 'lucide-react';

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
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/15 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-4xl md:text-5xl font-bold font-headline">
        {value.toLocaleString('fr-FR')}{stat.suffixe}
      </div>
      <p className="mt-2 text-sm md:text-base text-primary-foreground/80">{stat.label}</p>
    </div>
  );
}

export default function HomeStats() {
  const [started, setStarted] = React.useState(false);
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

  return (
    <section ref={ref} className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
