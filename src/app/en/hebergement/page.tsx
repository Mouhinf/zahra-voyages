import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Zap, Wifi, Shield, CheckCircle2, MapPin, Send, MessageCircle, Star } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Furnished Apartments & Verified Stays in Dakar, Senegal | SLAAC Voyages',
  description: 'Book serviced apartments, private villas, and partner hotels in Dakar (Plateau, Almadies, Ngor) and Saly. Verified properties with backup generator, high-speed fiber Wi-Fi, and 24/7 security.',
  alternates: {
    canonical: '/en/hebergement',
    languages: {
      fr: `${SITE_URL}/hebergement`,
      en: `${SITE_URL}/en/hebergement`,
      'x-default': `${SITE_URL}/hebergement`,
    },
  },
  openGraph: {
    title: 'Verified Stays & Apartments in Dakar — SLAAC Voyages',
    description: 'Serviced apartments and boutique hotels with guaranteed generator and fiber in Dakar and Saly.',
    url: `${SITE_URL}/en/hebergement`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const areas = [
  {
    name: 'Dakar Plateau — Business District',
    description: 'Ideal for executives, delegations, and corporate travelers. Walking distance to ministries, international banks, embassies, and the Port of Dakar.',
    highlights: ['Prime central location', 'Guaranteed generator & fiber', 'Executive serviced residences', 'Immediate access to Gorée ferry'],
    indicativePrice: 'From 55,000 XOF (~85 EUR / $90 USD) / night',
  },
  {
    name: 'Almadies & Ngor — Coastal & Diplomatic Hub',
    description: 'Dakar’s most prestigious residential neighborhood. Home to leading embassies, international schools, fine dining, and oceanfront lounges.',
    highlights: ['Ocean views & sea breeze', 'High-end furnished apartments', 'Private security & secure access', 'Minutes from Pointe des Almadies'],
    indicativePrice: 'From 70,000 XOF (~105 EUR / $115 USD) / night',
  },
  {
    name: 'Mermoz, Fann & Point E — Central & Peaceful',
    description: 'Central residential quarters offering tranquility and strategic access midway between downtown Plateau and the northern business zones.',
    highlights: ['Quiet residential streets', 'Modern furnished apartments', 'Family-friendly suites', 'Close to universities & medical hubs'],
    indicativePrice: 'From 45,000 XOF (~70 EUR / $75 USD) / night',
  },
  {
    name: 'Saly Portudal & Somone — Seaside Villas',
    description: 'The Petite Côte coastline, 45 minutes from AIBD airport. Private beach villas, resort apartments, and peaceful weekend getaways.',
    highlights: ['Private swimming pools', 'Beachfront access', 'Full-time housekeepers on request', 'Ideal for holiday stays & groups'],
    indicativePrice: 'From 65,000 XOF (~100 EUR / $110 USD) / night',
  },
];

const guarantees = [
  {
    icon: Zap,
    title: 'Backup Power Generator',
    description: 'All recommended residences feature an automatic backup generator to ensure uninterrupted electricity and air conditioning.',
  },
  {
    icon: Wifi,
    title: 'Guaranteed Fiber Wi-Fi',
    description: 'High-speed fiber optic connection tested on-site for seamless remote work, Zoom conferences, and streaming.',
  },
  {
    icon: Shield,
    title: '24/7 Security & Concierge',
    description: 'Gated access, surveillance, and on-call concierge assistance from our local team in Dakar.',
  },
  {
    icon: Star,
    title: 'Inspected Quality',
    description: 'Every property is physically visited and verified by SLAAC Voyages advisors before being recommended to clients.',
  },
];

export default function EnglishHebergementPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <Hotel className="h-3.5 w-3.5" /> Handpicked Accommodations in Senegal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Serviced Apartments & Verified Stays in Dakar
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Avoid unpleasant surprises. SLAAC Voyages partners with verified residences, boutique hotels, and private villas in Dakar and Saly equipped with backup generators, fast fiber internet, and 24/7 security.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="hebergement"
                source="en-hebergement-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Request Accommodation Options
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20">
                <a href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20am%20looking%20for%20accommodation%20in%20Dakar." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {guarantees.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs text-center">
                    <Icon className="h-8 w-8 text-slaac-gold-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Neighborhood Highlights */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Where to Stay in Dakar & Along the Coast
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Explore Dakar's top residential and business quarters according to your travel purpose and preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {areas.map((area, idx) => (
                <Card key={idx} className="border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slaac-gold-600">
                      <MapPin className="h-4 w-4" /> Dakar & Senegal
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{area.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{area.description}</p>
                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {area.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-600 flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs font-semibold text-slate-700 bg-slate-100 p-2 rounded-md">
                      {area.indicativePrice}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <QuoteRequestButton
                      variant="gold"
                      size="sm"
                      defaultService="hebergement"
                      defaultDestination={area.name.split('—')[0].trim()}
                      source={`en-area-${idx}`}
                      className="w-full"
                    >
                      Inquire About {area.name.split('—')[0].trim()}
                    </QuoteRequestButton>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-slaac-navy-900 text-white text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-bold font-headline text-white mb-4">
              Planning a Short or Long Stay in Senegal?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Tell us your preferred dates, budget, and neighborhood preferences. Our local team will curate a personalized selection of verified properties within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="hebergement"
                source="en-hebergement-bottom"
                className="w-full sm:w-auto font-semibold px-8"
              >
                <Send className="mr-2 h-4 w-4" /> Request a Tailored Offer
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20">
                <Link href="/en/transport">
                  Combine with Airport Transfer
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
