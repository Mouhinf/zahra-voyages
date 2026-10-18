import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Building2, Users2, FileText, CheckCircle2, Send, MessageCircle, ShieldCheck } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Corporate Travel, MICE & Executive Logistics in Dakar | SLAAC Voyages',
  description: 'Business travel management in Senegal: seminars, diplomatic delegations, VIP ground transport, hotel block bookings, and compliant corporate invoicing with Senegalese VAT.',
  alternates: {
    canonical: '/en/tourisme-affaires',
    languages: {
      fr: `${SITE_URL}/tourisme-affaires`,
      en: `${SITE_URL}/en/tourisme-affaires`,
      'x-default': `${SITE_URL}/tourisme-affaires`,
    },
  },
  openGraph: {
    title: 'Corporate Travel & MICE in Dakar — SLAAC Voyages',
    description: 'Bespoke corporate logistics for business meetings, conferences, and international delegations across Senegal.',
    url: `${SITE_URL}/en/tourisme-affaires`,
    locale: 'en_US',
    siteName: 'SLAAC Voyages',
  },
};

const corporateServices = [
  {
    icon: Briefcase,
    title: 'Executive Ground Mobility',
    description: 'Dedicated chauffeured sedans, SUVs, and executive minivans for executives, board members, and business delegations in Dakar and Diamniadio.',
    benefits: ['On-call dispatch 24/7', 'Bilingual professional drivers', 'Fast-lane tollway access', 'Flight delay buffer included'],
  },
  {
    icon: Building2,
    title: 'Hotel Blocks & Residences',
    description: 'Corporate negotiated rates in leading Dakar business hotels (Plateau, Almadies) and serviced residences with guaranteed backup generators and fiber Wi-Fi.',
    benefits: ['Centralized group booking', 'Negotiated corporate rates', 'Flexible cancellation options', 'Close to ministerial and financial hubs'],
  },
  {
    icon: Users2,
    title: 'Seminars, Conferences & MICE',
    description: 'Full-service event coordination: conference hall booking, audio-visual technical setups, airport shuttles, and gala dinner arrangements.',
    benefits: ['Dedicated event project manager', 'Simultaneous interpretation coordination', 'Group catering and team excursions', 'Turnkey logistics'],
  },
  {
    icon: FileText,
    title: 'Official Corporate Billing & Tax Compliance',
    description: 'Transparent B2B invoicing compliant with Senegalese fiscal regulations (NINEA, RCCM, VAT/TVA breakdown) for simplified corporate accounting.',
    benefits: ['Detailed itemized invoicing', 'Corporate payment terms', 'Direct bank transfer support', 'Auditable expense reporting'],
  },
];

export default function EnglishCorporatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slaac-navy-900 via-slaac-navy-800 to-slate-900 text-white py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="container mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slaac-gold-500/20 text-slaac-gold-300 border border-slaac-gold-500/30 uppercase tracking-widest mb-6">
              <Briefcase className="h-3.5 w-3.5" /> B2B Travel Management & MICE in Senegal
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight text-white mb-6">
              Corporate Travel & Delegations in Dakar
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              A trusted local partner for international corporations, NGOs, embassies, and event organizers. We coordinate ground transportation, lodging, and conference logistics across Dakar and Diamniadio.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="tourisme-affaires"
                source="en-corporate-hero"
                className="w-full sm:w-auto font-semibold px-6"
              >
                <Send className="mr-2 h-4 w-4" /> Request Corporate Proposal
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20">
                <a href="https://wa.me/221773129090?text=Hello%20SLAAC%20Voyages%2C%20I%20would%20like%20to%20discuss%20corporate%20travel%20services." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" /> Corporate WhatsApp Desk
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
                Comprehensive B2B Travel Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
                Designed to meet the rigorous expectations of international organizations and multinational enterprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {corporateServices.map((srv, idx) => {
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
                      <ul className="space-y-2 pt-2 border-t border-slate-100">
                        {srv.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="text-xs text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <QuoteRequestButton
                        variant="gold"
                        size="sm"
                        defaultService="tourisme-affaires"
                        source={`en-corporate-${idx}`}
                        className="w-full"
                      >
                        Request Corporate Quotation
                      </QuoteRequestButton>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Corporate Trust Banner */}
        <section className="py-16 bg-slate-50 border-t border-slate-200 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <ShieldCheck className="h-10 w-10 text-slaac-gold-600 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900">
              Reliable Local Partner in Dakar Plateau
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Located at 14 Rue de Thiong in Dakar Plateau, SLAAC Voyages has built lasting relationships with private companies, international agencies, and sports delegations. We provide single-point-of-contact coordination and dedicated account managers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <QuoteRequestButton
                variant="gold"
                size="lg"
                defaultService="tourisme-affaires"
                source="en-corporate-bottom"
                className="w-full sm:w-auto font-semibold px-8"
              >
                <Send className="mr-2 h-4 w-4" /> Open Corporate Account
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/en/contact">Schedule a Meeting</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
