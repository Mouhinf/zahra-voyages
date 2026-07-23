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
import { featuredDestinations, allWorldDestinationsMessage } from '@/data/featured-destinations';
import { featuredTransfertsAeroport } from '@/data/featured-transferts';
import { featuredTransfertsPlage } from '@/data/featured-transferts-plage';

const WHATSAPP_NUMBER = '221775396325';
const featuredTransportOffers = [...featuredDestinations, ...featuredTransfertsAeroport, ...featuredTransfertsPlage];

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
          const existingIds = new Set(data.map((item) => item.id));
          const combinedItems = [
            ...data,
            ...featuredTransportOffers.filter((item) => !existingIds.has(item.id)),
          ];
          setItems(combinedItems);
          const firstWithItems = CATEGORIES.find((c) => combinedItems.some((d) => d.type === c.key));
          if (firstWithItems) setActiveCategory(firstWithItems.key);
        }
      } catch (e) {
        console.error('Erreur fetch transports:', e);
        if (mounted) {
          setItems(featuredTransportOffers);
          setActiveCategory('billet_avion');
        }
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

      {activeCategory === 'billet_avion' && (
        <Alert className="mb-8 bg-accent/10 border-accent/30 text-primary">
          <Plane className="h-5 w-5" />
          <AlertDescription className="font-medium">{allWorldDestinationsMessage}</AlertDescription>
        </Alert>
      )}

      <Alert className="mb-8 bg-primary/5 border-primary/20 text-primary">
        <Info className="h-5 w-5" />
        <AlertDescription>
          Les tarifs affichés sont des estimations de départ et peuvent varier selon la saison, la disponibilité et le moment de la réservation. Pour un devis précis, veuillez nous contacter.
        </AlertDescription>
      </Alert>

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
                {item.tag && <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{item.tag}</Badge>}
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p>
                {activeCategory === 'location_voiture' || activeCategory === 'transfert_aeroport' || activeCategory === 'transfert_plage' ? (
                  <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-border/50">
                    <Link href={`/transport/${item.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" /> Voir les détails
                      </Button>
                    </Link>
                    <QuoteRequestDialog defaultDestination={`${activeCategory === 'transfert_aeroport' ? 'Transfert aéroport' : activeCategory === 'transfert_plage' ? 'Transfert par la plage en 4×4' : 'Location'} ${item.titre}`}>
                      <Button variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
                        Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </QuoteRequestDialog>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(activeCategory === 'transfert_aeroport' ? `Bonjour, je souhaiterais obtenir un devis pour un transfert aéroport avec ${item.titre}.` : activeCategory === 'transfert_plage' ? `Bonjour, je souhaiterais obtenir un devis pour un transfert par la plage en véhicule 4×4 avec ${item.titre}.` : `Bonjour, je souhaiterais obtenir un devis pour la location d'un ${item.titre} avec chauffeur.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                      aria-label={`Demander un devis pour ${item.titre} sur WhatsApp`}
                    >
                      <Button variant="outline" size="sm" className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </Button>
                    </a>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {(() => {
            const Icon = activeCat?.icon;
            return Icon ? <Icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /> : null;
          })()}
          <p className="text-muted-foreground">
            Aucune offre dans la catégorie "{activeCat?.label}" pour le moment. Contactez-nous pour une demande personnalisée.
          </p>
        </div>
      )}
    </>
  );
}
