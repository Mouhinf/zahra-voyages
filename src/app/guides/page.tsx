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
import { guidesData } from '@/data/guides';
import { Clock, BookOpen, ArrowRight, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Guides pratiques & Conseils voyage à Dakar | SLAAC Voyages',
  description: "Guides pratiques rédigés par l'équipe SLAAC Voyages : formalités de visas, arrivée aéroport AIBD, visites de Gorée, quartiers de Dakar et préparation Omra.",
  alternates: {
    canonical: '/guides',
    languages: {
      fr: '/guides',
      en: '/en/guides',
      'x-default': '/guides',
    },
  },
  openGraph: {
    title: 'Guides pratiques & Conseils voyage au Sénégal | SLAAC Voyages',
    description: "Conseils d'experts locaux à Dakar : transferts aéroport, formalités consulaires, hébergements vérifiés et excursions au Sénégal.",
    url: '/guides',
    type: 'website',
  },
};

const categories = [
  'Tous les guides',
  'Arrivée & Séjour',
  'Destinations Sénégal',
  'Mobilité Internationale',
  'Pèlerinage',
  'Affaires & Entreprise',
] as const;

export default function GuidesPage() {
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides pratiques et conseils voyage SLAAC Voyages',
    url: `${SITE_URL}/guides`,
    description: "Guides et recommandations pratiques pour organiser vos voyages au Sénégal et à l'international.",
    publisher: {
      '@type': 'TravelAgency',
      name: 'SLAAC Voyages',
      url: SITE_URL,
    },
    hasPart: guidesData.map((g) => ({
      '@type': 'Article',
      headline: g.title,
      url: `${SITE_URL}/guides/${g.slug}`,
      datePublished: g.publishedAt,
      dateModified: g.updatedAt,
    })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Schéma JSON-LD CollectionPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        />

        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white py-16 md:py-20 overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <Breadcrumbs
              items={[{ label: 'Guides & Conseils', href: '/guides' }]}
              className="text-slate-300 mb-6"
            />
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slaac-gold-500/20 text-slaac-gold-400 border border-slaac-gold-500/30 mb-4">
                <BookOpen className="w-3.5 h-3.5" /> Centre de Conseils Pratiques
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-headline text-white mb-4">
                L’expertise du voyage à Dakar, partagée sans détour
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
                Des guides vérifiés, rédigés par les conseillers de notre agence à Dakar Plateau. Formalités de visa, logistique AIBD, choix des hébergements et pèlerinages : retrouvez des informations fiables et mises à jour.
              </p>
            </div>
          </div>
        </section>

        {/* Réassurance Déontologique */}
        <section className="bg-slate-50 border-b border-slate-200/80 py-4">
          <div className="container mx-auto max-w-6xl px-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Contenus rédigés par l'équipe locale de SLAAC Voyages à Dakar Plateau</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slaac-gold-600 shrink-0" />
              <span>Informations consulaires & réglementaires vérifiées sur sources officielles</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Dernière révision éditoriale : Octobre 2026</span>
            </div>
          </div>
        </section>

        {/* Grille des Guides */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-headline">Tous nos dossiers pratiques</h2>
                <p className="text-sm text-slate-500 mt-1">Sélectionnez un guide pour préparer votre séjour ou vos démarches</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {guidesData.map((guide) => (
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
                      <span>Vérifié en {new Date(guide.verifiedAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-slaac-gold-600 transition-colors mb-3 line-clamp-2">
                      <Link href={`/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-grow">
                      {guide.excerpt}
                    </p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <span className="text-xs text-slate-500 font-medium truncate max-w-[170px]">
                        {guide.author.agency}
                      </span>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slaac-navy-900 group-hover:text-slaac-gold-600 transition-colors"
                      >
                        Lire le guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bannière d'Assistance Commerciale */}
        <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-headline mb-3 text-white">
              Un projet de voyage spécifique ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
              Nos conseillers à l’agence de Dakar Plateau sont à votre disposition pour établir une proposition sur mesure sous 24 heures.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <QuoteRequestButton variant="gold" size="lg" source="guides-hub-bottom">
                <Send className="w-4 h-4 mr-2" /> Demander un devis personnalisé
              </QuoteRequestButton>
              <Button asChild variant="outline" size="lg" className="border-slate-700 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">Contacter notre agence à Dakar</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
