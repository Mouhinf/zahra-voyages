'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, Info } from 'lucide-react';
import Image from 'next/image';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
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
};

export default function OffresGrid({ collectionName, emptyMessage }: OffresGridProps) {
  const [items, setItems] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { getDbInstance } = await import('@/lib/firebase');
      const { collection, query, orderBy, getDocs } = await import('firebase/firestore');
      const q = query(collection(getDbInstance(), collectionName), orderBy('ordre', 'asc'));
      const snap = await getDocs(q);
      if (mounted) {
        const data: Offre[] = [];
        snap.forEach((doc) => {
          const d = doc.data() as Omit<Offre, 'id'>;
          if ((d as Offre).disponible !== false) data.push({ id: doc.id, ...d });
        });
        setItems(data);
        setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [collectionName]);

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <Alert className="mb-8 bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription>
          Les tarifs affichés sont des estimations de départ et peuvent varier selon la saison, la disponibilité et le moment de la réservation. Pour un devis précis, veuillez nous contacter.
        </AlertDescription>
      </Alert>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="relative h-64">
                <Image
                  src={item.image}
                  alt={item.titre}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground">{item.tag}</Badge>
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-primary">{item.titre}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p>
                <p className="text-sm font-medium text-primary mt-2">{item.prix}</p>
                <QuoteRequestDialog defaultDestination={`${item.titre} (${item.tag})`}>
                  <Button variant="link" className="p-0 mt-2 text-primary self-start">
                    Demander un devis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </QuoteRequestDialog>
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
