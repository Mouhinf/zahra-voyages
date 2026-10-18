import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import TourismeGrid from '@/components/sections/tourisme-grid';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { fetchPublicCollection } from '@/lib/public-data';
import { fetchPageContent } from '@/lib/page-content';
import type { OffreAffaires } from '@/types';
import { Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPageContent('tourisme-affaires');
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: '/tourisme-affaires' },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: '/tourisme-affaires',
      images: content.hero.image ? [{ url: content.hero.image, width: 1200, height: 630, alt: content.hero.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function TourismeAffairesPage() {
  const [tourismeItems, content] = await Promise.all([
    fetchPublicCollection<OffreAffaires>('offresAffaires'),
    fetchPageContent('tourisme-affaires'),
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
          <Breadcrumbs items={[{ label: "Tourisme d'Affaires & MICE" }]} />
        </div>

        <section className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">{content.gridSection.badge}</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">{content.gridSection.title}</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                {content.gridSection.description}
              </p>
            </div>
            <TourismeGrid initialItems={tourismeItems} />
          </div>
        </section>

        {/* Garanties Corporate B2B & Délégations */}
        <section className="py-12 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs uppercase font-bold text-slaac-gold-600 tracking-wider">Services Corporate Dédiés</span>
              <h3 className="text-2xl font-bold text-slate-900 font-headline mt-1">
                La garantie d'une logistique d'entreprise sans accroc à Dakar
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xl mb-2">📑</div>
                <h4 className="text-base font-bold text-slate-900 mb-1 font-headline">Facturation d'Entreprise</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Factures conformes aux normes sénégalaises (TVA, NINEA, RCCM), paiements par virement bancaire et conventions de compte pour les missions régulières.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xl mb-2">🚘</div>
                <h4 className="text-base font-bold text-slate-900 mb-1 font-headline">Flottes & Chauffeurs VIP</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Berlines haut de gamme et vans VIP avec chauffeurs professionnels bilingues, habitués aux exigences protocolaires des délégations et conférences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xl mb-2">👤</div>
                <h4 className="text-base font-bold text-slate-900 mb-1 font-headline">Chargé de Compte Unique</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Un interlocuteur dédié basé à Dakar Plateau, joignable directement pour ajuster les plannings et les réservations en temps réel.
                </p>
              </div>
            </div>

            {/* Encart Guide Mobilité Asie / Chine */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold text-slaac-gold-400 tracking-wider">Guide d'Affaires International</span>
                <h4 className="text-xl font-bold font-headline text-white mt-1">
                  Déplacements professionnels et sourcing commercial en Chine
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Préparez vos missions commerciales à Canton, Yiwu ou Shanghai : démarches du visa M, documents indispensables et optimisation des vols.
                </p>
              </div>
              <Link
                href="/guides/voyage-affaires-chine-depuis-dakar"
                className="shrink-0 inline-flex items-center px-4 py-2.5 rounded-lg bg-slaac-gold-500 hover:bg-slaac-gold-600 text-slate-950 font-bold text-xs transition-colors"
              >
                Lire le guide Chine Affaires &rarr;
              </Link>
            </div>
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
      </main>
      <Footer />
    </div>
  );
}
