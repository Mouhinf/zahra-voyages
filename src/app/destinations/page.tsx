import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations de rêve au départ de Dakar | SLAAC Voyages',
  description: "Paris, Dubaï, New York, Casamance, Bali, Marrakech… Dites-nous où vous rêvez d’aller : SLAAC Voyages conçoit votre séjour sur mesure avec devis gratuit sous 24 h.",
  alternates: { canonical: '/destinations' },
  openGraph: {
    title: 'Destinations de rêve au départ de Dakar | SLAAC Voyages',
    description: "Inspiration voyages et séjours sur mesure au départ de Dakar vers le monde entier avec SLAAC Voyages.",
    url: '/destinations',
  },
};

// Destinations = inspiration. Les tarifs « à partir de » génériques ont été
// retirés : ils étaient invérifiables et variaient trop selon la saison.
// Chaque destination ouvre un devis prérempli — le tarif réel est donné par
// un conseiller sous 24 h.
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
  {
    name: 'Kyoto, Japon',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&h=750&fit=crop',
    tag: 'Asie',
  },
  {
    name: 'Istanbul, Turquie',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=600&h=750&fit=crop',
    tag: 'Europe/Asie',
  },
  {
    name: 'Le Caire, Égypte',
    image: '/caire.jpg',
    tag: 'Afrique',
  },
  {
    name: 'Rio de Janeiro, Brésil',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600&h=750&fit=crop',
    tag: 'Amérique du Sud',
  },
  {
    name: 'Rome, Italie',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&h=750&fit=crop',
    tag: 'Europe',
  },
  {
    name: 'Bali, Indonésie',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&h=750&fit=crop',
    tag: 'Asie',
  },
  {
    name: 'Londres, Royaume-Uni',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=600&h=750&fit=crop',
    tag: 'Europe',
  },
  {
    name: 'Bangkok, Thaïlande',
    image: '/Bangkok.jpg',
    tag: 'Asie',
  },
  {
    name: 'Marrakech, Maroc',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600&h=750&fit=crop',
    tag: 'Afrique',
  },
  {
    name: 'Sydney, Australie',
    image: '/sydney.jpg',
    tag: 'Océanie',
  },
  {
    name: 'Amsterdam, Pays-Bas',
    image: 'https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?q=80&w=600&h=750&fit=crop',
    tag: 'Europe',
  },
  {
    name: 'Lisbonne, Portugal',
    image: '/lisbonne.jpg',
    tag: 'Europe',
  },
];

export default function DestinationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Destinations' }]} />
        </div>
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Inspiration</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary font-headline">Nos Destinations</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
              Le monde est à votre portée. Choisissez une destination : nous construisons le séjour sur mesure autour de votre budget, avec un devis précis sous 24 h.
            </p>
          </div>
        </section>

        <section id="destinations" className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <QuoteRequestButton
                  key={dest.name}
                  asChild
                  defaultService="voyages-croisieres"
                  defaultDestination={dest.name}
                  source="page-destinations"
                  className="group text-left cursor-pointer"
                >
                  <Card className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50 p-0 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{dest.tag}</Badge>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-grow">
                      <h2 className="text-lg font-semibold text-primary font-headline">{dest.name}</h2>
                      <p className="text-sm text-primary/70 mt-1 flex-grow">Séjour sur mesure</p>
                      <span className="text-sm font-medium text-primary inline-flex items-center gap-1 mt-2">
                        Demander un devis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </QuoteRequestButton>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
