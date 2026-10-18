import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import TransportGrid from '@/components/sections/transport-grid';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { fetchPublicCollection } from '@/lib/public-data';
import { fetchPageContent } from '@/lib/page-content';
import type { Transport } from '@/types';
import { Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPageContent('transport');
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: '/transport' },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: '/transport',
      images: content.hero.image ? [{ url: content.hero.image, width: 1200, height: 630, alt: content.hero.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function TransportPage() {
  const [transportItems, content] = await Promise.all([
    fetchPublicCollection<Transport>('transports'),
    fetchPageContent('transport'),
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
          <Breadcrumbs items={[{ label: 'Transport & Navette AIBD' }]} />
        </div>

        {/* Grille des tarifs officiels et garanties de ponctualité AIBD */}
        <section className="py-12 bg-white border-b border-slate-200/80">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl mb-8">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slaac-gold-600">
                Tarification Transparente
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline mt-1">
                Forfaits Navettes Aéroport Blaise Diagne (AIBD)
              </h2>
              <div className="w-16 h-0.5 bg-slaac-gold-500 my-3" />
              <p className="text-sm sm:text-base text-slate-600">
                Tarifs fixes et tout compris : péage autoroutier inclus, accueil nominatif avec pancarte en sortie de terminal et suivi de vol en direct.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Forfait 1 */}
              <div className="card-premium p-5 flex flex-col justify-between border-slaac-gold-300 bg-amber-50/20">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AIBD ⇄ Dakar Centre</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slaac-gold-100 text-slaac-gold-800">Populaire</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Plateau · Médina · Fann</h3>
                  <div className="text-2xl font-extrabold text-slaac-navy-900 mb-2">30 000 FCFA <span className="text-xs font-normal text-slate-500">(~46 €)</span></div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <li>✓ Péage autoroute inclus</li>
                    <li>✓ Berline climatisée 3 places</li>
                    <li>✓ Accueil pancarte nominative</li>
                  </ul>
                </div>
                <QuoteRequestButton variant="gold" size="sm" defaultService="transport" defaultDestination="AIBD - Dakar Plateau" className="w-full">
                  Réserver ce trajet
                </QuoteRequestButton>
              </div>

              {/* Forfait 2 */}
              <div className="card-premium p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AIBD ⇄ Almadies</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Almadies · Ngor · Ouakam</h3>
                  <div className="text-2xl font-extrabold text-slaac-navy-900 mb-2">35 000 FCFA <span className="text-xs font-normal text-slate-500">(~53 €)</span></div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <li>✓ Péage autoroute inclus</li>
                    <li>✓ Berline grand confort</li>
                    <li>✓ Bouteille d'eau fraîche & Wi-Fi</li>
                  </ul>
                </div>
                <QuoteRequestButton variant="gold" size="sm" defaultService="transport" defaultDestination="AIBD - Almadies" className="w-full">
                  Réserver ce trajet
                </QuoteRequestButton>
              </div>

              {/* Forfait 3 */}
              <div className="card-premium p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AIBD ⇄ Petite Côte</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Saly · Somone · Mbour</h3>
                  <div className="text-2xl font-extrabold text-slaac-navy-900 mb-2">35 000 FCFA <span className="text-xs font-normal text-slate-500">(~53 €)</span></div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <li>✓ Péage autoroute inclus</li>
                    <li>✓ Transfert balnéaire direct</li>
                    <li>✓ Siège enfant sur demande</li>
                  </ul>
                </div>
                <QuoteRequestButton variant="gold" size="sm" defaultService="transport" defaultDestination="AIBD - Saly" className="w-full">
                  Réserver ce trajet
                </QuoteRequestButton>
              </div>

              {/* Forfait 4 */}
              <div className="card-premium p-5 flex flex-col justify-between bg-slate-50">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mise à Disposition</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">Journée</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Berline avec Chauffeur</h3>
                  <div className="text-2xl font-extrabold text-slaac-navy-900 mb-2">60 000 FCFA <span className="text-xs font-normal text-slate-500">(~90 €)</span></div>
                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <li>✓ 8h consécutives intra-Dakar</li>
                    <li>✓ Carburant inclus</li>
                    <li>✓ Chauffeur professionnel dédié</li>
                  </ul>
                </div>
                <QuoteRequestButton variant="gold" size="sm" defaultService="transport" defaultDestination="Mise à disposition journée Dakar" className="w-full">
                  Réserver la journée
                </QuoteRequestButton>
              </div>
            </div>

            {/* Bandeau de réassurance vol retardé */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-emerald-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span><strong>Garantie Vol Retardé :</strong> Nous suivons l'état de votre vol en temps réel. Zéro supplément de tarif en cas de retard de votre avion.</span>
              </div>
              <a
                href="https://wa.me/221773129090?text=Bonjour%20SLAAC%20Voyages%2C%20je%20souhaite%20r%C3%A9server%20un%20transfert%20a%C3%A9roport%20AIBD."
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-semibold underline text-emerald-900 hover:text-emerald-700"
              >
                Réserver immédiatement sur WhatsApp →
              </a>
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
            <TransportGrid initialItems={transportItems} />
          </div>
        </section>

        {/* Encart Guide Éditorial AIBD */}
        <section className="py-12 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold text-slaac-gold-600 tracking-wider">Conseils Pratiques Aéroport</span>
              <h3 className="text-xl font-bold text-slate-900 font-headline mt-1">
                Guide complet d'arrivée à l'aéroport AIBD (Diass)
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Temps de trajet vers Dakar et Saly selon les heures de pointe, consignes d'accueil à la sortie du terminal et conseils pour éviter les négociations informelles.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-slate-300 hover:border-slaac-gold-500">
              <Link href="/guides/arrivee-aeroport-aibd-dakar-transfert">
                Consulter le guide AIBD &rarr;
              </Link>
            </Button>
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
