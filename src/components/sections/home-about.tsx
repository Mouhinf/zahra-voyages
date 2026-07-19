import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SLAAC_LOGO = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_png,q_auto/v1784498932/slaac-logo-png.png';

export default function HomeAbout() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-full min-h-[400px] w-full rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center">
            <div className="relative w-3/4 max-w-sm aspect-square animate-float drop-shadow-2xl">
              <Image
                src={SLAAC_LOGO}
                alt="SLAAC Voyages — Logo officiel"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 70vw, 30vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
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
