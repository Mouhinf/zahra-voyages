import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Headset, Clock } from 'lucide-react';

const argumentsList = [
  {
    icon: MapPin,
    title: 'Expertise Locale',
    description: "Basés à Dakar, nous connaissons parfaitement le Sénégal et l'Afrique de l'Ouest. Nous vous ouvrons les portes des meilleures adresses et des expériences les plus authentiques.",
  },
  {
    icon: Users,
    title: 'Réseau de Partenaires',
    description: "Hôtels, compagnies aériennes, transporteurs et guides locaux : notre réseau étendu nous permet de négocier les meilleurs tarifs et de garantir la qualité de vos services.",
  },
  {
    icon: Headset,
    title: 'Accompagnement Personnalisé',
    description: "Un interlocuteur dédié à votre écoute, de la conception à votre retour. Chaque itinéraire est pensé sur mesure selon vos envies, votre rythme et votre budget.",
  },
  {
    icon: Clock,
    title: 'Réactivité Garantie',
    description: "Une question, un imprévu ? Notre équipe répond sous 24h, 7j/7. Vous voyagez en toute sérénité, où que vous soyez dans le monde.",
  },
];

export default function HomeWhyUs() {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Pourquoi Choisir SLAAC Voyages ?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Quatre bonnes raisons de nous confier l'organisation de votre prochain voyage.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {argumentsList.map((arg) => {
            const Icon = arg.icon;
            return (
              <Card key={arg.title} className="flex flex-col items-center text-center p-6 h-full shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-primary mb-2">{arg.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{arg.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
