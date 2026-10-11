import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';

// Destination = idée de voyage : chaque tuile ouvre un devis prérempli avec
// la destination. Pas de prix affiché ici : les tarifs réels sont donnés dans
// le devis (les « à partir de » génériques, invérifiables, ont été retirés).
const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=600&h=750&fit=crop',
    tag: 'Europe',
  },
  {
    name: 'Dubaï, EAU',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&h=750&fit=crop',
    tag: 'Orient',
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=600&h=750&fit=crop',
    tag: 'Amérique',
  },
  {
    name: 'Casamance, Sénégal',
    image: '/casamance.webp',
    tag: 'Afrique',
  },
];

export default function HomeDestinations() {
  return (
    <section id="destinations" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">Destinations</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Des Destinations qui Font Rêver</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Aventure, détente ou découvertes culturelles : dites-nous où vous rêvez d'aller, nous construisons le séjour autour de votre budget.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => (
            <QuoteRequestButton
              key={dest.name}
              asChild
              defaultService="voyages-croisieres"
              defaultDestination={dest.name}
              source="accueil-destinations"
              className="group text-left cursor-pointer"
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0 h-full">
                <div className="relative h-64">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground">{dest.tag}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-primary">{dest.name}</h3>
                  <p className="text-sm text-primary/70 mt-1 inline-flex items-center gap-1">
                    Devis sur mesure <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </p>
                </CardContent>
              </Card>
            </QuoteRequestButton>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link href="/destinations">
                <Button size="lg" variant="default">
                    Voir toutes les destinations <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
