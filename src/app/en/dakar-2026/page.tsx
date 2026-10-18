import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Plane, Hotel, Car, Users, ExternalLink, Info, ShieldCheck, Quote } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FaqSection from '@/components/sections/faq-section';

export const metadata: Metadata = {
  title: 'Dakar Late 2026 Stay: AIBD Transfers & Accommodations | SLAAC Voyages',
  description:
    'Ground logistics and stays for visitors and delegations in Dakar, Diamniadio and Saly late 2026: private AIBD fleet, secured apartments and private tours with SLAAC Voyages.',
  alternates: {
    canonical: '/en/dakar-2026',
    languages: {
      fr: '/dakar-2026',
      en: '/en/dakar-2026',
      'x-default': '/dakar-2026',
    },
  },
  openGraph: {
    title: 'Dakar Late 2026 Stay: AIBD Transfers & Accommodations | SLAAC Voyages',
    description:
      'Hospitality and ground logistics management in Senegal late 2026 with trusted local agency SLAAC Voyages.',
    url: '/en/dakar-2026',
    locale: 'en_US',
  },
};

// Editorial page: factual event information + independent SLAAC travel services clearly separated.
// Zero affiliation: SLAAC Voyages is neither an official partner nor ticket reseller for the event.
// Factual sources: olympics.com (official IOC website) — verified dates and host cities.

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1791894558/slaac-voyages/dakar-2026-ceremonie-medailles.png';

const zones = [
  {
    name: 'Dakar',
    description:
      'The bustling capital: embassies, business districts (Plateau, Almadies), ferry terminal for Gorée Island, vibrant cultural life and fine dining. Wide selection of city hotels and serviced apartments.',
  },
  {
    name: 'Diamniadio',
    description:
      'A rapidly growing modern hub located right next to Blaise Diagne International Airport (AIBD). Modern sports venues, conference facilities, and quick highway access to both Dakar and the Petite Côte.',
  },
  {
    name: 'Saly Portudal',
    description:
      'The historical seaside resort of the Petite Côte: sandy beaches, oceanfront hotels, water sports and relaxed dining. Ideal setting to combine sports events with coastal relaxation.',
  },
];

const services = [
  {
    icon: Plane,
    title: 'AIBD Airport Transfers',
    description:
      'Meet & greet inside Blaise Diagne Airport and private direct transfer to Dakar, Diamniadio, or Saly with professional, licensed drivers.',
    service: 'transport' as const,
    destination: 'AIBD Transfer — Dakar 2026 event',
    source: 'en-dakar2026-transfert',
  },
  {
    icon: Hotel,
    title: 'Accommodations on Quote',
    description:
      'Hand-picked hotels, boutique lodges, and serviced apartments in Dakar, Diamniadio, and Saly tailored to your budget and group size.',
    service: 'hebergement' as const,
    destination: 'Accommodation — Dakar 2026 event',
    source: 'en-dakar2026-hebergement',
  },
  {
    icon: Car,
    title: 'Private Chauffeur & Daily Hire',
    description:
      'Dedicated private vehicle with driver for daily shuttles between Dakar, Diamniadio, and Saly without parking hassles or traffic stress.',
    service: 'transport' as const,
    destination: 'Chauffeur vehicle — Dakar 2026 event',
    source: 'en-dakar2026-chauffeur',
  },
  {
    icon: Users,
    title: 'Groups & Official Delegations',
    description:
      'Comprehensive ground management for families, sports clubs, corporate sponsors, and national delegations: private bus fleets, on-site liaison, and VAT-compliant billing.',
    service: 'tourisme-affaires' as const,
    destination: 'Group / Delegation — Dakar 2026 event',
    source: 'en-dakar2026-groupe',
  },
];

const faq = [
  {
    question: 'What are the exact dates of the major 2026 sporting event in Dakar?',
    reponse:
      'The Dakar 2026 Youth Olympic Games (YOG) take place from 31 October to 13 November 2026, hosted across Dakar, Diamniadio, and Saly. This is the first Olympic sporting event ever held on the African continent (source: olympics.com).',
  },
  {
    question: 'Does SLAAC Voyages sell competition tickets or passes?',
    reponse:
      'No. SLAAC Voyages is not a ticket reseller and is not affiliated with the event organisers or the IOC. Official spectator tickets are sold exclusively on tickets.dakar2026.org. However, our licensed agency manages everything else for your stay: airport transfers, vetted lodging, private chauffeur fleets, guided excursions, and group concierge coordination.',
  },
  {
    question: 'Do international visitors need a visa to enter Senegal?',
    reponse:
      'Visa regulations depend on your nationality. Citizens of ECOWAS member states, European Union countries, the United States, and Canada currently enter Senegal without a visa for short tourist stays up to 90 days. Please verify specific requirements with the Senegalese embassy or consulate in your country before travelling. Your passport must have at least 6 months validity from your scheduled return date.',
  },
  {
    question: 'Where should we stay: Dakar, Diamniadio, or Saly?',
    reponse:
      'It depends on your daily schedule and priorities: Dakar for city culture and nightlife; Diamniadio for proximity to the modern competition arenas and AIBD airport; Saly for beach resorts and family relaxation. Note that travel times vary with traffic: plan on 45–60 minutes between AIBD and Dakar city centre via the toll highway, and 30–45 minutes between AIBD and Saly. Contact our local advisors for personalized recommendations.',
  },
  {
    question: 'Can we book guided tours in Senegal before or after the competitions?',
    reponse:
      'Yes, and we highly recommend it! Gorée Island, the Pink Lake (Lac Rose), the Bandia Wildlife Reserve, the Sine-Saloum delta, and the Casamance region are ideal for pre- or post-event discovery. Our private excursions operate year-round with English-speaking licensed guides.',
  },
];

export default function Dakar2026EnglishPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image
            src={HERO_IMG}
            alt="Dakar 2026 sports ceremony at sunset in Senegal"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Dakar · Diamniadio · Saly — 31 Oct → 13 Nov 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">
              Plan Your Stay in Dakar Late 2026
            </h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Africa&apos;s historic global youth sports event. Airport transfers, hotel bookings, private tours, and group logistics: your trusted local agency handles all the details.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/en' }, { label: 'Dakar 2026 Stay' }]} />
        </div>

        {/* Legal Disclaimer — Separation of information and commercial travel services */}
        <section aria-label="Independent agency notice" className="border-b bg-secondary/60">
          <div className="container mx-auto max-w-5xl px-4 py-4">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Independent Travel Agency Notice.</strong> SLAAC Voyages is an independent licensed Senegalese travel agency and is neither an official partner, sponsor, nor authorized ticket reseller of Dakar 2026 or the IOC. This page provides travel information and presents our own independent hospitality and ground transportation services, sold separately from any event ticketing.
              </span>
            </p>
          </div>
        </section>

        {/* The Event: Verified Facts */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline text-center">
              Event Highlights at a Glance
            </h2>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CalendarDays, titre: 'Event Dates', texte: '31 October to 13 November 2026 — 14 days of world-class competition.' },
                { icon: MapPin, titre: 'Three Host Zones', texte: 'Dakar, Diamniadio, and Saly host the sports venues and cultural festival.' },
                { icon: Users, titre: '~2,700 Athletes', texte: 'Elite young athletes (aged 14–17) from over 200 nations expected.' },
                { icon: ShieldCheck, titre: 'First in Africa', texte: 'The very first Olympic sporting gathering hosted on African soil.' },
              ].map((f) => (
                <Card key={f.titre} className="text-center p-6 shadow-md border-border/50">
                  <CardContent className="p-0">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-primary">{f.titre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.texte}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Official institutional sources:{' '}
              <a
                href="https://www.olympics.com/cio/dakar-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
              >
                olympics.com/cio/dakar-2026 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>{' '}
              ·{' '}
              <a
                href="https://tickets.dakar2026.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
              >
                official ticketing tickets.dakar2026.org <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>

        {/* The Three Zones */}
        <section className="py-16 sm:py-20 bg-secondary">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">
                Where Should You Stay?
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Each zone offers distinct advantages. Our logistics team arranges round-the-clock point-to-point transit.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {zones.map((z) => (
                <Card key={z.name} className="shadow-md hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-primary font-headline">{z.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">{z.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/en/destinations">Explore Our Senegal Destinations</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* SLAAC Services — Commercial Services Section */}
        <section id="services-stay" className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">SLAAC Voyages Services</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">
                Your Stay in Senegal, Completely Stress-Free
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                These ground services are provided by SLAAC Voyages, completely independent of the sports event. Tailored quotes with 24-hour turnaround.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.title} className="flex flex-col shadow-md hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{s.description}</p>
                      <div className="mt-4">
                        <QuoteRequestButton
                          locale="en"
                          defaultService={s.service}
                          defaultDestination={s.destination}
                          source={s.source}
                          variant="gold"
                          className="w-full sm:w-auto"
                        >
                          <Quote className="mr-2 h-4 w-4" /> Request a free quote
                        </QuoteRequestButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Event competition admission tickets are NOT included in our travel packages: purchase them exclusively on the official ticketing portal (link above).
            </p>
          </div>
        </section>

        {/* English FAQ */}
        <FaqSection
          title="Frequently Asked Questions — Dakar 2026 Stay"
          subtitle="Information verified for 2026 travellers. Visa regulations and airline policies may evolve; please confirm details with your consulate."
          items={faq}
        />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.reponse },
            })),
          }),
        }}
      />
    </div>
  );
}
