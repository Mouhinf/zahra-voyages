import Image from 'next/image';
import { Users, Globe, Heart, Building, Award, Target, Download } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';

const whyUs = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Expertise Personnalisée',
    description: "Notre équipe de passionnés du voyage met son expertise à votre service pour créer des itinéraires sur mesure qui répondent parfaitement à vos envies.",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Accès Global, Service Local',
    description: 'Nous combinons un réseau mondial de partenaires avec une connaissance approfondie du terrain pour vous offrir le meilleur, où que vous alliez.',
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: 'Engagement et Sérénité',
    description: "Votre satisfaction et votre tranquillité d'esprit sont notre priorité. Nous nous occupons de tout, pour que vous n'ayez qu'à profiter.",
  },
];

const companyInfo = [
  {
    icon: <Building className="h-10 w-10 text-primary" />,
    title: 'Notre Histoire',
    description: "Fondée à Dakar, SLAAC Voyages est née d'une passion pour la découverte et le partage. Nous avons commencé avec une petite équipe et une grande vision : rendre le voyage accessible et inoubliable pour tous.",
  },
  {
    icon: <Target className="h-10 w-10 text-primary" />,
    title: 'Notre Mission',
    description: "Notre mission est de transformer vos rêves d'évasion en réalité en concevant des expériences de voyage authentiques, enrichissantes et parfaitement organisées. Nous nous engageons à offrir un service client exceptionnel à chaque étape de votre parcours.",
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Nos Valeurs',
    description: "Nous croyons en l'intégrité, la passion, et l'excellence. Chaque voyage que nous organisons est le reflet de notre engagement à offrir des services de qualité supérieure, tout en respectant les cultures locales et l'environnement.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="py-20 sm:py-28 bg-secondary">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">À propos de nous</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-primary font-headline">Qui Sommes-Nous ?</h1>
            <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
            <p className="text-lg text-secondary-foreground max-w-3xl mx-auto text-balance">
              Découvrez l'histoire, la mission et les valeurs qui font de SLAAC Voyages votre partenaire de confiance pour des aventures mémorables.
            </p>
          </div>
        </section>

        <section id="about" className="py-20 sm:py-28 bg-background">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 lg:h-full min-h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=600&h=800&fit=crop"
                  alt="Globe terrestre et carte du monde"
                  fill
                  className="object-cover"
                  data-ai-hint="world map travel"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Votre Guide pour des Voyages Inoubliables</h2>
                <div className="w-12 h-0.5 bg-accent my-5" />
                <div className="mt-2 text-lg text-muted-foreground space-y-4">
                  <p>
                    SLAAC Voyages est une agence de voyages et de tourisme, basée au Centre ville de Dakar à l'immeuble TRAMES au premier étage, spécialisée dans la vente des billets d'avion pour toutes les destinations, les préinscriptions, l'assistance visa, les réservations d'hôtel, les prises de rendez-vous et le tourisme.
                  </p>
                  <p>
                    Nous proposons une gamme complète de services pour répondre à vos besoins professionnels et touristiques. Notre objectif est de vous offrir le meilleur du tourisme à travers des excursions authentiques, des circuits de voyages à thèmes, des séjours linguistiques, des séjours religieux, les Transferts en VTC ou par la plage.
                  </p>
                  <p>
                    Que vous soyez à la recherche d'aventure, de culture, d'adrénaline, SLAAC Voyages est votre partenaire incontournable pour la réalisation de vos projets. Grace à nos experts, nous mettons au service de nos clients un dispositif d'accompagnement personnalisé, un système de filtrage et des outils de dernière génération afin de leurs garantir les meilleures offres et les billets d'avion les moins chers.
                  </p>
                </div>
                 <div className="mt-8">
                  <a href="/brochure-slaac-voyages.pdf" download>
                    <Button size="lg" variant="default">
                      <Download className="mr-2 h-5 w-5" />
                      Télécharger notre brochure
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 bg-secondary">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">Nos atouts</span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Pourquoi nous choisir ?</h2>
                    <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
                </div>
                 <div className="grid md:grid-cols-3 gap-8">
                  {whyUs.map((item) => (
                    <div key={item.title} className="bg-background p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 border border-border/50">
                      <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-primary font-headline">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
        </section>

        <section className="py-20 sm:py-28 bg-background">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center mb-14">
                    <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">Notre identité</span>
                    <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Plus sur SLAAC Voyages</h2>
                    <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    {companyInfo.map((item) => (
                        <div key={item.title} className="bg-secondary/50 p-10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center border border-border/50">
                            <div className="bg-primary/10 rounded-full p-5 mb-5">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-semibold text-primary mb-3 font-headline">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
