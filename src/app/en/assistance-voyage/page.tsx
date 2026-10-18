import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck2, ShieldAlert, Globe, GraduationCap, Calendar, CheckCircle2, Send, MessageCircle } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Visa Support, Travel Insurance & International Mobility in Dakar | SLAAC Voyages',
  description: 'Travel assistance in Dakar: Senegal entry verification, outbound visa support (Schengen, Dubai, China, USA), accredited international travel insurance, and student mobility services.',
  alternates: {
    canonical: '/en/assistance-voyage',
    languages: {
      fr: `${SITE_URL}/assistance-voyage`,
      en: `${SITE_URL}/en/assistance-voyage`,
      'x-default': `${SITE_URL}/assistance-voyage`,
    },
  },
  openGraph: {
    title: 'Visa Support & Travel Assistance in Dakar — SLAAC Voyages',
    description: 'Expert travel assistance for Senegal entry, outbound visas, travel insurance, and study mobility.',
    url: `${SITE_URL}/en/assistance-voyage`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const services = [
  {
    icon: Globe,
    title: 'Senegal Entry Verification',
    description: 'Arriving in Senegal? We verify visa exemption rules for your passport, yellow fever vaccination requirements, and entry customs protocols.',
    tags: ['ECOWAS & EU exemptions', 'Passport 6-month validity', 'Airport health formalities'],
  },
  {
    icon: FileCheck2,
    title: 'Outbound Visa Support',
    description: 'Planning a trip abroad from Dakar? Complete file assembly, dossier verification, and appointment booking for Dubai, China, Turkey, and Schengen destinations.',
    tags: ['Document review', 'Embassy appointment booking', 'Consular fee advice'],
  },
  {
    icon: ShieldAlert,
    title: 'Accredited Travel Insurance',
    description: 'Mandatory international insurance policies covering medical repatriation, hospitalizations, luggage loss, and trip cancellations worldwide.',
    tags: ['Schengen-compliant policies', '24/7 global emergency assistance', 'Instant digital issuance'],
  },
  {
    icon: GraduationCap,
    title: 'Student Mobility & University Enrollment',
    description: 'Guidance for Senegalese and West African students seeking pre-enrollment in universities and colleges across France, Canada, Morocco, and China.',
    tags: ['Campus France support', 'Accommodation certificates', 'Financial proof verification'],
  },
];

export default function EnglishAssistancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <FileCheck2 className="h-3.5 w-3.5" /> Administrative & Travel Formalities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Visa Support & International Travel Assistance in Dakar
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Navigate visa requirements, entry regulations, and travel insurance with confidence. SLAAC Voyages provides advisory services and administrative support from our central agency in Dakar Plateau.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="assistance-visa"
                source="en-assistance-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Request Visa Consultation
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20">
                <a href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20need%20visa%20and%20travel%20assistance." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Inquire on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3">
                Our Travel Assistance Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Comprehensive administrative guidance to ensure compliant, hassle-free international travel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((srv, idx) => {
                const Icon = srv.icon;
                return (
                  <Card key={idx} className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <CardContent className="p-6 md:p-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-slaac-gold-50 text-slaac-gold-600">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{srv.title}</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        {srv.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <QuoteRequestButton
                        variant="gold"
                        size="sm"
                        defaultService="assistance-visa"
                        defaultDestination={srv.title}
                        source={`en-assistance-${idx}`}
                        className="w-full"
                      >
                        Request Assistance for {srv.title.split(' ')[0]}
                      </QuoteRequestButton>
                    </div>
                </Card>
              );
            })}
            </div>
          </div>
        </section>

        {/* Disclaimer Notice */}
        <section className="py-12 bg-amber-50 border-y border-amber-200 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-2">Important Consular Notice</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              SLAAC Voyages provides file compilation, document verification, and appointment booking support. We do not issue visas or guarantee consular decisions, which remain the sovereign prerogative of respective embassies and immigration authorities.
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-slaac-navy-900 text-white text-center px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-white mb-4">
              Have Questions About Travel Requirements for Senegal?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Contact our Dakar Plateau team. We will review your travel documents, passport nationality, and itinerary to ensure everything is prepared before departure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="assistance-visa"
                source="en-assistance-bottom"
                className="w-full sm:w-auto font-semibold px-8"
              >
                <Send className="mr-2 h-4 w-4" /> Start Your Inquiry
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white bg-white/10 hover:bg-white/20">
                <Link href="/en/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
