import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import VoyagesCroisieresGrid from '@/components/sections/voyages-croisieres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504520/hero-section-voyages.jpg';

export const metadata = {
  title: 'Voyages & Croisières - SLAAC Voyages',
  description: 'Voyages sur mesure et croisières vers des destinations de rêve. Réservez votre prochaine aventure avec SLAAC Voyages.',
};

export default function VoyagesCroisieresPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Voyages & Croisières" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Circuits & Croisières
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">Voyages & Croisières</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Des voyages sur mesure et des croisières inoubliables vers les plus belles destinations.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Voyages & Croisières</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                Explorez le monde avec nos packages de voyage et nos croisières soigneusement sélectionnés. Vol, hôtel, transferts et activités inclus.
              </p>
            </div>
            <VoyagesCroisieresGrid />
          </div>
        </section>

        <section className="py-20 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Une destination en tête ?</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">Nos experts conçoivent le voyage de vos rêves, sur mesure.</p>
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
