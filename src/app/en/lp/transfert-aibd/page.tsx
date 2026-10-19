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
  title: 'Dakar AIBD Airport Transfer — Private Chauffeur & VIP Shuttle | SLAAC Voyages',
  description: 'Book private airport transfers from Blaise Diagne International Airport (AIBD / DSS) to Dakar, Diamniadio, or Saly. Personalized name sign meet & greet, live flight tracking, all-inclusive tollway fares from 30,000 FCFA (~45 €).',
  alternates: {
    canonical: '/en/lp/transfert-aibd',
    languages: {
      fr: '/lp/transfert-aibd',
      en: '/en/lp/transfert-aibd',
      'x-default': '/lp/transfert-aibd',
    },
  },
  openGraph: {
    title: 'Dakar AIBD Airport Transfer — Private Chauffeur & VIP Shuttle',
    description: 'Personalized meet & greet at Blaise Diagne Airport. Professional drivers, flight tracking and all-inclusive fixed rates.',
    url: '/en/lp/transfert-aibd',
    type: 'website',
  },
};

const pricingTableEn = [
  {
    destination: 'Dakar Plateau / Downtown',
    time: '45 - 55 min',
    priceFcfa: '30,000 FCFA',
    priceEur: '~45 €',
    popular: true,
  },
  {
    destination: 'Almadies / Ngor / Yoff / Mamelles',
    time: '50 - 65 min',
    priceFcfa: '35,000 FCFA',
    priceEur: '~53 €',
    popular: false,
  },
  {
    destination: 'Diamniadio / Ministerial Hub',
    time: '20 - 30 min',
    priceFcfa: '25,000 FCFA',
    priceEur: '~38 €',
    popular: false,
  },
  {
    destination: 'Saly Portudal / Somone / Mbour',
    time: '35 - 45 min',
    priceFcfa: '30,000 FCFA',
    priceEur: '~45 €',
    popular: true,
  },
];

const faqsEn = [
  {
    question: "Where and how does the driver meet me upon landing at AIBD?",
    answer: "Your private chauffeur waits for you directly outside the customs baggage reclaim area with a personalized sign displaying your name or company logo.",
  },
  {
    question: "What happens if my incoming flight is delayed?",
    answer: "We track your flight in real time (Delta, Air France, Brussels Airlines, Turkish Airlines, Royal Air Maroc, Emirates, etc.). Pickup times automatically adjust with zero penalty fees.",
  },
  {
    question: "Are highway toll fees and luggage handling included?",
    answer: "Yes. All our rates are 100% all-inclusive: tollway fees (Autoroute de l'Avenir), luggage assistance, air conditioning, and professional transport insurance.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "You can pay via bank wire, Wave, Orange Money, or cash (FCFA or Euros) upon arrival. Official VAT invoices available for corporate accounts.",
  },
];

export default function LandingEnglishTransfertAibdPage() {
  const whatsappUrl = `https://wa.me/221773129090?text=${encodeURIComponent(
    'Hello SLAAC Voyages, I would like to book a private transfer from AIBD Airport.'
  )}`;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsEn.map((f) => ({
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
    name: 'Dakar AIBD Airport Transfer & Chauffeur',
    serviceType: 'Airport Transfer & Private Chauffeur',
    provider: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
      telephone: '+221773129090',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3rd Floor',
        addressLocality: 'Dakar',
        addressCountry: 'SN',
      },
    },
    areaServed: 'Dakar, Diamniadio, Saly Portudal, Senegal',
    description: 'Private VIP airport transfer service between Blaise Diagne (AIBD) and Dakar.',
    offers: {
      '@type': 'Offer',
      price: '35000',
      priceCurrency: 'XOF',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/en/lp/transfert-aibd`,
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

        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 md:py-24 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient opacity-35 pointer-events-none" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/en' },
                { label: 'VIP AIBD Airport Transfer', href: '/en/lp/transfert-aibd' },
              ]}
              className="text-slate-300 mb-6"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slaac-gold-500/20 text-slaac-gold-400 border border-slaac-gold-500/30">
                  <Plane className="w-3.5 h-3.5" /> 24/7 AIBD Airport Transfers
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-headline text-white leading-tight">
                  Smooth &amp; Reliable Arrival in Dakar
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
                  Skip the airport hassle, currency negotiations, and queues. Your professional chauffeur greets you inside the arrivals hall with a name sign, tracks your flight live, and drives you safely at guaranteed fixed rates.
                </p>

                {/* 4 Pillars of Reassurance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personalized meet &amp; greet in arrivals hall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time flight tracking (no delay fees)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Toll fees and luggage handling included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Air-conditioned executive fleet with Wi-Fi</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <QuoteRequestButton
                    variant="gold"
                    size="lg"
                    locale="en"
                    defaultService="transport"
                    defaultDestination="AIBD Airport -> Dakar"
                    source="en-lp-transfert-hero"
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" /> Book my private transfer
                  </QuoteRequestButton>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="whatsapp" size="lg" className="w-full sm:w-auto">
                      <MessageCircle className="w-4 h-4 mr-2 fill-current" /> WhatsApp Direct (+221 77 312 90 90)
                    </Button>
                  </a>
                </div>
              </div>

              {/* VIP Visual */}
              <div className="lg:col-span-5">
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-700/60 bg-slate-800">
                  <Image
                    src="https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1784504518/hero-section-transport.jpg"
                    alt="Private chauffeur airport transfer Blaise Diagne Dakar"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-xs text-slate-300">
                    <span className="font-bold text-white block mb-0.5">VIP Sedans &amp; Air-conditioned Vans</span>
                    Direct pickup upon exit from the Blaise Diagne terminal (Diass).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section className="py-14 sm:py-20 bg-slate-50">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="gold" className="text-xs mb-2">Clear &amp; Transparent</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                Fixed All-Inclusive AIBD Fares
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                No hidden luggage fees or waiting surcharges. The agreed rate is the final rate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingTableEn.map((item, idx) => (
                <Card
                  key={idx}
                  className={`flex flex-col justify-between border-slate-200 bg-white hover:shadow-lg transition-all ${
                    item.popular ? 'ring-2 ring-slaac-gold-400 shadow-md' : ''
                  }`}
                >
                  <CardHeader className="p-5 pb-3">
                    {item.popular && (
                      <Badge variant="gold" className="w-fit text-[10px] mb-2">Most Popular</Badge>
                    )}
                    <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                      {item.destination}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock className="w-3.5 h-3.5" /> Transit: {item.time}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="border-t border-slate-100 pt-3">
                      <div className="text-2xl font-bold text-slate-900">{item.priceFcfa}</div>
                      <div className="text-xs text-slate-500">{item.priceEur} (tolls included)</div>
                    </div>

                    <QuoteRequestButton
                      variant={item.popular ? 'gold' : 'outline'}
                      size="sm"
                      locale="en"
                      defaultService="transport"
                      defaultDestination={`AIBD -> ${item.destination}`}
                      source={`en-lp-pricing-${idx}`}
                      className="w-full justify-center text-xs"
                    >
                      Book this route
                    </QuoteRequestButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 3 Simple Steps */}
        <section className="py-14 sm:py-20 bg-white border-t border-slate-200/80">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                How Your Pickup Works
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                A seamless arrival process trusted by international visitors and corporate delegations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Book &amp; Share Flight Details</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Provide your flight number and landing date. We confirm your chauffeur and monitor your flight schedule in real time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-base">VIP Meet &amp; Greet</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Your chauffeur awaits you in the arrivals hall holding a sign with your name. They assist you with your luggage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="w-10 h-10 rounded-full bg-slaac-gold-500 text-white font-bold flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-base">Comfortable Highway Transit</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Direct highway transit via the tollway to your hotel or serviced apartment. Air-conditioned vehicle, bottled water, and maximum safety.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Practical FAQ */}
        <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex items-center gap-2 mb-8 justify-center">
              <HelpCircle className="w-6 h-6 text-slaac-gold-600" />
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
                Frequently Asked Questions — AIBD Airport Transfers
              </h2>
            </div>

            <div className="space-y-4">
              {faqsEn.map((faq, fIdx) => (
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

            {/* Final Call to Action */}
            <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl text-center space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold font-headline">
                Need an urgent airport pickup or group shuttle?
              </h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Our Dakar ground transport team is available 7/7 by phone at{' '}
                <a href={`tel:${CONTACT.phoneIntl}`} className="font-semibold text-white underline">
                  {CONTACT.phone}
                </a>{' '}
                or via WhatsApp messaging.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <QuoteRequestButton
                  variant="gold"
                  size="lg"
                  locale="en"
                  defaultService="transport"
                  defaultDestination="AIBD Airport Dakar"
                  source="en-lp-bottom-cta"
                >
                  <Send className="w-4 h-4 mr-2" /> Request booking online
                </QuoteRequestButton>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" size="lg">
                    <MessageCircle className="w-4 h-4 mr-2 fill-current" /> Chat on WhatsApp
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
