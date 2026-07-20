'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Loader2, Eye, Info, Hotel, Tent, TreePine } from 'lucide-react';
import Image from 'next/image';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { cn } from '@/lib/utils';

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
  { key: 'hotel', label: 'Hôtels', icon: Hotel, description: 'Confort et service haut de gamme' },
  { key: 'lodge', label: 'Lodges', icon: TreePine, description: 'Nature et immersions authentiques' },
  { key: 'campement', label: 'Campements', icon: Tent, description: 'Aventure et traditions locales' },
];

export default function HebergementGrid() {
  const [items, setItems] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('hotel');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const q = query(collection(getDbInstance(), 'hebergements'), orderBy('ordre', 'asc'));
        const snap = await getDocs(q);
        const data: Offre[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data() as Omit<Offre, 'id'>;
          if (d.disponible !== false) data.push({ id: docSnap.id, ...d });
        });
        if (mounted) {
          setItems(data);
          // Auto-select first non-empty category
          const firstWithItems = CATEGORIES.find((c) => data.some((d) => d.type === c.key));
          if (firstWithItems) setActiveCategory(firstWithItems.key);
        }
      } catch (e) {
        console.error('Erreur fetch hebergements:', e);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
              <p className="text-xs font-medium text-primary mt-3">{count} hébergement{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</p>
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
                  <Link href={`/hebergement/${item.id}`}>
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
      ) : (
        <div className="text-center py-16">
          <activeCat.icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucun hébergement dans la catégorie "{activeCat?.label}" pour le moment. Contactez-nous pour une recherche personnalisée.
          </p>
        </div>
      )}
    </>
  );
}
