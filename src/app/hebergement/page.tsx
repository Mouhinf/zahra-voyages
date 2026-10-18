import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import HebergementGrid from '@/components/sections/hebergement-grid';
import FaqSection from '@/components/sections/faq-section';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { fetchPublicCollection } from '@/lib/public-data';
import { fetchPageContent } from '@/lib/page-content';
import type { Hebergement } from '@/types';
import { Send } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPageContent('hebergement');
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: '/hebergement' },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: '/hebergement',
      images: content.hero.image ? [{ url: content.hero.image, width: 1200, height: 630, alt: content.hero.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function HebergementPage() {
  const [hebergementItems, content] = await Promise.all([
    fetchPublicCollection<Hebergement>('hebergements'),
    fetchPageContent('hebergement'),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={content.hero.image} alt={content.hero.title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              {content.hero.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">{content.hero.title}</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              {content.hero.subtitle}
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Hébergements' }]} />
        </div>

        {/* Garanties critiques pour hébergements à Dakar */}
        <section className="py-8 bg-slate-50 border-b border-slate-200/80">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-premium p-4 text-center">
                <div className="text-xl mb-1">⚡</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Groupe Électrogène 24/7</div>
                <div className="text-[11px] text-slate-500">Zéro coupure Senelec</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-xl mb-1">📶</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Fibre Optique Vérifiée</div>
                <div className="text-[11px] text-slate-500">Idéal télétravail & business</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-xl mb-1">💧</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Réserve d'Eau & Surpresseur</div>
                <div className="text-[11px] text-slate-500">Approvisionnement continu</div>
              </div>
              <div className="card-premium p-4 text-center">
                <div className="text-xl mb-1">🛡️</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">Gardiennage & Concierge</div>
                <div className="text-[11px] text-slate-500">Sécurité et assistance 7j/7</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">{content.gridSection.badge}</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">{content.gridSection.title}</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                {content.gridSection.description}
              </p>
            </div>
            <HebergementGrid initialItems={hebergementItems} />
          </div>
        </section>

        <section className="py-20 bg-secondary text-center">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">{content.ctaSection.title}</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-muted-foreground text-lg text-balance">{content.ctaSection.description}</p>
            <div className="mt-8">
              <QuoteRequestButton size="lg"><Send className="mr-2 h-4 w-4" /> Demander un devis</QuoteRequestButton>
            </div>
          </div>
        </section>

        {content.faq && content.faq.items.length > 0 && (
          <FaqSection
            title={content.faq.title}
            subtitle={content.faq.subtitle}
            items={content.faq.items}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
