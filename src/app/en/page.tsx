import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Plane, BedDouble, Car, MapPinned, FileCheck2, Briefcase, Send, MessageCircle, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Travel Agency in Dakar, Senegal — Flights, Visa Assistance, Tours | SLAAC Voyages' },
  description: 'SLAAC Voyages is a Dakar-based travel agency: international flight tickets, visa assistance, hotel booking, AIBD airport transfers, private tours (Gorée, Lac Rose, Saly) and business travel. Free quote within 24 h.',
  alternates: {
    canonical: '/en',
    languages: {
      fr: '/',
      en: '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'SLAAC Voyages — Travel Agency in Dakar, Senegal',
    description: 'Flights, visa assistance, airport transfers, private tours and business travel across Senegal. Free quote within 24 h.',
    locale: 'en_US',
  },
};

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png';

const services = [
  {
    icon: Plane,
    title: 'Flight tickets',
    description: 'International and regional flights from Dakar (AIBD) and Blaise-Diagne connections — best available fares, economy to business class.',
  },
  {
    icon: FileCheck2,
    title: 'Visa & travel assistance',
    description: 'Visa application support, appointment booking, travel insurance and university pre-enrolment for students heading abroad.',
  },
  {
    icon: BedDouble,
    title: 'Hotels & stays',
    description: 'Hand-picked hotels, lodges and apartments in Dakar, Saly, Casamance and worldwide — booked through our local partners.',
  },
  {
    icon: Car,
    title: 'AIBD airport transfers',
    description: 'Meet & greet at Blaise-Diagne airport (AIBD) and private transfers to Dakar, Diamniadio or Saly with a local driver.',
  },
  {
    icon: MapPinned,
    title: 'Private tours & excursions',
    description: 'Gorée Island, Pink Lake (Lac Rose), Bandia reserve, Sine-Saloum delta, Casamance — guided day trips and multi-day circuits.',
  },
  {
    icon: Briefcase,
    title: 'Business travel & groups',
    description: 'Seminars, incentives, delegations and group logistics across Senegal, with on-the-ground coordination.',
  },
];

const audiences = [
  'Visitors preparing a trip to Senegal for the first time',
  'Senegalese diaspora organising a family return or holiday back home',
  'Travellers from West Africa and beyond connecting through Dakar',
  'Companies and delegations needing reliable ground logistics',
];

export default function EnglishHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Senegal coastline" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-black/55 to-black/70 z-10" />
          <div className="relative z-20 text-center px-4 max-w-4xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6">
              Travel agency · Dakar, Senegal
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg font-headline text-white">
              Discover Senegal with a Local Team
            </h1>
            <div className="w-20 h-0.5 bg-accent mx-auto my-6" />
            <p className="text-lg md:text-2xl max-w-2xl mx-auto drop-shadow-md text-white/90 text-balance">
              Flights, visa assistance, airport transfers, hotels and private tours — organised from Dakar by SLAAC Voyages, your trusted local agency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <QuoteRequestButton locale="en" variant="gold" size="lg" source="en-hero" className="w-full sm:w-auto">
                <Send className="mr-2 h-5 w-5" /> Request a free quote
              </QuoteRequestButton>
              <a href="https://wa.me/221773129090?text=Hello%2C%20I%20would%20like%20information%20about%20your%20services." target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp us
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-white/75">
              Free quote, no commitment · Reply within 24 h · Agency in Dakar Plateau
            </p>
          </div>
        </section>

        {/* Services */}
        <section id="en-services" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">What we do</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">One Agency for Your Whole Trip</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Every quote is prepared by a real advisor based in Dakar — you talk to the people who organise your trip.
              </p>
            </div>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.title} className="shadow-sm hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center mb-4">
                        <Icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Who we help */}
        <section className="py-16 sm:py-24 bg-secondary">
          <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Who we help</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">From Dakar to the World — and Back</h2>
              <div className="w-12 h-0.5 bg-accent my-5" />
              <ul className="mt-6 space-y-3">
                {audiences.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                    <span className="text-muted-foreground">{a}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <QuoteRequestButton locale="en" variant="gold" size="lg" source="en-audiences">
                  <Send className="mr-2 h-4 w-4" /> Request a quote
                </QuoteRequestButton>
                <Button asChild size="lg" variant="outline">
                  <Link href="/en/destinations">Browse destinations <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Our advisors assist international visitors and corporate delegations in English. Request your free quote online or via WhatsApp.
              </p>
            </div>
            <div className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=900&h=700&fit=crop"
                alt="Senegal — Gorée Island scenery"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Event mention — informative only */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">Coming to Dakar for the big 2026 event?</h2>
            <p className="mt-3 text-primary-foreground/85 text-balance">
              Dakar hosts a major international youth sports event from 31 October to 13 November 2026 (Dakar · Diamniadio · Saly). We organise your transfers, accommodation and tours — tickets are sold on the official platform only.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild variant="gold" size="lg">
                <Link href="/en/dakar-2026">Plan my stay in Dakar</Link>
              </Button>
              <a href="https://tickets.dakar2026.org/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                  Official ticketing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Talk to a Real Advisor</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-muted-foreground">
              14 Rue de Thiong (angle Rue Mohamed V), Immeuble Djolof Chicken (3rd floor), Dakar Plateau — Senegal
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
              <a href="tel:+221773129090">
                <Button size="lg" variant="default"><Phone className="mr-2 h-5 w-5" /> +221 77 312 90 90</Button>
              </a>
              <a href="https://wa.me/221773129090" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"><MessageCircle className="mr-2 h-5 w-5" /> WhatsApp</Button>
              </a>
              <QuoteRequestButton locale="en" size="lg" source="en-contact">
                <Send className="mr-2 h-4 w-4" /> Free quote
              </QuoteRequestButton>
              <Button asChild size="lg" variant="outline">
                <Link href="/en/contact">Contact details <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'SLAAC Voyages',
            url: SITE_URL,
            telephone: '+221773129090',
            email: 'mdslaacvoyages@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Rue Mouhamed 5, Immeuble Djolof Chicken, 3rd floor',
              addressLocality: 'Dakar',
              addressCountry: 'SN',
            },
            availableLanguage: ['fr', 'en'],
          }),
        }}
      />
    </div>
  );
}
