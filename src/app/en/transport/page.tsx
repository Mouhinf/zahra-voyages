import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Clock, ShieldCheck, Plane, CheckCircle2, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'AIBD Airport Transfers & Private Chauffeur in Dakar, Senegal | SLAAC Voyages',
  description: 'Book private airport transfers from Blaise Diagne (AIBD) to Dakar, Diamniadio, and Saly. Modern air-conditioned sedans, VIP SUVs, professional drivers, and flight tracking. Free quote within 24 hours.',
  alternates: {
    canonical: '/en/transport',
    languages: {
      fr: `${SITE_URL}/transport`,
      en: `${SITE_URL}/en/transport`,
      'x-default': `${SITE_URL}/transport`,
    },
  },
  openGraph: {
    title: 'AIBD Airport Transfers & Private Drivers — SLAAC Voyages',
    description: 'Reliable private transfers from Blaise Diagne Airport (AIBD) to Dakar Plateau, Almadies, Saly, and Diamniadio.',
    url: `${SITE_URL}/en/transport`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const transferRoutes = [
  {
    from: 'Blaise Diagne Airport (AIBD)',
    to: 'Dakar City Center / Plateau / Almadies',
    time: '45 – 60 min via tollway',
    description: 'Direct highway transfer to downtown Dakar, business hotels, and residences. Meet & greet inside terminal arrivals with name signage.',
    priceIndicative: 'From 30,000 FCFA / XOF (~45 EUR / $50 USD)',
  },
  {
    from: 'Blaise Diagne Airport (AIBD)',
    to: 'Saly Portudal / Somone / Mbour',
    time: '35 – 45 min',
    description: 'Direct shuttle to the Petite Côte seaside resorts, beach villas, and hotels. Luggage assistance included.',
    priceIndicative: 'From 25,000 FCFA / XOF (~38 EUR / $42 USD)',
  },
  {
    from: 'Blaise Diagne Airport (AIBD)',
    to: 'Diamniadio Hub / Ministerial City',
    time: '15 – 20 min',
    description: 'Rapid connection to the Diamniadio Exhibition Center, ministerial buildings, Dakar Arena, and Olympic stadium.',
    priceIndicative: 'From 20,000 FCFA / XOF (~30 EUR / $33 USD)',
  },
];

const vehicleCategories = [
  {
    name: 'Executive Sedan',
    capacity: '1 – 3 Passengers · 2 Large Bags',
    idealFor: 'Solo business travelers, couples, airport arrivals',
    features: ['Air conditioning', 'Leather seating', 'Complimentary bottled water', 'Tollway fees included'],
  },
  {
    name: 'Premium SUV 4x4',
    capacity: '1 – 4 Passengers · 3 Large Bags',
    idealFor: 'VIP delegations, intercity travel, Lac Rose or safari tours',
    features: ['All-terrain capability', 'Spacious cabin', 'Wi-Fi on request', 'Dedicated bilingual driver'],
  },
  {
    name: 'Minivan / Shuttle',
    capacity: '5 – 8 Passengers · 8 Bags',
    idealFor: 'Families, corporate teams, international event delegations',
    features: ['Extended luggage bay', 'Rear dual climate control', 'Direct group coordination', 'Point-to-point charters'],
  },
];

export default function EnglishTransportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <Car className="h-3.5 w-3.5" /> AIBD Airport Transfers & Private Chauffeurs
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Reliable Airport Transfers & Private Drivers in Dakar
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Arrive in Senegal with complete peace of mind. SLAAC Voyages coordinates licensed private drivers, flight tracking, and modern air-conditioned vehicles from Blaise Diagne International Airport (AIBD) to your destination.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="transport"
                source="en-transport-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Request a Transfer Quote
              </QuoteRequestButton>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20"
              >
                <a
                  href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20would%20like%20to%20book%20an%20airport%20transfer."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Inquire on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Value Pillars */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80">
                <Plane className="h-8 w-8 text-slaac-gold-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">Flight Tracking</h3>
                <p className="text-xs text-slate-500">We monitor your flight status in real time to adjust pickup times in case of delays.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80">
                <ShieldCheck className="h-8 w-8 text-slaac-gold-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">Licensed Drivers</h3>
                <p className="text-xs text-slate-500">Professional, vetted chauffeurs with in-depth local knowledge and passenger insurance.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80">
                <Clock className="h-8 w-8 text-slaac-gold-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">Meet & Greet</h3>
                <p className="text-xs text-slate-500">Your driver waits for you inside the terminal with your name on a personalized board.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200/80">
                <CheckCircle2 className="h-8 w-8 text-slaac-gold-600 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">Tollway Included</h3>
                <p className="text-xs text-slate-500">Direct fast-lane highway toll fees are included in all our transfer quotations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Transfer Routes */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Key Transfer Routes in Senegal
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Direct connections from Blaise Diagne International Airport (AIBD) to the main business and tourism hubs.
              </p>
            </div>

            <div className="space-y-6">
              {transferRoutes.map((route, idx) => (
                <Card key={idx} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slaac-gold-600">
                        <MapPin className="h-4 w-4" /> {route.time}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {route.from} &rarr; {route.to}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {route.description}
                      </p>
                      <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md inline-block">
                        Indicative rate: {route.priceIndicative}
                      </div>
                    </div>
                    <div className="shrink-0 w-full md:w-auto">
                      <QuoteRequestButton
                        variant="gold"
                        size="sm"
                        defaultService="transport"
                        defaultDestination={route.to}
                        source={`en-route-${idx}`}
                        className="w-full md:w-auto"
                      >
                        Book This Route <ArrowRight className="ml-1.5 h-4 w-4" />
                      </QuoteRequestButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fleet Categories */}
        <section className="py-16 bg-slate-50 border-t border-slate-200 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Our Vehicle Fleet
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Modern, rigorously maintained vehicles tailored to business travelers, families, and delegations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vehicleCategories.map((veh, idx) => (
                <Card key={idx} className="border-slate-200 flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">{veh.name}</h3>
                    <p className="text-xs font-semibold text-slaac-gold-600 uppercase tracking-wider">{veh.capacity}</p>
                    <p className="text-sm text-slate-600">{veh.idealFor}</p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {veh.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <QuoteRequestButton
                      variant="outline"
                      size="sm"
                      defaultService="transport"
                      source={`en-fleet-${idx}`}
                      className="w-full"
                    >
                      Request Quote for {veh.name}
                    </QuoteRequestButton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 bg-slaac-navy-900 text-white text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white mb-4">
              Need a Customized Transfer or Daily Driver Charter?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Whether you need a one-way airport pickup, a dedicated vehicle for business meetings in Dakar, or intercity transport across Senegal, our local team is ready to assist.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="transport"
                source="en-transport-bottom"
                className="w-full sm:w-auto font-semibold px-8"
              >
                <Send className="mr-2 h-4 w-4" /> Get Your Free Quote
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20">
                <Link href="/en/contact">
                  Contact Our Dakar Office
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
