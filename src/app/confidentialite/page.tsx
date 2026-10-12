import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: { absolute: 'Politique de confidentialité - SLAAC Voyages' },
  description: "Comment SLAAC Voyages collecte, utilise et protège vos données personnelles : demandes de devis, formulaires, newsletter, statistiques. Vos droits et contacts.",
  alternates: { canonical: '/confidentialite' },
};

const LAST_UPDATE = 'Octobre 2026';

const sections = [
  {
    title: '1. Qui traite vos données ?',
    content: [
      "SLAAC Voyages, agence de voyages basée à Dakar (Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau, Sénégal), est responsable du traitement des données collectées sur ce site.",
    ],
  },
  {
    title: '2. Quelles données collectons-nous ?',
    content: [
      "Demandes de devis : nom, numéro de téléphone, adresse email (facultative), service souhaité, destination, dates et détails de voyage que vous nous communiquez, ainsi que le message éventuel.",
      "Formulaire de contact : nom, email, téléphone (facultatif) et message.",
      "Newsletter : votre adresse email, uniquement si vous vous inscrivez volontairement.",
      "Statistiques de visite : pages consultées, source de la visite (ex. Google) et site référent. Aucun profil publicitaire n'est constitué.",
      "Adresse IP : utilisée uniquement pour la protection anti-abus du site (limitation du nombre de requêtes).",
    ],
  },
  {
    title: '3. Pourquoi ?',
    content: [
      "Répondre à vos demandes de devis et de contact, préparer les offres que vous sollicitez ;",
      "Vous envoyer notre newsletter si vous y avez consenti (désinscription à tout moment) ;",
      "Assurer la sécurité du site et prévenir les abus ;",
      "Mesurer de façon anonyme l'audience du site pour l'améliorer.",
      "Nous ne vendons pas vos données et ne les cédons pas à des tiers à des fins publicitaires.",
    ],
  },
  {
    title: '4. Combien de temps ?',
    content: [
      "Les demandes de devis et messages de contact sont conservés le temps nécessaire au traitement commercial de votre dossier, puis archivés ou supprimés selon nos obligations comptables et administratives. Les inscriptions newsletter sont conservées jusqu'à votre désinscription. Vous pouvez demander la suppression de vos données à tout moment (voir §6).",
    ],
  },
  {
    title: '5. Services tiers',
    content: [
      "Le site s'appuie sur des prestataires techniques : hébergement Vercel, base de données Firebase (Google), hébergement d'images Cloudinary, carte Google Maps intégrée. Ces services peuvent être hébergés hors du Sénégal ; leurs traitements sont encadrés par leurs propres politiques de confidentialité. Aucune donnée de navigation n'est vendue à des régies publicitaires.",
    ],
  },
  {
    title: '6. Vos droits',
    content: [
      "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données, ainsi que d'un droit d'opposition à la prospection. Pour l'exercer, écrivez à mdslaacvoyages@gmail.com ou contactez-nous par WhatsApp au +221 77 312 90 90. Nous répondons dans un délai raisonnable, au maximum 30 jours.",
      "Les visiteurs résidant dans l'Union européenne bénéficient également des droits prévus par le RGPD ; les résidents du Sénégal de ceux prévus par la loi n° 2008-12 sur la protection des données à caractère personnel (CDP Sénégal).",
    ],
  },
  {
    title: '7. Cookies',
    content: [
      "Le site n'utilise pas de cookies publicitaires ni de traceurs tiers de mesure d'audience. L'espace d'administration repose sur l'authentification Firebase (session technique). La carte Google Maps et les images Cloudinary sont chargées depuis les serveurs de ces prestataires lorsque vous consultez les pages concernées.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-16 sm:py-20 bg-secondary">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">Politique de confidentialité</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground">Dernière mise à jour : {LAST_UPDATE}</p>
          </div>
        </section>
        <section className="py-12 sm:py-16 bg-background">
          <div className="container mx-auto max-w-3xl px-4 space-y-8">
            {sections.map((s) => (
              <Card key={s.title} className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-3">{s.title}</h2>
                  <div className="space-y-3">
                    {s.content.map((p, i) => (
                      <p key={i} className="text-muted-foreground leading-relaxed text-sm">{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
