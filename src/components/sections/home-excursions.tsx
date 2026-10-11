import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

// Circuits & excursions recommandés — tirés de la collection réelle
// `excursions` (Firestore), type « circuit » d'abord puis excursions.

type Offre = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  tag: string;
  lieu?: string;
  duree?: string;
};

async function fetchRecommended(): Promise<Offre[]> {
  const db = getDbInstance();
  const q = query(collection(db, 'excursions'), orderBy('ordre', 'asc'), limit(12));
  const snap = await getDocs(q);
  const all: Array<Offre & { type?: string; disponible?: boolean }> = [];
  snap.forEach((docSnap) => {
    const d = docSnap.data() as Partial<Offre> & { type?: string; disponible?: boolean };
    if (d.disponible === false || !d.image || !d.titre) return;
    all.push({
      id: docSnap.id,
      titre: d.titre,
      description: d.description ?? '',
      prix: d.prix ?? '',
      image: d.image,
      tag: d.tag ?? '',
      lieu: d.lieu,
      duree: d.duree,
      type: d.type,
    });
  });
  // Circuits (plusieurs jours) d'abord, puis excursions à la journée.
  const circuits = all.filter((o) => o.type === 'circuit');
  const excursions = all.filter((o) => o.type !== 'circuit');
  return [...circuits, ...excursions].slice(0, 3);
}

export default async function HomeExcursions() {
  let offres: Offre[] = [];
  try {
    offres = await fetchRecommended();
  } catch (e) {
    console.error('Erreur chargement circuits recommandés:', e);
  }

  if (offres.length === 0) {
    return null; // Pas de données réelles : la section ne s'affiche pas.
  }

  return (
    <section id="excursions" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Circuits & Excursions</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Nos Circuits Recommandés</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Gorée, Lac Rose, Sine-Saloum, Casamance… découvrez le Sénégal avec des guides passionnés.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offres.map((offre) => (
            <Card key={offre.id} className="overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col p-0">
              <Link href={`/excursions/${offre.id}`} className="block">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={offre.image}
                    alt={offre.titre}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {offre.tag && <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground">{offre.tag}</Badge>}
                </div>
              </Link>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary">{offre.titre}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                  {offre.lieu && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {offre.lieu}</span>}
                  {offre.duree && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {offre.duree}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-grow">{offre.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-primary">{offre.prix}</span>
                  <Link href={`/excursions/${offre.id}`} className="text-sm font-medium text-primary inline-flex items-center gap-1 hover:underline">
                    Découvrir <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/excursions" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-11 text-sm font-medium">
            Tous les circuits & excursions <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
