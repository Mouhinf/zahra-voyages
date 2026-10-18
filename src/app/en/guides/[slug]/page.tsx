import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { guidesDataEn, getEnglishGuideBySlug } from '@/data/guides-en';
import {
  Clock,
  Calendar,
  ShieldCheck,
  HelpCircle,
  FileCheck2,
  ArrowLeft,
  Building2,
  Send,
} from 'lucide-react';
import { SITE_URL } from '@/lib/site';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesDataEn.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEnglishGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | SLAAC Voyages',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `/en/guides/${guide.slug}`,
      languages: {
        fr: `/guides/${guide.slug}`,
        en: `/en/guides/${guide.slug}`,
        'x-default': `/guides/${guide.slug}`,
      },
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `/en/guides/${guide.slug}`,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      images: [
        {
          url: guide.heroImage,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
      images: [guide.heroImage],
    },
  };
}

export default async function EnglishGuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getEnglishGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/en/guides/${guide.slug}#article`,
    headline: guide.title,
    description: guide.metaDescription,
    inLanguage: 'en',
    image: guide.heroImage,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      '@type': 'Organization',
      name: guide.author.name,
      description: `${guide.author.role} — ${guide.author.agency}`,
      url: `${SITE_URL}/en/about`,
    },
    publisher: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
      logo: `${SITE_URL}/logo-slaac.png`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/en/guides/${guide.slug}`,
    },
  };

  // Schema.org FAQPage if FAQ entries exist
  const faqSchema =
    guide.practicalFaq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.practicalFaq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* JSON-LD Schema.org Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        {/* Hero Section */}
        <article className="pb-16">
          <header className="relative bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800">
            <div className="container mx-auto max-w-4xl px-4">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/en' },
                  { label: 'Travel Guides', href: '/en/guides' },
                  { label: guide.title, href: `/en/guides/${guide.slug}` },
                ]}
                className="text-slate-300 mb-6"
              />

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="gold" className="text-xs font-semibold uppercase tracking-wider">
                  {guide.category}
                </Badge>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Updated on {new Date(guide.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white leading-tight mb-6">
                {guide.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance mb-8">
                {guide.excerpt}
              </p>

              {/* Author E-E-A-T Reassurance */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slaac-gold-500/20 text-slaac-gold-400 flex items-center justify-center font-bold text-sm shrink-0 border border-slaac-gold-500/30">
                    SV
                  </div>
                  <div>
                    <div className="font-semibold text-white">{guide.author.name}</div>
                    <div className="text-slate-400 text-xs">{guide.author.role} • {guide.author.agency}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-full shrink-0">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified on {guide.verifiedAt}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Hero Image */}
          <div className="container mx-auto max-w-4xl px-4 -mt-6 sm:-mt-8 mb-12">
            <div className="relative h-64 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <Image
                src={guide.heroImage}
                alt={guide.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Article Body */}
          <div className="container mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Editorial Content */}
              <div className="lg:col-span-8 space-y-10">
                {guide.sections.map((section, idx) => (
                  <section key={idx} className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-headline pt-2 border-b border-slate-100 pb-3">
                      {section.heading}
                    </h2>
                    <p className="text-slate-700 leading-relaxed text-base sm:text-lg">
                      {section.content}
                    </p>

                    {section.subsections && (
                      <div className="space-y-4 pt-2">
                        {section.subsections.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                              {sub.subheading}
                            </h3>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                              {sub.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}

                {/* Practical FAQ */}
                {guide.practicalFaq.length > 0 && (
                  <section className="pt-8 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                      <HelpCircle className="w-6 h-6 text-slaac-gold-600" />
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-headline">
                        Frequently Asked Questions
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {guide.practicalFaq.map((faq, fIdx) => (
                        <Card key={fIdx} className="border-slate-200 bg-white">
                          <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-start gap-2">
                              <span className="text-slaac-gold-600 font-headline text-lg">Q.</span>
                              <span>{faq.question}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-1 text-slate-600 text-sm leading-relaxed">
                            {faq.answer}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Official Sources & Regulatory References */}
                {guide.officialSources.length > 0 && (
                  <section className="pt-8 border-t border-slate-200">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                        <FileCheck2 className="w-4 h-4 text-slate-600" />
                        Official Sources & Consulted References
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                        {guide.officialSources.map((source, srcIdx) => (
                          <li key={srcIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60 last:border-0">
                            <div>
                              <span className="font-semibold text-slate-800">{source.title}</span>
                              <p className="text-slate-500 text-xs">{source.note}</p>
                            </div>
                            <div className="text-xs text-slate-400 shrink-0">
                              Verified {source.verifiedDate}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar: CTA & Contextual Reassurance */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="sticky top-24 space-y-6">
                  {/* Contextual Action Card */}
                  <Card className="border-slaac-gold-300 shadow-md bg-gradient-to-b from-white to-slate-50">
                    <CardHeader className="p-5 pb-3">
                      <Badge variant="gold" className="w-fit mb-2 text-[10px]">
                        Related Service
                      </Badge>
                      <CardTitle className="text-lg font-bold text-slate-900 font-headline">
                        {guide.relatedService.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Need bespoke arrangements, executive VIP vehicles, or a customized travel quote? Our Dakar advisors respond within 24 hours.
                      </p>

                      <QuoteRequestButton
                        variant="gold"
                        size="default"
                        className="w-full justify-center"
                        locale="en"
                        defaultService={guide.relatedService.serviceSlug as any}
                        defaultDestination={guide.relatedService.destination}
                        source={`guide-en-${guide.slug}`}
                      >
                        <Send className="w-4 h-4 mr-2" /> {guide.relatedService.ctaText}
                      </QuoteRequestButton>

                      <div className="pt-3 border-t border-slate-200/80 text-center">
                        <Link
                          href={guide.relatedService.href}
                          className="text-xs font-semibold text-slate-700 hover:text-slaac-gold-600 transition-colors inline-flex items-center gap-1"
                        >
                          Learn more about this service &rarr;
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Local Dakar Office Card */}
                  <Card className="border-slate-200 bg-white">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Building2 className="w-4 h-4 text-slaac-gold-600" />
                        <span>SLAAC Voyages Dakar Office</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Rue Mouhamed 5, Immeuble Djolof Chicken, 3rd Floor, Dakar Plateau, Senegal.
                      </p>
                      <div className="text-xs font-semibold text-slate-700">
                        Phone assistance: <a href="tel:+221773129090" className="hover:text-slaac-gold-600">+221 77 312 90 90</a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back to Guides link */}
                  <div>
                    <Button asChild variant="outline" size="sm" className="w-full justify-center border-slate-300">
                      <Link href="/en/guides">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all practical guides
                      </Link>
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
