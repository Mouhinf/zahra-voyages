import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    price: 'À partir de  350 000 XOF',
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
  {
    name: 'Kyoto, Japon',
    price: 'À partir de  800 000 XOF',
    image: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'kyoto japan',
    tag: 'Asie',
  },
  {
    name: 'Istanbul, Turquie',
    price: 'À partir de  300 000 XOF',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'istanbul turkey',
    tag: 'Europe/Asie',
  },
  {
    name: 'Le Caire, Égypte',
    price: 'À partir de  250 000 XOF',
    image: '/caire.jpg',
    hint: 'cairo egypt',
    tag: 'Afrique',
  },
  {
    name: 'Rio de Janeiro, Brésil',
    price: 'À partir de  650 000 XOF',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=400&h=500&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    hint: 'rio de janeiro',
    tag: 'Amérique du Sud',
  },
  {
    name: 'Rome, Italie',
    price: 'À partir de  300 000 XOF',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&h=500&fit=crop',
    hint: 'rome italy',
    tag: 'Europe',
  },
  {
    name: 'Bali, Indonésie',
    price: 'À partir de  920 000 XOF',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&h=500&fit=crop',
    hint: 'bali indonesia',
    tag: 'Asie',
  },
  {
    name: 'Londres, Royaume-Uni',
    price: 'À partir de  400 000 XOF',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=400&h=500&fit=crop',
    hint: 'london uk',
    tag: 'Europe',
  },
  {
    name: 'Bangkok, Thaïlande',
    price: 'À partir de  890 000 XOF',
    image: '/Bangkok.jpg',
    hint: 'bangkok thailand',
    tag: 'Asie',
  },
  {
    name: 'Marrakech, Maroc',
    price: 'À partir de  190 000 XOF',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400&h=500&fit=crop',
    hint: 'marrakech morocco',
    tag: 'Afrique',
  },
  {
    name: 'Sydney, Australie',
    price: 'À partir de  900 000 XOF',
    image: '/sydney.jpg',
    hint: 'sydney australia',
    tag: 'Océanie',
  },
  {
    name: 'Amsterdam, Pays-Bas',
    price: 'À partir de  400 000 XOF',
    image: 'https://images.unsplash.com/photo-1584003564911-a7a321c84e1c?q=80&w=400&h=500&fit=crop',
    hint: 'amsterdam netherlands',
    tag: 'Europe',
  },
  {
    name: 'Lisbonne, Portugal',
    price: 'À partir de  250 000 XOF',
    image: '/lisbonne.jpg',
    hint: 'lisbon portugal',
    tag: 'Europe',
  },
];

export default function DestinationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Inspiration</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary font-headline">Nos Destinations</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-secondary-foreground max-w-3xl mx-auto text-balance">
              Le monde est à votre portée. Explorez notre sélection de destinations et trouvez l'inspiration pour votre prochaine aventure.
            </p>
          </div>
        </section>

        <section id="destinations" className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <Alert className="mb-10 bg-primary/5 border-primary/20 text-primary">
                <Info className="h-5 w-5" />
                <AlertDescription>
                Les tarifs affichés sont des estimations de départ et peuvent varier en fonction de la saison, de la disponibilité et du moment de la réservation. Pour un devis précis, veuillez nous contacter.
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <Card key={dest.name} className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={dest.hint}
                    />
                    <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{dest.tag}</Badge>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-primary font-headline">{dest.name}</h3>
                    <p className="text-sm font-medium text-accent-foreground mt-1 flex-grow">{dest.price}</p>
                    <QuoteRequestButton variant="link" className="p-0 mt-2 text-primary self-start">
                        Obtenir un devis <ArrowRight className="ml-2 h-4 w-4" />
                    </QuoteRequestButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
