import Image from 'next/image';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Partenaire } from '@/types';
import { cache } from 'react';

const fetchPartenaires = cache(async (): Promise<Partenaire[]> => {
  try {
    const q = query(collection(getDbInstance(), 'partenaires'), orderBy('ordre', 'asc'));
    const snap = await getDocs(q);
    const data: Partenaire[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const rawLogo = String(d.logo || '');
      const logo = rawLogo.includes('unsplash')
        ? 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/slaac-logo-png.png'
        : rawLogo;
      data.push({ id: docSnap.id, ...d, logo } as Partenaire);
    });
    return data;
  } catch (e) {
    console.error('Erreur fetch partenaires:', e);
    return [];
  }
});

export default async function HomePartenaires() {
  const partenaires = await fetchPartenaires();

  if (partenaires.length === 0) return null;

  // Duplique la liste pour un défilement infini fluide
  const doubled = [...partenaires, ...partenaires];

  return (
    <section className="py-10 bg-white border-y border-border/40 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 mb-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-primary">
          Ils nous accompagnent
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
              <div className="relative h-16 w-24 sm:h-20 sm:w-28 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex items-center justify-center">
                <Image
                  src={p.logo}
                  alt={'Logo ' + (p.nom?.trim() || 'partenaire')}
                  width={96}
                  height={64}
                  className="object-contain max-h-16 w-auto"
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
