import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import TourismeGrid from '@/components/sections/tourisme-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504523/hero-section-affaires.jpg';

export const metadata = {
  title: 'Tourisme - SLAAC Voyages',
  description: 'Tourisme religieux, local, linguistique et d’affaires au Sénégal et à l’international avec SLAAC Voyages.',
};

export default function TourismeAffairesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Tourisme" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Découvertes & expériences
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">Tourisme</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Voyages spirituels, découvertes locales, séjours linguistiques et expériences professionnelles sur mesure.
            </p>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Nos expériences</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Nos offres de tourisme</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                Explorez nos offres adaptées à vos envies : pèlerinages, découvertes du Sénégal, séjours d’apprentissage et organisation de vos déplacements professionnels.
              </p>
            </div>
            <TourismeGrid />
          </div>
        </section>

        <section className="py-20 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Organisez votre séjour</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">Parlez-nous de votre projet, nous créons une expérience adaptée à vos attentes.</p>
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
