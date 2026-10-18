import Image from 'next/image';
import Link from 'next/link';
import { Users, Globe, Heart, Building, Award, Target, Send, MessageCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { Button } from '@/components/ui/button';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import type { Metadata } from 'next';
import { SITE_URL, CONTACT } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About SLAAC Voyages | Licensed Travel Agency in Dakar Plateau',
  description:
    'SLAAC Voyages is an officially licensed travel agency and local DMC in Dakar Plateau, Senegal: international ticketing, visa assistance, vetted lodging, airport transfers, and VIP corporate concierge.',
  alternates: {
    canonical: '/en/about',
    languages: {
      fr: '/about',
      en: '/en/about',
      'x-default': '/about',
    },
  },
  openGraph: {
    title: 'About SLAAC Voyages | Licensed Travel Agency in Dakar Plateau',
    description:
      'Discover the team, history, and values of SLAAC Voyages, your trusted local destination management company in Dakar.',
    url: '/en/about',
    locale: 'en_US',
  },
};

const whyUs = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Tailored Local Expertise',
    description:
      'Our Dakar-based team of travel professionals designs customized itineraries matching your exact schedule, comfort level, and budget.',
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Global Reach, Local Touch',
    description:
      'We combine worldwide airline reservation systems (GDS) with deep on-the-ground relationships across Senegal and West Africa.',
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Peace of Mind & Dedication',
    description:
      'From flight check-in and visa paperwork to 24/7 on-call roadside assistance during your stay, we handle every detail so you can travel serenely.',
  },
];

const companyInfo = [
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: 'Our Story',
    description:
      'Founded in Dakar Plateau, SLAAC Voyages was born from a passion for West African hospitality and seamless international travel. We grew from a dedicated ticketing boutique into a comprehensive destination management agency serving diaspora families, corporate delegations, and international visitors.',
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: 'Our Mission',
    description:
      'To provide flawless travel experiences by combining transparent pricing, verified ground logistics, and warm Senegalese Teranga. We guarantee responsive communication with dedicated advisors available before, during, and after your journey.',
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Our Values',
    description:
      'Integrity, punctuality, and cultural respect guide every service we offer. We work with certified local drivers, verified properties with generator backup, and adhere strictly to Senegalese tourism and commercial licensing regulations.',
  },
];

export default function EnglishAboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/en' }, { label: 'About Us' }]} />
        </div>

        {/* Hero */}
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">About SLAAC Voyages</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary font-headline">Who We Are</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-secondary-foreground max-w-3xl mx-auto text-balance">
              Discover the history, licensing credentials, and customer commitment that make SLAAC Voyages your trusted travel partner in Dakar and beyond.
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section id="about" className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 lg:h-full min-h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png"
                  alt="SLAAC Voyages agency and concierge team in Dakar"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">
                  Your Trusted Destination Partner in Senegal
                </h2>
                <div className="w-12 h-0.5 bg-accent my-5" />
                <div className="mt-2 text-lg text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    <strong>SLAAC Voyages</strong> is a fully registered Senegalese travel agency and inbound tour operator based in the heart of Dakar Plateau (Immeuble Djolof Chicken, 3rd Floor, Rue de Thiong / Rue Mohamed V).
                  </p>
                  <p>
                    We specialize in international flight ticketing across all major alliances, student pre-registration, consular visa appointment assistance, verified private apartment and hotel bookings, AIBD airport meet-and-greet transfers, and curated excursions across Senegal.
                  </p>
                  <p>
                    Whether you are an overseas visitor planning your first discovery of Dakar and Gorée, a multinational organizing a summit delegation, or an expatriate returning home, our English-speaking advisors deliver personalised itineraries with 24/7 on-site responsiveness.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <QuoteRequestButton locale="en" variant="gold" size="lg" source="en-about">
                    <Send className="mr-2 h-4 w-4" /> Request a free quote
                  </QuoteRequestButton>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/en/contact">
                      Contact our office <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Why choose us</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">
                The SLAAC Voyages Standard
              </h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {whyUs.map((item, idx) => (
                <div key={idx} className="bg-background p-8 rounded-xl shadow-md border border-border/50 text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary font-headline mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corporate Pillars */}
        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {companyInfo.map((info, idx) => (
                <div key={idx} className="p-8 rounded-xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">{info.icon}</div>
                  <h3 className="text-xl font-semibold text-primary font-headline mb-3">{info.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Accreditations Banner */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-5xl px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-wider mb-4">
              <ShieldCheck className="h-4 w-4 text-accent" /> Officially Registered Agency
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline">
              Full Legal Compliance &amp; Local Transparency
            </h2>
            <p className="mt-3 text-primary-foreground/85 max-w-2xl mx-auto text-sm leading-relaxed">
              Operating with full Senegalese legal registration (NINEA, RCCM) and compliant with tourism tax and commercial requirements. Official invoices provided with Senegalese VAT (TVA) breakdown for corporate accounting.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium">
              <span className="px-4 py-2 rounded-lg bg-white/10">📍 Office in Dakar Plateau</span>
              <span className="px-4 py-2 rounded-lg bg-white/10">🛡️ Vetted Local Ground Fleet</span>
              <span className="px-4 py-2 rounded-lg bg-white/10">⚡ 24/7 Client Emergency Support</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-3xl font-bold text-primary font-headline">Ready to Discuss Your Trip to Senegal?</h2>
            <p className="mt-3 text-muted-foreground">
              Speak directly with our English-speaking advisors or visit our Plateau agency.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <QuoteRequestButton locale="en" variant="gold" size="lg" source="en-about-bottom">
                <Send className="mr-2 h-4 w-4" /> Request a free quote
              </QuoteRequestButton>
              <a href="https://wa.me/221773129090?text=Hello%2C%20I%20would%20like%20more%20information%20about%20SLAAC%20Voyages." target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
                </Button>
              </a>
              <a href={`tel:${CONTACT.phoneIntl}`}>
                <Button size="lg" variant="ghost">
                  <Phone className="mr-2 h-4 w-4" /> {CONTACT.phone}
                </Button>
              </a>
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
            '@type': 'AboutPage',
            name: 'About SLAAC Voyages',
            url: `${SITE_URL}/en/about`,
            mainEntity: {
              '@type': 'TravelAgency',
              name: 'SLAAC Voyages',
              url: SITE_URL,
              telephone: CONTACT.phoneIntl,
              email: CONTACT.email,
              address: {
                '@type': 'PostalAddress',
                streetAddress: CONTACT.address.street,
                addressLocality: CONTACT.address.city,
                addressCountry: 'SN',
              },
            },
          }),
        }}
      />
    </div>
  );
}
