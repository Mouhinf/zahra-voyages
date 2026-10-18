import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Plane, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Travel Destinations in Senegal & Worldwide | SLAAC Voyages Dakar',
  description: 'Explore top destinations in Senegal (Dakar, Gorée Island, Saly, Saint-Louis, Casamance) and worldwide flight packages (Dubai, Morocco, France, Turkey, Saudi Arabia).',
  alternates: {
    canonical: '/en/destinations',
    languages: {
      fr: `${SITE_URL}/destinations`,
      en: `${SITE_URL}/en/destinations`,
      'x-default': `${SITE_URL}/destinations`,
    },
  },
  openGraph: {
    title: 'Top Travel Destinations — SLAAC Voyages Dakar',
    description: 'Curated travel packages and destinations in Senegal and around the world.',
    url: `${SITE_URL}/en/destinations`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const senegalDestinations = [
  {
    name: 'Dakar & Gorée Island',
    subtitle: 'Vibrant Capital & UNESCO World Heritage',
    description: 'Corniche ocean drives, African Renaissance Monument, bustling markets of Sandaga, and the historical memory of Gorée Island.',
    tag: 'Cultural & City Breaks',
  },
  {
    name: 'Saly & La Petite Côte',
    subtitle: 'Golden Beaches & Seaside Resorts',
    description: 'Relaxing beachside stays, private villas, deep-sea fishing, and golf resorts only 45 minutes from AIBD airport.',
    tag: 'Beach & Relaxation',
  },
  {
    name: 'Saint-Louis & The North',
    subtitle: 'Colonial Architecture & Djoudj Bird Sanctuary',
    description: 'The historic colonial capital on the Senegal River, world-famous Jazz festival, and the third-largest bird sanctuary on Earth.',
    tag: 'History & Nature',
  },
  {
    name: 'Sine-Saloum Delta',
    subtitle: 'UNESCO Biosphere & Serer Culture',
    description: 'Labyrinthine mangrove channels, shell islands, traditional pirogue cruises, and peaceful eco-lodges.',
    tag: 'Ecotourism',
  },
  {
    name: 'Cap Skirring & Casamance',
    subtitle: 'Lush Forests & Endless White Sands',
    description: 'Southern Senegal’s jewel with tropical vegetation, Diola kingdom traditions, and some of West Africa’s most pristine beaches.',
    tag: 'Adventure & Tropical',
  },
];

const internationalDestinations = [
  {
    name: 'Dubai & UAE',
    description: 'Luxury shopping, futuristic architecture, desert safaris, and streamlined tourist visa processing from Dakar.',
  },
  {
    name: 'Morocco (Marrakech, Casablanca)',
    description: 'Imperial medinas, Atlas mountains, direct flights from AIBD, and rich cultural ties with Senegal.',
  },
  {
    name: 'Paris & Europe (Schengen)',
    description: 'Business travel, family reunions, university studies, and tourism with full visa file assistance.',
  },
  {
    name: 'Saudi Arabia (Mecca & Medina)',
    description: 'Year-round tailored Umrah pilgrimage packages with direct flights, certified local guides, and 5-star hotels facing the holy mosques.',
  },
];

export default function EnglishDestinationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <MapPin className="h-3.5 w-3.5" /> Destination Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Explore Senegal & Top Global Destinations
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Whether you are discovering Senegal for the first time or flying outbound from Dakar across Africa, Europe, the Middle East, or Asia, SLAAC Voyages designs your journey with precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                source="en-destinations-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Request Destination Quote
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20">
                <a href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20would%20like%20information%20about%20destinations." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Senegal Destinations */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Must-Visit Destinations in Senegal
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Discover the extraordinary diversity of the Teranga country, from Atlantic shores to historic colonial towns and mangrove deltas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {senegalDestinations.map((dest, idx) => (
                <Card key={idx} className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <CardContent className="p-6 space-y-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slaac-gold-600 bg-slaac-gold-50 px-2.5 py-1 rounded-md inline-block">
                      {dest.tag}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{dest.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{dest.subtitle}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{dest.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <QuoteRequestButton
                      variant="outline"
                      size="sm"
                      defaultDestination={dest.name}
                      source={`en-dest-${idx}`}
                      className="w-full"
                    >
                      Plan Trip to {dest.name.split('&')[0].trim()}
                    </QuoteRequestButton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* International Outbound Destinations */}
        <section className="py-16 bg-slate-50 border-t border-slate-200 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Outbound International Flights & Packages
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Departing from Dakar Blaise Diagne (AIBD) to the world's most sought-after business and leisure hubs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internationalDestinations.map((dest, idx) => (
                <Card key={idx} className="border-slate-200">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                      <Plane className="h-5 w-5 text-slaac-gold-600" />
                      <span>{dest.name}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{dest.description}</p>
                    <div className="pt-3">
                      <QuoteRequestButton
                        variant="gold"
                        size="sm"
                        defaultDestination={dest.name.split('(')[0].trim()}
                        source={`en-intl-dest-${idx}`}
                      >
                        Request Fares & Dates <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </QuoteRequestButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
