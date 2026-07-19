import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export const metadata = {
  title: 'Voyages & Croisières - SLAAC Voyages',
  description: 'Voyages sur mesure et croisières vers des destinations de rêve. Réservez votre prochaine aventure avec SLAAC Voyages.',
};

export default function VoyagesCroisieresPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
          <div className="relative z-20 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">Voyages & Croisières</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Des voyages sur mesure et des croisières inoubliables vers les plus belles destinations.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Nos Voyages & Croisières</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Explorez le monde avec nos packages de voyage et nos croisières soigneusement sélectionnés. Vol, hôtel, transferts et activités inclus.
              </p>
            </div>
            <OffresGrid collectionName="voyagesCroisieres" emptyMessage="Aucun voyage ou croisière disponible pour le moment. Contactez-nous pour un voyage sur mesure." detailBasePath="/voyages-croisieres" />
          </div>
        </section>

        <section className="py-16 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Une destination en tête ?</h2>
            <p className="mt-4 text-muted-foreground">Nos experts conçoivent le voyage de vos rêves, sur mesure.</p>
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
