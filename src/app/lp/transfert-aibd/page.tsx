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
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Plane,
  CreditCard,
  MapPin,
  Send,
  HelpCircle,
} from 'lucide-react';
import { SITE_URL, CONTACT } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Transfert Aéroport AIBD Dakar — Chauffeur Privé & Navette VIP | SLAAC Voyages',
  description: 'Réservez votre transfert privé depuis l’Aéroport International Blaise Diagne (AIBD) vers Dakar, Diamniadio ou Saly. Accueil nominatif en zone arrivées, suivi de vol en direct et tarif fixe tout compris dès 35 000 FCFA.',
  alternates: {
    canonical: '/lp/transfert-aibd',
    languages: {
      fr: '/lp/transfert-aibd',
      en: '/en/lp/transfert-aibd',
      'x-default': '/lp/transfert-aibd',
    },
  },
  openGraph: {
    title: 'Transfert Aéroport International Blaise Diagne (AIBD) Dakar — Chauffeur Privé & Navette VIP',
    description: 'Accueil personnalisé à l’Aéroport International Blaise Diagne. Chauffeurs professionnels, suivi de vol et tarifs fixes sans mauvaise surprise.',
    url: '/lp/transfert-aibd',
    type: 'website',
  },
};

const pricingTable = [
  {
    destination: 'Dakar Plateau / Centre-Ville',
    time: '45 - 55 min',
    priceFcfa: '35 000 FCFA',
    priceEur: '~53 €',
    popular: true,
  },
  {
    destination: 'Almadies / Ngor / Yoff / Mamelles',
    time: '50 - 65 min',
    priceFcfa: '35 000 FCFA',
    priceEur: '~53 €',
    popular: false,
  },
  {
    destination: 'Diamniadio / Pôle Ministériel',
    time: '20 - 30 min',
    priceFcfa: '25 000 FCFA',
    priceEur: '~38 €',
    popular: false,
  },
  {
    destination: 'Saly Portudal / Somone / Mbour',
    time: '35 - 45 min',
    priceFcfa: '30 000 FCFA',
    priceEur: '~45 €',
    popular: true,
  },
];

const faqs = [
  {
    question: "Où et comment le chauffeur m'attend-il à l'aéroport AIBD ?",
    answer: "Votre chauffeur privé vous attend directement à la sortie de la zone sous douane (après la récupération de vos bagages) avec un panneau nominatif à votre nom ou au logo de votre entreprise.",
  },
  {
    question: "Que se passe-t-il si mon vol a du retard ?",
    answer: "Nous suivons votre vol en temps réel (Air France, Brussels Airlines, Delta, Turkish Airlines, Royal Air Maroc, Emirates, etc.). L'horaire de prise en charge est ajusté automatiquement sans aucun supplément ni pénalité d'attente.",
  },
  {
    question: "Les frais de péage autoroutier sont-ils inclus dans le tarif ?",
    answer: "Oui. Nos tarifs sont 100% tout compris : péage de l'Autoroute de l'Avenir, prise en charge des bagages, climatisation et assurance transport professionnelle.",
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Vous pouvez régler par virement bancaire, Wave, Orange Money ou en espèces (FCFA ou Euros) lors de la prise en charge. Facture avec TVA déductible disponible pour les entreprises.",
  },
];

export default function LandingTransfertAibdPage() {
  const whatsappUrl = `https://wa.me/221773129090?text=${encodeURIComponent(
    'Bonjour SLAAC Voyages, je souhaite réserver un transfert depuis l aéroport AIBD.'
  )}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Transfert Aéroport International Blaise Diagne (AIBD) Dakar',
    serviceType: 'Transfert Aéroport & Chauffeur Privé',
    provider: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
      telephone: '+221773129090',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
        addressLocality: 'Dakar',
        addressCountry: 'SN',
      },
    },
    areaServed: 'Dakar, Diamniadio, Saly Portudal, Senegal',
    description: 'Service de transfert aéroport privé et VIP entre l’Aéroport International Blaise Diagne (AIBD) et Dakar.',
    offers: {
      '@type': 'Offer',
      price: '35000',
      priceCurrency: 'XOF',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/lp/transfert-aibd`,
    },
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />

        {/* Hero Section Haute Conversion */}
        <section className="relative bg-slate-900 text-white py-16 md:py-24 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient opacity-35 pointer-events-none" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Transfert AIBD VIP', href: '/lp/transfert-aibd' },
              ]}
              className="text-slate-300 mb-6"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slaac-gold-500/20 text-slaac-gold-400 border border-slaac-gold-500/30">
                  <Plane className="w-3.5 h-3.5" /> Transferts AIBD 7j/7 & 24h/24
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-headline text-white leading-tight">
                  Votre Arrivée à Dakar en Toute Sérénité
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
                  Évitez les négociations d’arrivée et les files d’attente. Votre chauffeur professionnel vous accueille avec un panneau nominatif, assure le suivi de votre vol en temps réel et vous conduit à destination à tarif fixe garanti.
                </p>

                {/* 4 Piliers de Réassurance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Accueil nominatif en hall arrivées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suivi de vol en direct (zéro frais retard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Péages et bagages 100% inclus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Véhicules récents climatisés avec Wi-Fi</span>
                  </div>
                </div>

                {/* Boutons d'Action Directe */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {/* Modal de réservation de devis (QuoteRequestDialog via QuoteRequestButton) */}
                  <QuoteRequestButton
                    variant="gold"
                    size="lg"
                    defaultService="transport"
                    defaultDestination="Aéroport AIBD -> Dakar"
                    source="lp-transfert-hero"
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" /> Réserver mon transfert
                  </QuoteRequestButton>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp_click"
                    className="w-full sm:w-auto whatsapp_click"
                  >
                    <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                      <MessageCircle className="w-4 h-4 mr-2 fill-current" /> WhatsApp Direct (+221 77 312 90 90)
                    </Button>
                  </a>
                </div>

              </div>

              {/* Visuel d'Accompagnement VIP */}
              <div className="lg:col-span-5">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/60 bg-slate-800">
                  <Image
                    src="https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg"
                    alt="Chauffeur privé transfert aéroport Blaise Diagne Dakar"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300">
                    <span className="font-bold text-white block mb-0.5">Berlines VIP & Minibus climatisés</span>
                    Prise en charge dès la sortie du terminal Blaise Diagne (Diass).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grille Tarifaire Fixe et Transparente */}
        <section className="py-14 sm:py-20 bg-slate-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="gold" className="text-xs mb-2">Transparence Absolue</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                Tarifs Fixes AIBD Tout Compris
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Aucun supplément bagages ni frais d’attente. Le prix convenu est le prix payé.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTable.map((item, idx) => (
                <Card
                  key={idx}
                  className={`flex flex-col justify-between border-slate-200 bg-white hover:shadow-lg transition-all ${
                    item.popular ? 'ring-2 ring-slaac-gold-400 shadow-md' : ''
                  }`}
                >
                  <CardHeader className="p-5 pb-3">
                    {item.popular && (
                      <Badge variant="gold" className="w-fit text-[10px] mb-2">Le plus demandé</Badge>
                    )}
                    <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                      {item.destination}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5" /> Trajet : {item.time}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-2xl font-bold text-slate-900">{item.priceFcfa}</div>
                      <div className="text-xs text-slate-500">{item.priceEur} (péages inclus)</div>
                    </div>

                    <QuoteRequestButton
                      variant={item.popular ? 'gold' : 'outline'}
                      size="sm"
                      defaultService="transport"
                      defaultDestination={`AIBD -> ${item.destination}`}
                      source={`lp-pricing-${idx}`}
                      className="w-full justify-center text-xs"
                    >
                      Réserver ce trajet
                    </QuoteRequestButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comment ça marche : 3 étapes simples */}
        <section className="py-14 sm:py-20 bg-white border-t border-slate-200/80">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                Comment se déroule votre prise en charge ?
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Un processus éprouvé auprès de plus de 2 500 voyageurs et délégations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Réservation & Suivi de Vol</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Vous indiquez votre numéro de vol et date d’arrivée. Nous confirmons instantanément votre réservation et surveillons votre vol.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">Accueil Personnalisé</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Votre chauffeur vous attend dès la sortie sous douane avec votre nom sur panneau. Il vous aide pour le port de vos bagages.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Trajet Sécurisé & Confortable</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Trajet direct via l’autoroute à péage vers votre hôtel ou résidence. Climatisation, bouteilles d’eau et sécurité maximale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Pratique */}
        <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <HelpCircle className="w-6 h-6 text-slaac-gold-600" />
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                Questions Fréquentes — Transfert AIBD
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, fIdx) => (
                <Card key={fIdx} className="border-slate-200 bg-white">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-start gap-2">
                      <span className="text-slaac-gold-600 font-headline">Q.</span>
                      <span>{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-1 text-slate-600 text-sm leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bannière Finale d'Appel à l'Action */}
            <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold font-headline">
                Besoin d'un transfert urgent ou d'un devis pour un groupe ?
              </h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Nos coordinateurs transport à Dakar Plateau sont joignables 7j/7 au{' '}
                <a href={`tel:${CONTACT.phoneIntl}`} className="font-semibold text-white underline">
                  {CONTACT.phone}
                </a>{' '}
                ou en messagerie instantanée WhatsApp.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <QuoteRequestButton
                  variant="gold"
                  size="lg"
                  defaultService="transport"
                  defaultDestination="AIBD Aéroport Dakar"
                  source="lp-bottom-cta"
                >
                  <Send className="w-4 h-4 mr-2" /> Demander une réservation en ligne
                </QuoteRequestButton>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2 fill-current" /> Contacter sur WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
