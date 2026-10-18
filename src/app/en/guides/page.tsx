import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { guidesDataEn } from '@/data/guides-en';
import { Clock, BookOpen, ArrowRight, ShieldCheck, CheckCircle2, Send, PhoneCall } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Practical Travel Guides & Expert Tips for Dakar & Senegal | SLAAC Voyages',
  description: 'Curated practical guides by the SLAAC Voyages team: AIBD airport transfers, Gorée Island ferry advice, best Dakar residential districts, visa requirements and business logistics.',
  alternates: {
    canonical: '/en/guides',
    languages: {
      fr: '/guides',
      en: '/en/guides',
      'x-default': '/guides',
    },
  },
  openGraph: {
    title: 'Practical Travel Guides & Expert Tips for Dakar & Senegal | SLAAC Voyages',
    description: 'Local insights from Dakar Plateau: airport logistics, consular procedures, verified apartments and private Senegal tours.',
    url: '/en/guides',
    type: 'website',
  },
};

export default function EnglishGuidesPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SLAAC Voyages Practical Travel Guides & Insights',
    url: `${SITE_URL}/en/guides`,
    description: 'Practical dossiers and field-tested advice to help you prepare your journey to Senegal and international trips.',
    publisher: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
    },
    hasPart: guidesDataEn.map((g) => ({
      '@type': 'Article',
      headline: g.title,
      url: `${SITE_URL}/en/guides/${g.slug}`,
      datePublished: g.publishedAt,
      dateModified: g.updatedAt,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Schema.org CollectionPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        />

        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 md:py-20 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/en' },
                { label: 'Travel Guides & Advice', href: '/en/guides' },
              ]}
              className="text-slate-300 mb-6"
            />
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slaac-gold-500/20 text-slaac-gold-400 border border-slaac-gold-500/30 mb-4">
                <BookOpen className="w-3.5 h-3.5" /> Practical Travel Centre
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-headline text-white mb-4">
                Dakar & Senegal Travel Insights, Shared with Complete Clarity
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
                Field-tested guides authored by our travel specialists based in Dakar Plateau. Whether you need AIBD airport logistics, visa regulations, safe neighbourhood picks, or corporate travel coordination: discover reliable, regularly updated recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Reassurance & Verification Bar */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-4">
          <div className="container mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Written by the on-the-ground team at SLAAC Voyages Dakar Plateau</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slaac-gold-600 shrink-0" />
              <span>Consular & transport information verified against official regulatory sources</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Latest editorial update: October 2026</span>
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-headline">All Practical Dossiers</h2>
                <p className="text-sm text-slate-500 mt-1">Select a guide to prepare your stay, business logistics, or consular paperwork</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {guidesDataEn.map((guide) => (
                <Card
                  key={guide.slug}
                  className="flex flex-col overflow-hidden border-slate-200/80 hover:border-slaac-gold-400 hover:shadow-lg transition-all duration-300 group bg-white"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={guide.heroImage}
                      alt={guide.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge
                      variant="gold"
                      className="absolute top-3 left-3 text-[11px] font-semibold tracking-wider shadow-sm"
                    >
                      {guide.category}
                    </Badge>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{guide.readTime}</span>
                      <span>•</span>
                      <span>Verified {new Date(guide.verifiedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-slaac-gold-600 transition-colors mb-3 line-clamp-2">
                      <Link href={`/en/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {guide.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
                      <span className="text-slate-500 font-medium">By {guide.author.name}</span>
                      <Link
                        href={`/en/guides/${guide.slug}`}
                        className="font-semibold text-slaac-gold-600 group-hover:text-slaac-gold-700 flex items-center gap-1 transition-colors"
                      >
                        Read guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tailored Assistance Banner */}
        <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline mb-4">
              Need Personalised Assistance for Your Trip to Dakar?
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto mb-8">
              Our travel concierge and logistics consultants in Dakar Plateau are available to arrange your private transfers, verified accommodation, and custom itineraries.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <QuoteRequestButton variant="gold" size="lg" locale="en">
                <Send className="w-4 h-4 mr-2" /> Request a free custom quote
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800">
                <Link href="/en/contact">
                  <PhoneCall className="w-4 h-4 mr-2" /> Contact our Dakar office
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
