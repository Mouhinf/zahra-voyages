import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1568992687947-8680f2285c88?w=800&h=600&fit=crop';

async function fetchAboutImage(): Promise<string> {
  try {
    const db = getDbInstance();
    const q = query(collection(db, 'voyagesCroisieres'), orderBy('ordre', 'asc'), limit(1));
    const snap = await getDocs(q);
    let img = FALLBACK_IMG;
    snap.forEach((docSnap) => {
      const d = docSnap.data() as { image?: string; disponible?: boolean };
      if (d.disponible !== false && d.image) img = d.image;
    });
    return img;
  } catch {
    return FALLBACK_IMG;
  }
}

export default async function HomeAbout() {
  const aboutImg = await fetchAboutImage();

  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-full min-h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={aboutImg}
              alt="SLAAC Voyages — Votre agence de voyage à Dakar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Votre Partenaire de Confiance pour des Voyages Inoubliables</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Fondée à Dakar, SLAAC Voyages est une agence de voyage passionnée qui transforme vos rêves d'évasion en réalités. Depuis plus de 15 ans, nous accompagnons les voyageurs sénégalais et internationaux vers les plus belles destinations.
            </p>
            <p className="mt-4 text-muted-foreground">
              Notre équipe d'experts conçoit des itinéraires sur mesure — du séjour balnéaire au circuit culturel, du séminaire d'entreprise à la croisière de rêve — avec un seul mot d'ordre : votre satisfaction.
            </p>
            <Link href="/about">
              <Button variant="default" size="lg" className="mt-6">
                En savoir plus sur nous <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
