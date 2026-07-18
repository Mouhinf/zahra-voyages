import Image from 'next/image';
import { Users, Globe, Heart } from 'lucide-react';

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

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 lg:h-full min-h-[400px] w-full rounded-lg overflow-hidden shadow-lg order-last lg:order-first">
            <Image
              src="https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=600&h=800&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Notre équipe ou agence"
              fill
              className="object-cover"
              data-ai-hint="happy travelers"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Votre Partenaire de Confiance pour des Voyages Inoubliables</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Chez SLAAC Voyages, nous croyons que chaque voyage est une histoire unique. Depuis notre base à Dakar, nous nous engageons à transformer vos rêves d'évasion en réalité, en concevant des expériences de voyage authentiques et mémorables.
            </p>
            <div className="mt-8 space-y-6">
              {whyUs.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                    <p className="mt-1 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
