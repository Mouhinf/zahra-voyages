import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { featuredExcursions } from '@/data/featured-excursions';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504521/hero-section-excursions.jpg';

export const metadata = {
  title: 'Excursions - SLAAC Voyages',
  description: "Excursions et visites guidées au Sénégal : Île de Gorée, Lac Rose, Casamance. Découvrez les trésors du Sénégal avec SLAAC Voyages.",
};

export default function ExcursionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Excursions" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Visites Guidées
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">Excursions</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Visites guidées et excursions au cœur du Sénégal et au-delà.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Au départ de Dakar</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Nos Excursions</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                Découvrez les sites incontournables et les trésors cachés du Sénégal avec nos excursions guidées, de la demi-journée au séjour de plusieurs jours.
              </p>
            </div>
            <OffresGrid collectionName="excursions" emptyMessage="Aucune excursion disponible pour le moment. Contactez-nous pour une excursion sur mesure." detailBasePath="/excursions" staticItems={featuredExcursions} />
          </div>
        </section>

        <section className="py-20 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Envie d'explorer ?</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">Réservez votre excursion ou demandez un programme sur mesure.</p>
            <div className="mt-8">
              <QuoteRequestDialog>
                <Button size="lg"><Send className="mr-2 h-4 w-4" /> Demander un devis</Button>
              </QuoteRequestDialog>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
