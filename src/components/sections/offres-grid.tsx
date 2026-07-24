'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Info, Eye } from 'lucide-react';
import Image from 'next/image';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Offre = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  tag: string;
  disponible?: boolean;
};

type OffresGridProps = {
  collectionName: string;
  emptyMessage: string;
  detailBasePath?: string;
  initialItems?: Offre[];
  staticItems?: Offre[];
  hidePrices?: boolean;
  enrichments?: Record<string, Partial<Offre>>;
};

export default function OffresGrid({ emptyMessage, detailBasePath, initialItems = [], staticItems = [], hidePrices = false, enrichments = {} }: OffresGridProps) {
  const items = useMemo(() => {
    const data = initialItems
      .filter((item) => item.disponible !== false)
      .map((item) => {
        const sanitized = {
          ...item,
          image: item.image && item.image.includes('unsplash')
            ? 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png'
            : item.image,
        };
        return { ...sanitized, ...enrichments[item.id] };
      });
    return [...data, ...staticItems];
  }, [initialItems, staticItems, enrichments]);

  return (
    <>
      <Alert className="mb-8 bg-primary/5 border-primary/20 text-primary">
        <Info className="h-5 w-5" />
        <AlertDescription>
          {hidePrices ? 'Toutes nos excursions sont proposées sur devis, selon vos dates et vos besoins.' : 'Les tarifs affichés sont des estimations de départ et peuvent varier selon la saison, la disponibilité et le moment de la réservation. Pour un devis précis, veuillez nous contacter.'}
        </AlertDescription>
      </Alert>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.titre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{item.tag}</Badge>
              </div>
              <CardContent className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p>
                {!hidePrices && item.prix && <p className="text-base font-semibold text-accent-foreground mt-3">{item.prix}</p>}
                <div className="flex items-center gap-2 mt-4">
                  {detailBasePath && (
                    <Link href={`${detailBasePath}/${item.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" /> Voir les détails
                      </Button>
                    </Link>
                  )}
                  <QuoteRequestButton defaultDestination={`${item.titre} (${item.tag})`} variant="link" className="p-0 text-primary">
                      Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                  </QuoteRequestButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </>
  );
}
