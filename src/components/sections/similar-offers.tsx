'use client';

// Offres similaires — sous une page d'offre détaillée : autres offres
// disponibles du même module, proposées à la découverte (et au devis).

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

type OffreSimilaire = {
  id: string;
  titre: string;
  prix: string;
  image: string;
};

export function SimilarOffers({
  collectionName,
  basePath,
  excludeId,
  max = 3,
}: {
  collectionName: string;
  basePath: string;
  excludeId: string;
  max?: number;
}) {
  const [items, setItems] = useState<OffreSimilaire[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // On récupère un peu plus que nécessaire : certaines offres peuvent
        // être indisponibles ou être l'offre courante.
        const q = query(collection(getDbInstance(), collectionName), orderBy('ordre', 'asc'), limit(max * 3));
        const snap = await getDocs(q);
        const found: OffreSimilaire[] = [];
        snap.forEach((docSnap) => {
          if (docSnap.id === excludeId || found.length >= max) return;
          const d = docSnap.data() as { titre?: string; prix?: string; image?: string; disponible?: boolean };
          if (d.disponible === false || !d.titre || !d.image) return;
          found.push({ id: docSnap.id, titre: d.titre, prix: d.prix ?? '', image: d.image });
        });
        if (mounted) setItems(found);
      } catch (e) {
        console.error('Erreur chargement offres similaires:', e);
        if (mounted) setItems([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [collectionName, basePath, excludeId, limit]);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="py-12 bg-secondary" aria-label="Offres similaires">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Vous aimerez aussi</h2>
          <Link href={basePath} className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:underline shrink-0">
            Tout voir <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items === null
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-56 rounded-lg" />)
            : items.map((o) => (
                <Link key={o.id} href={`${basePath}/${o.id}`} className="block group">
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow p-0 h-full">
                    <div className="relative h-36">
                      <Image
                        src={o.image}
                        alt={o.titre}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-primary line-clamp-2">{o.titre}</h3>
                      {o.prix && <p className="text-sm text-primary/70 mt-1">{o.prix}</p>}
                    </CardContent>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
