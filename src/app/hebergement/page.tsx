import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import OffresGrid from '@/components/sections/offres-grid';
import FaqSection from '@/components/sections/faq-section';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export const metadata = {
  title: 'Hébergement - SLAAC Voyages',
  description: "Hôtels, résidences et appartements à Dakar, Saly, Casamance et à l'international. Trouvez l'hébergement idéal pour votre séjour avec SLAAC Voyages.",
};

const hebergementFaq = [
  {
    question: 'Le petit-déjeuner est-il inclus dans le tarif ?',
    reponse: "L'inclusion du petit-déjeuner dépend de l'hébergement et de la formule réservée. La plupart de nos hôtels partenaires proposent une formule avec petit-déjeuner buffet, clairement indiquée au moment de la réservation. Si vous souhaitez l'ajouter ou le retirer, il suffit de nous le signaler et nous ajustons votre devis en conséquence.",
  },
  {
    question: 'Quelle est la politique d\'annulation ?',
    reponse: "Les conditions d'annulation varient selon l'établissement et la période de séjour. En règle générale, une annulation plus de 7 jours avant l'arrivée est sans frais, tandis qu'une annulation à dernière minute peut engager la première nuit. Nous vous communiquons la politique exacte de chaque hébergement avant confirmation, afin que vous réserviez en toute transparence.",
  },
  {
    question: 'Pouvez-vous réserver pour un groupe ou une délégation ?',
    reponse: "Oui, c'est l'une de nos spécialités. Pour les groupes à partir de 10 personnes, nous négocions des tarifs préférentiels et des conditions sur mesure auprès de nos partenaires hôteliers. Que ce soit pour un séminaire, un pèlerinage, un voyage scolaire ou un événement familial, nous coordonnons les chambres, les repas et les transferts selon vos besoins.",
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    reponse: "Nous acceptons le virement bancaire, les espèces et les paiements mobile money (Orange Money, Wave, Free Money) pour les réservations effectuées au Sénégal. Pour les clients à l'international, nous proposons également le paiement par carte bancaire via un lien sécurisé. Un acompte de 30% confirme généralement la réservation, le solde étant réglé avant le départ.",
  },
];

export default function HebergementPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10" />
          <div className="relative z-20 text-center p-4">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">Hébergement</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Hôtels, résidences et appartements au Sénégal et à l'international.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">Nos Hébergements</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                SLAAC Voyages vous ouvre les portes des plus beaux hébergements du Sénégal et d'ailleurs. Grâce à notre réseau de partenaires hôteliers soigneusement sélectionnés, nous négocions pour vous les meilleurs tarifs dans une gamme allant des établissements économiques aux résidences de luxe. Hôtel en centre-ville, resort bord de mer, riad traditionnel ou appartement en résidence privée : nous trouvons l'hébergement qui correspond à vos attentes et à votre budget.
              </p>
            </div>
            <OffresGrid collectionName="hebergements" emptyMessage="Aucun hébergement disponible pour le moment. Contactez-nous pour une recherche personnalisée." detailBasePath="/hebergement" />
          </div>
        </section>

        <section className="py-16 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Besoin d'un hébergement sur mesure ?</h2>
            <p className="mt-4 text-muted-foreground">
              Notre équipe trouve l'hébergement parfait selon vos critères et votre budget. Et parce que chaque séjour mérite d'être sans souci, nous restons à votre disposition du check-in au check-out.
            </p>
            <div className="mt-6">
              <QuoteRequestDialog>
                <Button size="lg"><Send className="mr-2 h-4 w-4" /> Demander un devis</Button>
              </QuoteRequestDialog>
            </div>
          </div>
        </section>

        <FaqSection
          title="FAQ — Hébergement"
          subtitle="Tout ce qu'il faut savoir avant de réserver votre hébergement."
          items={hebergementFaq}
        />
      </main>
      <Footer />
    </div>
  );
}
