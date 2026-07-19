import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

type OffrePhare = {
  id: string;
  titre: string;
  prix: string;
  image: string;
  tag: string;
  section: string;
  basePath: string;
};

const collectionsConfig = [
  { name: 'hebergements', basePath: '/hebergement', section: 'Hébergement', limit: 2 },
  { name: 'voyagesCroisieres', basePath: '/voyages-croisieres', section: 'Voyages & Croisières', limit: 2 },
  { name: 'excursions', basePath: '/excursions', section: 'Excursions', limit: 2 },
];

async function fetchFeatured(): Promise<OffrePhare[]> {
  const offres: OffrePhare[] = [];
  const db = getDbInstance();
  for (const cfg of collectionsConfig) {
    try {
      const q = query(collection(db, cfg.name), orderBy('ordre', 'asc'), limit(cfg.limit));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const d = docSnap.data() as { titre: string; prix: string; image: string; tag: string; disponible?: boolean };
        if (d.disponible !== false && d.image) {
          offres.push({
            id: docSnap.id,
            titre: d.titre,
            prix: d.prix,
            image: d.image,
            tag: d.tag,
            section: cfg.section,
            basePath: cfg.basePath,
          });
        }
      });
    } catch (e) {
      console.error(`Erreur fetch ${cfg.name}:`, e);
    }
  }
  return offres.slice(0, 6);
}

export default async function HomeFeatured() {
  let offres: OffrePhare[] = [];
  try {
    offres = await fetchFeatured();
  } catch (e) {
    console.error('Erreur chargement offres phares:', e);
  }

  if (offres.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Nos Offres Phares</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Une sélection de nos meilleures expériences, plébiscitées par nos voyageurs. De quoi vous donner l'envie de partir.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offres.map((offre) => (
            <Card key={`${offre.section}-${offre.id}`} className="overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col p-0">
              <Link href={`${offre.basePath}/${offre.id}`} className="block">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={offre.image}
                    alt={offre.titre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground">{offre.section}</Badge>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold drop-shadow-lg">{offre.titre}</h3>
                    <p className="text-sm font-medium text-accent drop-shadow mt-1">{offre.prix}</p>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/hebergement"><Button size="lg" variant="default">Hébergements <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          <Link href="/voyages-croisieres"><Button size="lg" variant="default">Voyages <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          <Link href="/excursions"><Button size="lg" variant="default">Excursions <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
