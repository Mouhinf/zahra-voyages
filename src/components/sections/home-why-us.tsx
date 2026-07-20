import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin, Users, Headset, Clock } from 'lucide-react';

const argumentsList = [
  {
    icon: MapPin,
    title: 'Expertise Locale',
    description: "Basés à Dakar, nous connaissons parfaitement le Sénégal et l'Afrique de l'Ouest. Nous vous ouvrons les portes des meilleures adresses et des expériences les plus authentiques.",
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d68?w=600&h=400&fit=crop',
  },
  {
    icon: Users,
    title: 'Réseau de Partenaires',
    description: "Hôtels, compagnies aériennes, transporteurs et guides locaux : notre réseau étendu nous permet de négocier les meilleurs tarifs et de garantir la qualité de vos services.",
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop',
  },
  {
    icon: Headset,
    title: 'Accompagnement Personnalisé',
    description: "Un interlocuteur dédié à votre écoute, de la conception à votre retour. Chaque itinéraire est pensé sur mesure selon vos envies, votre rythme et votre budget.",
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop',
  },
  {
    icon: Clock,
    title: 'Réactivité Garantie',
    description: "Une question, un imprévu ? Notre équipe répond sous 24h, 7j/7. Vous voyagez en toute sérénité, où que vous soyez dans le monde.",
    image: 'https://images.unsplash.com/photo-1501139081373-635b7ae4d5b8?w=600&h=400&fit=crop',
  },
];

export default function HomeWhyUs() {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary/60">Nos atouts</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary font-headline">Pourquoi Choisir SLAAC Voyages ?</h2>
          <div className="w-16 h-0.5 bg-accent mx-auto my-5" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Quatre bonnes raisons de nous confier l'organisation de votre prochain voyage.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {argumentsList.map((arg) => {
            const Icon = arg.icon;
            return (
              <Card key={arg.title} className="overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow p-0">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={arg.image}
                    alt={arg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-primary mb-2">{arg.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{arg.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
