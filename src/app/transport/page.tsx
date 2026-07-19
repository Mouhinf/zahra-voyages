import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg';

export const metadata = {
  title: 'Transport - SLAAC Voyages',
  description: 'Location de voiture, VTC, transferts aéroport et bus privé à Dakar et au Sénégal. Voyagez en toute liberté avec SLAAC Voyages.',
};

export default function TransportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Transport" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
          <div className="relative z-20 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">Transport</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Location de voiture, VTC, transferts aéroport et bus privé. Déplacez-vous en toute liberté.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Nos Offres de Transport</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Des solutions de transport adaptées à tous vos besoins, avec ou sans chauffeur, pour vos déplacements urbains ou longue distance.
              </p>
            </div>
            <OffresGrid collectionName="transports" emptyMessage="Aucune offre de transport disponible pour le moment. Contactez-nous pour une demande personnalisée." detailBasePath="/transport" />
          </div>
        </section>

        <section className="py-16 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Un besoin de transport spécifique ?</h2>
            <p className="mt-4 text-muted-foreground">Contactez-nous pour une solution de transport sur mesure.</p>
            <div className="mt-6">
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
