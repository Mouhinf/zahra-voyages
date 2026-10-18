import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Compass,
  Building,
  Plane,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Send,
  MessageCircle,
  AlertCircle,
  FileCheck2,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Omra depuis le Sénégal : Organisation & Accompagnement | SLAAC Voyages',
  description: "Préparez votre pèlerinage Omra au départ de Dakar avec SLAAC Voyages. Vols réguliers, hôtels vérifiés à Médine et La Mecque, assistance administrative Nusuk.",
  alternates: {
    canonical: '/omra',
  },
  openGraph: {
    title: 'Omra depuis le Sénégal : Organisation & Accompagnement | SLAAC Voyages',
    description: "Séjours Omra au départ de Dakar : vols réguliers, hébergements proches du Haram, transferts et conseils personnalisés par SLAAC Voyages.",
    url: '/omra',
    type: 'website',
  },
};

const pillars = [
  {
    icon: Plane,
    title: 'Vols réguliers au départ de Dakar AIBD',
    description: "Liaisons aériennes sécurisées vers Médine ou Djeddah avec les grandes compagnies régulières (Emirates, Turkish Airlines, Ethiopian Airlines, Royal Air Maroc, Saudia). Horaires optimisés pour limiter la fatigue des pèlerins.",
  },
  {
    icon: Building,
    title: 'Hôtels vérifiés proches des lieux saints',
    description: "Sélection d'établissements hôteliers rigoureusement inspectés à Médine (à quelques pas de la mosquée du Prophète) et à La Mecque (proximité immédiate du Sanctuaire sacré Al-Masjid al-Haram).",
  },
  {
    icon: Compass,
    title: 'Transferts et mobilité sur place',
    description: "Accueil à l'aéroport d'arrivée, prise en charge des bagages et transferts interurbains en autocars grand tourisme climatisés ou via le train à grande vitesse Haramain reliant Médine et La Mecque.",
  },
  {
    icon: HeartHandshake,
    title: 'Conseil et assistance aux formalités',
    description: "Aide à la constitution de votre dossier, vérification des conditions consulaires et accompagnement pour l'utilisation de l'application officielle Nusuk conformément aux instructions saoudiennes.",
  },
];

const steps = [
  {
    step: '01',
    title: 'Étude de vos souhaits & dates',
    description: "Indiquez-nous la période souhaitée, la durée de votre séjour (généralement 10 à 15 jours) et le type de chambre (individuelle, double, triple ou quadruple).",
  },
  {
    step: '02',
    title: 'Proposition sur mesure sous 24h',
    description: "Nous établissons un devis détaillé intégrant le plan de vol certifié, le nom exact des hôtels et le récapitulatif des prestations incluses sans coûts masqués.",
  },
  {
    step: '03',
    title: 'Vérification des pièces administratives',
    description: "Contrôle de la validité de votre passeport (minimum 6 mois) et mise en conformité des attestations sanitaires requises par les autorités saoudiennes.",
  },
  {
    step: '04',
    title: 'Départ serein & suivi de voyage',
    description: "Remise de votre carnet de voyage complet, confirmation des transferts et ligne d'assistance dédiée joignable pendant toute la durée de votre pèlerinage.",
  },
];

const omraFaq = [
  {
    question: "SLAAC Voyages garantit-elle l'obtention du visa pour la Omra ?",
    answer: "Non. Conformément aux principes de transparence et à la législation internationale, l'octroi d'un visa relève de la compétence souveraine exclusive des autorités consulaires du Royaume d'Arabie Saoudite. SLAAC Voyages vous assiste avec rigueur dans la préparation administrative, la vérification des pièces et l'ensemble des réservations indispensables.",
  },
  {
    question: "Quelle est la distance entre les hôtels et le Haram à La Mecque ?",
    answer: "Nous sélectionnons en priorité des hôtels situés à distance de marche raisonnable du parvis d'Al-Masjid al-Haram ou assurant un service de navette régulière 24h/24 lorsque l'établissement est plus en retrait, afin de préserver l'énergie des fidèles.",
  },
  {
    question: "Proposez-vous des forfaits pour le mois de Ramadan ?",
    answer: "Oui, des programmes spécifiques sont élaborés pour le début, le milieu ou les dix dernières nuits du mois béni de Ramadan. Compte tenu de la forte demande internationale, nous vous recommandons de réserver au moins 3 à 4 mois à l'avance.",
  },
  {
    question: "Quels sont les moyens de paiement acceptés pour confirmer un séjour Omra ?",
    answer: "Nous acceptons les règlements par virement bancaire, chèque certifié, espèces directement à notre agence de Dakar Plateau, ainsi que les paiements sécurisés par carte bancaire et mobile money (Wave, Orange Money).",
  },
];

export default function OmraPage() {
  const omraSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/omra#service`,
    name: 'Organisation et accompagnement pèlerinage Omra depuis le Sénégal',
    serviceType: 'ReligiousTravel',
    provider: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
      telephone: '+221773129090',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
        addressLocality: 'Dakar Plateau',
        addressCountry: 'SN',
      },
    },
    areaServed: {
      '@type': 'Country',
      name: 'Sénégal',
    },
    description: "Organisation de voyages spirituels pour la Omra au départ de Dakar : billetterie aérienne, hébergements à Médine et La Mecque, transferts locaux et conseil.",
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Schéma JSON-LD Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(omraSchema) }}
        />

        {/* Hero Section */}
        <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center text-white overflow-hidden bg-slate-950">
          <Image
            src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1600&fit=crop"
            alt="Pèlerinage Omra — La Mecque"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
          
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
            <Breadcrumbs
              items={[{ label: 'Omra depuis le Sénégal', href: '/omra' }]}
              className="justify-center text-slate-300 mb-6"
            />

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-slaac-gold-500/20 text-slaac-gold-400 border border-slaac-gold-500/30 mb-6 backdrop-blur-sm">
              <Compass className="w-3.5 h-3.5" /> Séjours Spirituels & Pèlerinages
            </span>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight font-headline text-white mb-6">
              Votre Omra depuis le Sénégal, dans la sérénité et le respect
            </h1>

            <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed text-balance mb-8">
              SLAAC Voyages organise votre pèlerinage avec rigueur : vols réguliers depuis Dakar AIBD, hébergements sélectionnés proches des mosquées saintes et accompagnement administratif transparent.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="tourisme-affaires"
                defaultDestination="Omra - Arabie Saoudite"
                source="omra-hero"
              >
                <Send className="w-5 h-5 mr-2" /> Demander un devis Omra
              </QuoteRequestButton>

              <a
                href="https://wa.me/221773129090?text=Bonjour%2C%20je%20souhaite%20des%20renseignements%20pour%20une%20Omra%20depuis%20le%20S%C3%A9n%C3%A9gal."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <MessageCircle className="w-5 h-5 mr-2 text-emerald-400" /> Échanger sur WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Encadré Déontologique et Légal Strict */}
        <section className="bg-amber-50/80 border-b border-amber-200/80 py-4">
          <div className="container mx-auto max-w-5xl px-4 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              <strong>Engagement de transparence :</strong> SLAAC Voyages est une agence de voyages immatriculée à Dakar. L'attribution des visas pour le Royaume d'Arabie Saoudite demeure la prérogative souveraine des autorités consulaires et du Ministère saoudien du Hajj et de la Omra. Nous ne garantissons aucun visa automatique et nous conformons strictement aux protocoles officiels de la plateforme Nusuk.
            </p>
          </div>
        </section>

        {/* Les 4 Piliers d'Accompagnement */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 font-headline mb-4">
                Les piliers d'un pèlerinage réussi
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Accomplir sa Omra exige une logistique sans faille pour se consacrer pleinement au recueillement spirituel. Voici nos engagements opérationnels :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-slaac-gold-400 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slaac-gold-100 text-slaac-gold-700 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-headline">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Démarche en 4 Étapes */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-widest text-slaac-gold-400 font-semibold mb-2 block">
                Organisation Rigoureuse
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-white mb-4">
                Comment préparons-nous votre voyage ?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                De votre premier contact à Dakar Plateau jusqu’à votre retour d’Arabie Saoudite, notre équipe suit un protocole méthodique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((st, sIdx) => (
                <div key={sIdx} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-extrabold font-headline text-slaac-gold-400 block mb-4">
                      {st.step}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {st.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="tourisme-affaires"
                defaultDestination="Omra - Arabie Saoudite"
                source="omra-steps"
              >
                <Send className="w-4 h-4 mr-2" /> Démarrer mon projet Omra
              </QuoteRequestButton>
            </div>
          </div>
        </section>

        {/* Lien vers le Guide Pratique */}
        <section className="py-12 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-4xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <Badge variant="gold" className="mb-2">Guide Pratique Recommandé</Badge>
              <h3 className="text-xl font-bold text-slate-900 font-headline">
                Préparer son pèlerinage Omra depuis le Sénégal
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Consultez notre dossier complet sur les formalités Nusuk, le passeport, les vaccins obligatoires et la logistique Médine/La Mecque.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-slate-300 hover:border-slaac-gold-500">
              <Link href="/guides/preparer-omra-depuis-le-senegal">
                Lire le guide officiel &rarr;
              </Link>
            </Button>
          </div>
        </section>

        {/* Foire Aux Questions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline mb-3">
                Questions fréquentes sur l'Omra
              </h2>
              <p className="text-slate-500 text-sm">
                Retrouvez les réponses aux interrogations les plus fréquentes formulées par les pèlerins sénégalais.
              </p>
            </div>

            <div className="space-y-4">
              {omraFaq.map((faq, fIdx) => (
                <Card key={fIdx} className="border-slate-200">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Prise de Contact Finale */}
        <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline mb-4 text-white">
              Besoin d'un échange personnalisé avec notre référent Omra ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Venez nous rencontrer à notre agence de Dakar Plateau ou contactez-nous par téléphone pour étudier vos dates et vos préférences d'hébergement.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" variant="gold">
                <Link href="/contact">
                  <MapPin className="w-4 h-4 mr-2" /> Visiter notre agence à Dakar Plateau
                </Link>
              </Button>
              <a href="tel:+221773129090">
                <Button size="lg" variant="outline" className="border-slate-700 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Phone className="w-4 h-4 mr-2" /> +221 77 312 90 90
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
