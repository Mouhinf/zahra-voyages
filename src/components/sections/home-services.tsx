import { Plane, Package, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: <Plane className="h-8 w-8 text-primary" />,
    title: 'Billetterie Aérienne',
    description: "Réservez vos vols vers toutes les destinations du monde aux meilleurs tarifs.",
  },
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: 'Packages sur Mesure',
    description: "Des séjours conçus spécialement pour vous, incluant vol, hôtel et activités.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Assistance Visas & Assurance',
    description: "Simplifiez vos démarches et partez l'esprit tranquille grâce à nos services.",
  },
];

export default function HomeServices() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Des Services Complets pour un Voyage Parfait</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            SLAAC Voyages s'occupe de chaque détail pour vous garantir une expérience fluide et mémorable.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
             <Card key={service.title} className="text-center flex flex-col items-center p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  {service.icon}
                </div>
                <CardHeader className="p-0">
                  <CardTitle className="text-xl font-semibold text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link href="/services">
                <Button size="lg" variant="default">
                    Découvrir tous nos services <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
