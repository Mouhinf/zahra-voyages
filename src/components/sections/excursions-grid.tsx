'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Eye, Compass, Map, TreePine, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '221773129090';

type Offre = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  tag: string;
  type: string;
  lieu?: string;
  duree?: string;
  disponible?: boolean;
};

const CATEGORIES = [
  { key: 'excursion', label: 'Excursions', icon: Compass, description: 'Visites guidées à la demi-journée ou journée' },
  { key: 'circuit', label: 'Circuits', icon: Map, description: 'Circuits de plusieurs jours et séjours organisés' },
];

export default function ExcursionsGrid({ initialItems = [], staticItems = [], enrichments = {} }: { initialItems?: Offre[]; staticItems?: Offre[]; enrichments?: Record<string, any> }) {
  const items = useMemo(() => {
    const availableItems = initialItems.filter((item) => item.disponible !== false);
    const existingIds = new Set(initialItems.map((item) => item.id));
    return [
      ...availableItems,
      ...staticItems.filter((item) => !existingIds.has(item.id)),
    ];
  }, [initialItems, staticItems]);
  const [activeCategory, setActiveCategory] = useState<string>('excursion');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam && CATEGORIES.some((c) => c.key === catParam)) {
      setActiveCategory(catParam);
      return;
    }
    const firstWithItems = CATEGORIES.find((c) => items.some((d) => d.type === c.key));
    if (firstWithItems) setActiveCategory(firstWithItems.key);
  }, [items]);

  const filteredItems = items.filter((item) => item.type === activeCategory);
  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <>
      {/* Cartes catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.tag && <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{item.tag}</Badge>}
                {item.duree && (
                  <Badge variant="secondary" className="absolute top-4 left-4 bg-background/80 text-foreground shadow-md">
                    {item.duree}
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3>
                {item.lieu && <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{item.lieu}</p>}
                <p className="text-sm text-muted-foreground mt-2 flex-grow line-clamp-3">{item.description}</p>
                <p className="text-base font-semibold text-accent-foreground mt-3">{item.prix}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                  <Link href={`/excursions/${item.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> Voir les détails
                    </Button>
                  </Link>
                  <QuoteRequestButton defaultDestination={`${item.titre} (${item.tag})`} variant="link" className="p-0 text-primary">
                    Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                  </QuoteRequestButton>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour, je suis intéressé par "${item.titre}" (${item.tag}). Pouvez-vous me donner plus d'informations ?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2"
                  aria-label={`Demander un devis pour ${item.titre} sur WhatsApp`}
                >
                  <Button variant="outline" size="sm" className="w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          {(() => {
            const Icon = activeCat?.icon || TreePine;
            return <Icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />;
          })()}
          <p className="text-muted-foreground">
            Aucun{activeCategory === 'excursion' ? 'e excursion' : ' circuit'} disponible pour le moment. Contactez-nous pour une demande personnalisée.
          </p>
          <div className="mt-6">
            <QuoteRequestButton size="lg" defaultDestination={activeCategory === 'excursion' ? 'Excursion sur mesure' : 'Circuit sur mesure'}>
              <ArrowRight className="mr-2 h-4 w-4" /> Demander un devis
            </QuoteRequestButton>
          </div>
        </div>
      )}
    </>
  );
}
