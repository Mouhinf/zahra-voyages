'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, Eye, Info, Plane, PlaneTakeoff, Waves, Car, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '221775396325';

type VehicleCategory = {
  key: string;
  label: string;
  description: string;
  image: string;
  capacity: string;
  useCase: string;
};

const VEHICULES: VehicleCategory[] = [
  {
    key: 'berline',
    label: 'Berline',
    description: 'Véhicule élégant et confortable, idéal pour vos déplacements professionnels et urbains. Climatisation, sièges cuir, espace généreux.',
    image: '/mercedese.avif',
    capacity: '3 à 4 passagers',
    useCase: 'Parfait pour les transferts d\'affaires, les déplacements en ville et les rendez-vous professionnels.',
  },
  {
    key: 'minibus',
    label: 'Minibus',
    description: 'Minibus spacieux et climatisé pour vos voyages en groupe. Confort optimal pour les trajets interurbains et les excursions familiales.',
    image: '/toyotahiace.webp',
    capacity: '8 à 14 passagers',
    useCase: 'Idéal pour les excursions en groupe, les transferts de groupe et les événements familiaux.',
  },
  {
    key: 'bus',
    label: 'Bus',
    description: 'Bus grand confort pour le transport de groupes nombreux. Climatisation, sièges inclinables et coffre à bagages spacieux.',
    image: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/bus-autocar',
    capacity: '20 à 40 passagers',
    useCase: 'Parfait pour les séminaires, les excursions de groupe, les mariages et les événements d\'entreprise.',
  },
  {
    key: '4x4',
    label: '4x4',
    description: 'Véhicule tout-terrain robuste et puissant pour l\'aventure sénégalaise. Parfait pour explorer les régions les plus reculées en toute sécurité.',
    image: '/fortuner.png',
    capacity: '4 à 6 passagers',
    useCase: 'Idéal pour les circuits en Casamance, le Safari au Bandia, le Lac Rose et les pistes du Sahel.',
  },
  {
    key: 'suv',
    label: 'SUV',
    description: 'SUV moderne et polyvalent alliant confort et prestance. Véhicule premium pour des déplacements en tous genres avec une touche d\'élégance.',
    image: '/toyotarav4.webp',
    capacity: '4 à 5 passagers',
    useCase: 'Recommandé pour les circuits touristiques, les transferts VIP et les escapades en famille.',
  },
];

type Offre = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  tag: string;
  type: string;
  disponible?: boolean;
};

const CATEGORIES = [
  { key: 'billet_avion', label: 'Billets d\'avion', icon: Plane, description: 'Vols vers toutes les destinations du monde' },
  { key: 'transfert_aeroport', label: 'Transfert Aéroport', icon: PlaneTakeoff, description: 'Transferts aller-retour vers l\'aéroport' },
  { key: 'transfert_plage', label: 'Transfert par la plage', icon: Waves, description: 'Transferts côtiers et balnéaires' },
  { key: 'location_voiture', label: 'Location de voiture (avec chauffeur)', icon: Car, description: 'Véhicules avec chauffeur professionnel' },
];

export default function TransportGrid() {
  const [items, setItems] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('billet_avion');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const q = query(collection(getDbInstance(), 'transports'), orderBy('ordre', 'asc'));
        const snap = await getDocs(q);
        const data: Offre[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data() as Omit<Offre, 'id'>;
          if (d.disponible !== false) data.push({ id: docSnap.id, ...d });
        });
        if (mounted) {
          setItems(data);
          const firstWithItems = CATEGORIES.find((c) => data.some((d) => d.type === c.key));
          if (firstWithItems) setActiveCategory(firstWithItems.key);
        }
      } catch (e) {
        console.error('Erreur fetch transports:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredItems = items.filter((item) => item.type === activeCategory);
  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      {/* Cartes catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = items.filter((d) => d.type === cat.key).length;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg',
                isActive
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border/50 bg-card hover:border-primary/30'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className={cn('text-xl font-semibold font-headline', isActive ? 'text-primary' : 'text-foreground')}>
                {cat.label}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
              <p className="text-xs font-medium text-primary mt-3">{count} offre{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</p>
            </button>
          );
        })}
      </div>

      <Alert className="mb-8 bg-primary/5 border-primary/20 text-primary">
        <Info className="h-5 w-5" />
        <AlertDescription>
          Les tarifs affichés sont des estimations de départ et peuvent varier selon la saison, la disponibilité et le moment de la réservation. Pour un devis précis, veuillez nous contacter.
        </AlertDescription>
      </Alert>

      {/* Section Véhicules - Location de voiture */}
      {activeCategory === 'location_voiture' && (
        <div className="mb-12">
          <div className="text-center mb-8">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Notre Flotte</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold font-headline text-primary">Choisissez votre véhicule</h2>
            <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Découvrez notre gamme complète de véhicules avec chauffeur professionnel. Chaque véhicule est entretenu avec soin pour votre confort et votre sécurité.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {VEHICULES.map((vehicule) => (
              <Card key={vehicule.key} className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={vehicule.image}
                    alt={vehicule.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (!t.dataset.fb) {
                        t.dataset.fb = '1';
                        t.src = '/logo-slaac.png';
                      }
                    }}
                  />
                  <Badge variant="default" className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">{vehicule.capacity}</Badge>
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold font-headline text-primary">{vehicule.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{vehicule.useCase}</p>
                  <p className="text-sm text-foreground mt-2 flex-grow">{vehicule.description}</p>
                  <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-border/50">
                    <QuoteRequestDialog defaultDestination={`Location ${vehicule.label} avec chauffeur`}>
                      <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                        Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </QuoteRequestDialog>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour, je souhaiterais obtenir un devis pour la location d'un ${vehicule.label} avec chauffeur.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                      aria-label={`Demander un devis pour ${vehicule.label} sur WhatsApp`}
                    >
                      <Button variant="outline" size="sm" className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Grille de la catégorie active */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.titre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{item.tag}</Badge>
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p>
                <p className="text-base font-semibold text-accent-foreground mt-3">{item.prix}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/transport/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> Voir les détails
                    </Button>
                  </Link>
                  <QuoteRequestDialog defaultDestination={`${item.titre} (${item.tag})`}>
                    <Button variant="link" className="p-0 text-primary">
                      Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </QuoteRequestDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : activeCategory !== 'location_voiture' ? (
        <div className="text-center py-16">
          {(() => {
            const Icon = activeCat?.icon;
            return Icon ? <Icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /> : null;
          })()}
          <p className="text-muted-foreground">
            Aucune offre dans la catégorie "{activeCat?.label}" pour le moment. Contactez-nous pour une demande personnalisée.
          </p>
        </div>
      ) : null}
    </>
  );
}
