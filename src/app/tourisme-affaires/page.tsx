import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504523/hero-section-affaires.jpg';

export const metadata = {
  title: "Tourisme d'Affaires - SLAAC Voyages",
  description: "Séminaires, incentives, MICE et missions sur mesure. SLAAC Voyages organise vos événements professionnels à Dakar et au Sénégal.",
};

export default function TourismeAffairesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Tourisme d'Affaires" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              MICE & Événementiel
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">Tourisme d'Affaires</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Séminaires, incentives, congrès et missions sur mesure pour vos événements professionnels.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">Pour les entreprises</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Nos Offres d'Affaires</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                De l'organisation de séminaires aux missions sur mesure, nous mettons notre expertise au service de vos événements professionnels : salles équipées, hébergement, transferts et activités de team building.
              </p>
            </div>
            <OffresGrid collectionName="offresAffaires" emptyMessage="Aucune offre d'affaires disponible pour le moment. Contactez-nous pour une mission sur mesure." detailBasePath="/tourisme-affaires" />
          </div>
        </section>

        <section className="py-20 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Organisez votre événement</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">Parlez-nous de votre projet, nous nous occupons de tout.</p>
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
