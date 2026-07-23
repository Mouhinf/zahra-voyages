import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const destinations = [
  {
    name: 'Paris, France',
    price: 'À partir de  300 000 XOF',
    image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'paris france',
    tag: 'Europe',
  },
  {
    name: 'Dubaï, EAU',
    price: 'À partir de  600 000 XOF',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'dubai city',
    tag: 'Orient',
  },
  {
    name: 'New York, USA',
    price: 'À partir de  750 000 XOF',
    image: 'https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'new york usa',
    tag: 'Amérique',
  },
  {
    name: 'Casamance, Sénégal',
    price: 'À partir de  45 000 XOF',
    image: '/casamance.webp',
    hint: 'senegal beach',
    tag: 'Afrique',
  },
];

export default function HomeDestinations() {
  return (
    <section id="destinations" className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Des Destinations qui Font Rêver</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Que vous soyez en quête d'aventure, de détente ou de découvertes culturelles, nous avons la destination parfaite pour vous. Laissez-vous inspirer.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => (
            <Card key={dest.name} className="overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href="/destinations">
                <div className="relative h-64">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={dest.hint}
                  />
                  <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground">{dest.tag}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-primary">{dest.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{dest.price}</p>
                </CardContent>
              </Link>
            </Card>
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
