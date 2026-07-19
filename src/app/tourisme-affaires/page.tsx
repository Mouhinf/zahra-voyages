import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export const metadata = {
  title: "Tourisme d'Affaires - SLAAC Voyages",
  description: "Séminaires, incentives, MICE et missions sur mesure. SLAAC Voyages organise vos événements professionnels à Dakar et au Sénégal.",
};

export default function TourismeAffairesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
          <div className="relative z-20 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">Tourisme d'Affaires</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Séminaires, incentives, congrès et missions sur mesure pour vos événements professionnels.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Nos Offres d'Affaires</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                De l'organisation de séminaires aux missions sur mesure, nous mettons notre expertise au service de vos événements professionnels : salles équipées, hébergement, transferts et activités de team building.
              </p>
            </div>
            <OffresGrid collectionName="offresAffaires" emptyMessage="Aucune offre d'affaires disponible pour le moment. Contactez-nous pour une mission sur mesure." detailBasePath="/tourisme-affaires" />
          </div>
        </section>

        <section className="py-16 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Organisez votre événement</h2>
            <p className="mt-4 text-muted-foreground">Parlez-nous de votre projet, nous nous occupons de tout.</p>
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
