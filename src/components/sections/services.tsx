import { Plane, Package, ShieldCheck, FileText, Map, Hotel, Globe, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const services = [
  {
    title: 'Tourisme',
    icon: <Globe className="h-8 w-8 text-primary" />,
    items: [
      {
        icon: <Plane className="h-6 w-6 text-primary" />,
        title: 'Billetterie Aérienne',
        description: "Réservez vos vols vers toutes les destinations du monde aux meilleurs tarifs. Nous trouvons pour vous les options les plus rapides et économiques.",
      },
      {
        icon: <Package className="h-6 w-6 text-primary" />,
        title: 'Packages sur Mesure',
        description: "Des séjours conçus spécialement pour vous. Que vous voyagiez seul, en couple ou en groupe, nous créons le package parfait (vol + hôtel + activités).",
      },
      {
        icon: <ShieldCheck className="h-6 w-6 text-primary" />,
        title: 'Assurance Voyage',
        description: "Partez l'esprit tranquille. Nous vous proposons des assurances complètes pour vous couvrir contre tous les imprévus (santé, annulation, bagages).",
      },
      {
        icon: <FileText className="h-6 w-6 text-primary" />,
        title: 'Assistance Visas',
        description: "Simplifiez vos démarches administratives. Notre équipe d'experts vous accompagne pas à pas dans l'obtention de vos visas.",
      },
      {
        icon: <Hotel className="h-6 w-6 text-primary" />,
        title: 'Réservation d\'Hôtels',
        description: "Accédez à une sélection d'hébergements de qualité partout dans le monde, négociés aux meilleurs prix pour votre confort.",
      },
      {
        icon: <Map className="h-6 w-6 text-primary" />,
        title: 'Circuits et Excursions',
        description: "Explorez la culture locale avec nos circuits organisés. Découvrez des sites incontournables et des trésors cachés au Sénégal et à l'étranger.",
      },
    ]
  },
  {
    title: 'Assistance importation et exportation',
    icon: <FileText className="h-8 w-8 text-primary" />, // Example icon, choose a relevant one
    items: [
      {
        icon: <FileText className="h-6 w-6 text-primary" />, // Example icon
        title: 'Formalités Douanières',
        description: "Nous gérons les procédures douanières pour simplifier vos échanges commerciaux internationaux.",
      },
      {
        icon: <Package className="h-6 w-6 text-primary" />, // Example icon
        title: 'Logistique et Transport',
        description: "Organisation du transport et de la logistique pour vos marchandises.",
      },
    ]
  },
  {
    title: 'Location et ventes de véhicule',
    icon: <Car className="h-8 w-8 text-primary" />, // Example icon, choose a relevant one
    items: [
      {
        icon: <Car className="h-6 w-6 text-primary" />, // Example icon
        title: 'Vente et location de véhicules',
        description: "Nous proposons une gamme de véhicules à la vente et à la location, adaptés à vos besoins.",
      },
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">Des Services Complets pour un Voyage Parfait</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            De la réservation de votre billet d'avion à l'organisation de vos activités sur place, SLAAC Voyages s'occupe de chaque détail pour vous garantir une expérience fluide et mémorable.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((category, index) => (
            <Card key={index} className="flex flex-col p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center p-0 mb-4">
                <div className="bg-primary/10 rounded-full p-4 mr-4">
                  {category.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-primary">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2 flex-grow">
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                      <AccordionTrigger className="flex items-center text-left py-3">
                        <div className="mr-3">{item.icon}</div>
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pl-9">
                        {item.description}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
