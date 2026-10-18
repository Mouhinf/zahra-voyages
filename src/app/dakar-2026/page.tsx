import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Plane, Hotel, Car, Users, ExternalLink, Info, ShieldCheck, Quote } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumbs from '@/components/seo/breadcrumbs';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FaqSection from '@/components/sections/faq-section';

export const metadata: Metadata = {
  title: 'Séjour Dakar fin 2026 : transferts AIBD & hébergements | SLAAC Voyages',
  description: "Logistique des séjours et délégations à Dakar, Diamniadio et Saly fin 2026 : flottes privées AIBD, résidences sécurisées et excursions avec SLAAC Voyages.",
  alternates: { canonical: '/dakar-2026' },
  openGraph: {
    title: 'Séjour Dakar fin 2026 : transferts AIBD & hébergements | SLAAC Voyages',
    description: "Organisation de séjours et logistique d'accueil au Sénégal fin 2026 avec l'agence locale SLAAC Voyages.",
    url: '/dakar-2026',
  },
};

// Page éditoriale : information factuelle sur l'événement + offres SLAAC clairement séparées.
// Aucune affiliation : SLAAC Voyages n'est ni partenaire ni revendeur officiel de l'événement.
// Sources factuelles : olympics.com (site officiel CIO) — dates et villes hôtes vérifiées en octobre 2026.

const HERO_IMG = 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/v1791894558/slaac-voyages/dakar-2026-ceremonie-medailles.png';

const zones = [
  {
    name: 'Dakar',
    description: "La capitale : ambassades, quartiers d'affaires (Plateau, Almadies), ports d'embarquement pour l'île de Gorée, vie culturelle et restaurants. Large choix d'hébergements en ville.",
  },
  {
    name: 'Diamniadio',
    description: "Ville nouvelle en plein développement, à proximité immédiate de l'aéroport international Blaise-Diagne (AIBD). Infrastructures récentes et accès rapide vers Dakar et la Petite Côte.",
  },
  {
    name: 'Saly',
    description: "Station balnéaire historique de la Petite Côte : plages, hôtels en bord de mer, restaurants au bord de l'eau. Environnement idéal pour prolonger le séjour en détente.",
  },
];

const services = [
  {
    icon: Plane,
    title: 'Transfert AIBD',
    description: "Accueil à l'aéroport Blaise-Diagne et transfert privé vers Dakar, Diamniadio ou Saly, avec chauffeur local qui connaît la zone.",
    service: 'transport' as const,
    destination: 'Transfert AIBD — événement Dakar 2026',
    source: 'dakar2026-transfert',
  },
  {
    icon: Hotel,
    title: 'Hébergement sur devis',
    description: "Sélection d'hôtels et résidences à Dakar, Diamniadio et Saly selon votre budget, réservés via nos partenaires locaux.",
    service: 'hebergement' as const,
    destination: 'Hébergement — événement Dakar 2026',
    source: 'dakar2026-hebergement',
  },
  {
    icon: Car,
    title: 'Véhicule avec chauffeur',
    description: 'Location avec chauffeur à la journée : vos déplacements entre Dakar, Diamniadio et Saly sans stress de stationnement ni trafic.',
    service: 'transport' as const,
    destination: 'Véhicule avec chauffeur — événement Dakar 2026',
    source: 'dakar2026-chauffeur',
  },
  {
    icon: Users,
    title: 'Groupes & délégations',
    description: 'Logistique complète pour familles, clubs, entreprises et délégations : navettes, hébergements groupés, coordination sur place.',
    service: 'tourisme-affaires' as const,
    destination: 'Groupe / délégation — événement Dakar 2026',
    source: 'dakar2026-groupe',
  },
];

const faq = [
  {
    question: 'À quelles dates a lieu le grand événement sportif de Dakar en 2026 ?',
    reponse: "Les Jeux Olympiques de la Jeunesse (JOJ) Dakar 2026 se déroulent du 31 octobre au 13 novembre 2026, répartis entre Dakar, Diamniadio et Saly. C'est le premier événement sportif olympique organisé sur le continent africain (source : site officiel olympics.com).",
  },
  {
    question: 'SLAAC Voyages vend-elle des billets pour les compétitions ?',
    reponse: "Non. SLAAC Voyages n'est pas revendeur de billets et n'est affiliée ni aux organisateurs ni au CIO. La billetterie officielle est accessible sur tickets.dakar2026.org. En revanche, nous organisons tout le reste de votre séjour : transferts AIBD, hébergement, véhicule avec chauffeur, excursions et logistique de groupe.",
  },
  {
    question: 'Faut-il un visa pour entrer au Sénégal ?',
    reponse: "Cela dépend de votre nationalité. Les ressortissants de nombreux pays d'Afrique de l'Ouest (CEDEAO) et d'Europe entrent sans visa pour un séjour touristique court. Vérifiez impérativement les conditions applicables à votre nationalité auprès de l'ambassade du Sénégal de votre pays avant de réserver. Votre passeport doit être valide plusieurs mois après la date de retour prévue.",
  },
  {
    question: 'Où loger : Dakar, Diamniadio ou Saly ?',
    reponse: "Tout dépend de votre priorité : Dakar pour la vie urbaine et culturelle, Diamniadio pour la proximité immédiate de l'AIBD et des infrastructures récentes, Saly pour la plage et la détente. Les temps de trajet varient fortement avec le trafic — comptez en moyenne 45 min à 1 h entre l'AIBD et le centre de Dakar, et 30 à 45 min entre l'AIBD et Saly (estimations). Nous vous conseillons selon votre programme : demandez un devis.",
  },
  {
    question: 'Peut-on visiter le Sénégal avant ou après les compétitions ?',
    reponse: "Oui, et c'est même recommandé : Gorée, le Lac Rose, la réserve de Bandia, le Sine-Saloum ou la Casamance se visitent très bien en extension de séjour. Nos circuits et excursions fonctionnent toute l'année, indépendamment de l'événement.",
  },
];

export default function Dakar2026Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative h-[45vh] min-h-[340px] flex items-center justify-center text-white overflow-hidden">
          <Image src={HERO_IMG} alt="Cérémonie des médailles Dakar 2026 au coucher du soleil" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/65 to-primary/85 z-10" />
          <div className="relative z-20 text-center px-4 max-w-3xl">
            <span className="inline-block glass-dark px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
              Dakar · Diamniadio · Saly — 31 oct. → 13 nov. 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg font-headline">
              Préparez votre séjour à Dakar fin 2026
            </h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md text-balance">
              Un événement sportif mondial, premier du genre en Afrique. Transferts, hébergements, excursions et logistique de groupe : votre agence locale s'occupe de tout le reste.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-5xl px-4 pt-4">
          <Breadcrumbs items={[{ label: 'Séjour Dakar fin 2026' }]} />
        </div>

        {/* Avertissement légal — distinguo information / commercial */}
        <section aria-label="Mention d'indépendance" className="border-b bg-secondary/60">
          <div className="container mx-auto max-w-5xl px-4 py-4">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Information indépendante.</strong> SLAAC Voyages n'est ni partenaire, ni sponsor, ni revendeur officiel de Dakar 2026. Cette page informe sur l'événement et propose nos propres services de voyage, vendus séparément de toute billetterie officielle.
              </span>
            </p>
          </div>
        </section>

        {/* L'événement : faits vérifiés */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline text-center">L'Essentiel en Bref</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: CalendarDays, titre: 'Dates', texte: 'Du 31 octobre au 13 novembre 2026 — 14 jours de compétition.' },
                { icon: MapPin, titre: 'Trois zones hôtes', texte: 'Dakar, Diamniadio et Saly accueillent les épreuves.' },
                { icon: Users, titre: '~2 700 athlètes', texte: 'Jeunes athlètes (14–17 ans) de plus de 200 pays attendus.' },
                { icon: ShieldCheck, titre: 'Premier en Afrique', texte: "Premier événement sportif olympique organisé sur le continent africain." },
              ].map((f) => (
                <Card key={f.titre} className="text-center p-6 shadow-md border-border/50">
                  <CardContent className="p-0">
                    <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-primary">{f.titre}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{f.texte}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sources officielles :{' '}
              <a href="https://www.olympics.com/cio/dakar-2026" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 inline-flex items-center gap-1">
                olympics.com/cio/dakar-2026 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>{' '}
              ·{' '}
              <a href="https://tickets.dakar2026.org/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 inline-flex items-center gap-1">
                billetterie officielle tickets.dakar2026.org <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>

        {/* Les trois zones */}
        <section className="py-16 sm:py-20 bg-secondary">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Où Séjourner ?</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Chaque zone a ses atouts. Les temps de trajet sont des estimations variables selon le trafic.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {zones.map((z) => (
                <Card key={z.name} className="shadow-md hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-primary font-headline">{z.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-sm">{z.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/destinations">Explorer nos destinations au Sénégal</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services SLAAC — section commerciale clairement identifiée */}
        <section id="services-sejour" className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">Services SLAAC Voyages</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Votre Séjour, Sans Logistique</h2>
              <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Ces prestations sont vendues par SLAAC Voyages, indépendamment de l'événement. Tarif personnalisé sur devis, réponse sous 24 h.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Card key={s.title} className="flex flex-col shadow-md hover:shadow-lg transition-shadow border-border/50">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold text-primary">{s.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">{s.description}</p>
                      <div className="mt-4">
                        <QuoteRequestButton
                          defaultService={s.service}
                          defaultDestination={s.destination}
                          source={s.source}
                          variant="gold"
                          className="w-full sm:w-auto"
                        >
                          <Quote className="mr-2 h-4 w-4" /> Demander un devis
                        </QuoteRequestButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Les billets d'entrée aux compétitions ne sont pas inclus dans nos prestations : achetez-les uniquement sur la plateforme officielle (lien ci-dessus).
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection
          title="Questions fréquentes — séjour Dakar 2026"
          subtitle="Informations vérifiées en octobre 2026. Les formalités d'entrée évoluant, vérifiez toujours auprès de votre ambassade."
          items={faq}
        />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.reponse },
            })),
          }),
        }}
      />
    </div>
  );
}
