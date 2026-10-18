import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPinned, Clock, Users, Compass, CheckCircle2, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Private Tours & Day Trips from Dakar, Senegal | SLAAC Voyages',
  description: 'Explore Senegal with private guides: Gorée Island, Pink Lake (Lac Rose), Bandia Wildlife Safari, and Sine-Saloum Delta. Private air-conditioned transport, licensed local guides, and custom circuits.',
  alternates: {
    canonical: '/en/excursions',
    languages: {
      fr: `${SITE_URL}/excursions`,
      en: `${SITE_URL}/en/excursions`,
      'x-default': `${SITE_URL}/excursions`,
    },
  },
  openGraph: {
    title: 'Private Tours & Excursions from Dakar — SLAAC Voyages',
    description: 'Gorée Island, Lac Rose, Bandia Safari, and Sine-Saloum Delta with private local guides.',
    url: `${SITE_URL}/en/excursions`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const tours = [
  {
    title: 'Gorée Island: UNESCO Heritage & Memory Walk',
    duration: 'Full Day or Half Day (4 – 7 hours)',
    pickup: 'Dakar Hotel or Residence Pickup',
    description: 'Take the scenic ferry across Dakar Bay to Gorée Island. Walk cobblestone colonial alleys, explore the poignant House of Slaves with an official historian guide, visit painter workshops, and enjoy seaside lunch.',
    inclusions: ['Round-trip ferry tickets', 'Official Gorée curator guide', 'Private hotel transfer to Dakar port', 'House of Slaves admission'],
    indicativePrice: 'From 40,000 XOF (~60 EUR / $65 USD) per person',
  },
  {
    title: 'Pink Lake (Lac Rose) & 4x4 Dunes Safari',
    duration: 'Full Day (approx. 6 hours)',
    pickup: 'Dakar or Saly Pickup',
    description: 'Visit the legendary Retba pink lake where local villagers harvest salt by hand. Experience an exhilarating 4x4 ride across the oceanfront sand dunes on the historic trails of the Paris-Dakar Rally.',
    inclusions: ['Private 4x4 vehicle with driver', 'Traditional salt boat crossing', 'Sand dunes ocean track', 'Local seafood lunch option'],
    indicativePrice: 'From 50,000 XOF (~76 EUR / $82 USD) per person',
  },
  {
    title: 'Bandia Wildlife Reserve & Sacred Baobab',
    duration: 'Half Day (approx. 5 hours)',
    pickup: 'Dakar or Saly Pickup',
    description: 'A 3,500-hectare protected acacia sanctuary home to giraffes, rhinos, zebras, antelopes, monkeys, and giant tortoises. Includes a stop at the ancient sacred baobab tree and crocodile marsh.',
    inclusions: ['Open-air 4x4 safari truck with park ranger', 'Entrance conservation fees', 'Air-conditioned transit to reserve', 'Complimentary bottled water'],
    indicativePrice: 'From 55,000 XOF (~84 EUR / $90 USD) per person',
  },
  {
    title: 'Sine-Saloum Delta: Mangrove Pirogue Cruise',
    duration: 'Full Day (approx. 9 – 10 hours)',
    pickup: 'Dakar or Saly Pickup',
    description: 'A UNESCO Biosphere reserve of labyrinthine mangrove waterways. Cruise aboard a shaded motorized pirogue, observe pelicans and herons, discover shellfish gathering, and enjoy a grilled fish lunch on a quiet shell islet.',
    inclusions: ['Private traditional pirogue charter', 'Local boatman and nature guide', 'Full round-trip transit from Dakar/Saly', 'Fresh island lunch'],
    indicativePrice: 'From 70,000 XOF (~106 EUR / $115 USD) per person',
  },
];

export default function EnglishExcursionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <Compass className="h-3.5 w-3.5" /> Curated Senegal Discoveries
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Private Guided Tours & Excursions in Senegal
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience authentic Senegalese culture, wildlife, and history. SLAAC Voyages designs private, flexible day trips and custom itineraries with vetted local guides and comfortable air-conditioned vehicles.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="excursions"
                source="en-excursions-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Book a Private Tour
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20">
                <a href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20would%20like%20information%20about%20tours%20in%20Senegal." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Tour Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Featured Private Day Trips from Dakar
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                All tours include door-to-door hotel transfers, experienced local guides, and entrance admissions.
              </p>
            </div>

            <div className="space-y-8">
              {tours.map((tour, idx) => (
                <Card key={idx} className="border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1 text-slaac-gold-600">
                          <Clock className="h-3.5 w-3.5" /> {tour.duration}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPinned className="h-3.5 w-3.5 text-slate-400" /> {tour.pickup}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{tour.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{tour.description}</p>
                      <div className="pt-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                          What is included:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tour.inclusions.map((inc, iIdx) => (
                            <div key={iIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md inline-block">
                        Indicative rate: {tour.indicativePrice}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col justify-center items-start md:items-end w-full md:w-auto">
                      <QuoteRequestButton
                        variant="gold"
                        size="sm"
                        defaultService="excursions"
                        defaultDestination={tour.title.split(':')[0]}
                        source={`en-tour-${idx}`}
                        className="w-full md:w-auto"
                      >
                        Request This Tour <ArrowRight className="ml-1.5 h-4 w-4" />
                      </QuoteRequestButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Itineraries Banner */}
        <section className="py-16 bg-slate-50 border-t border-slate-200 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-4">
              Looking for a Multi-Day Circuit in Senegal?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mb-8">
              Beyond day trips, SLAAC Voyages organizes multi-day circuits combining Saint-Louis, the Lompoul desert, the Sine-Saloum islands, and southern Casamance with private drivers and boutique lodges.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="excursions"
                source="en-circuits-bottom"
                className="w-full sm:w-auto font-semibold px-8"
              >
                <Send className="mr-2 h-4 w-4" /> Design a Custom Circuit
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/en/contact">Speak with a Tour Designer</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
