'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Eye, Info, Ship, Plane } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';

type Offre = {
  id: string;
  titre: string;
  description: string;
  prix: string;
  image: string;
  tag: string;
  type: 'voyage' | 'croisiere';
  disponible?: boolean;
};

const CATEGORIES = [
  { key: 'voyage', label: 'Voyages', icon: Plane, description: 'Séjours et circuits vers vos destinations de rêve' },
  { key: 'croisiere', label: 'Croisières', icon: Ship, description: 'Escales inoubliables et voyages en mer' },
] as const;

export default function VoyagesCroisieresGrid({ initialItems = [] }: { initialItems?: Offre[] }) {
  const items = useMemo(
    () => initialItems.filter((item) => item.disponible !== false),
    [initialItems]
  );
  const [activeCategory, setActiveCategory] = useState<Offre['type']>('voyage');

  useEffect(() => {
    const categoryParam = new URLSearchParams(window.location.search).get('cat');
    if (categoryParam === 'voyage' || categoryParam === 'croisiere') {
      setActiveCategory(categoryParam);
      return;
    }
    const firstWithItems = CATEGORIES.find((category) => items.some((item) => item.type === category.key));
    if (firstWithItems) setActiveCategory(firstWithItems.key);
  }, [items]);

  const filteredItems = items.filter((item) => item.type === activeCategory);
  const activeCat = CATEGORIES.find((category) => category.key === activeCategory);

  return <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const count = items.filter((item) => item.type === category.key).length;
        const isActive = activeCategory === category.key;
        return <button key={category.key} type="button" onClick={() => setActiveCategory(category.key)} className={cn('text-left p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg', isActive ? 'border-primary bg-primary/5 shadow-lg' : 'border-border/50 bg-card hover:border-primary/30')}>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors', isActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}><Icon className="h-6 w-6" /></div>
          <h3 className={cn('text-xl font-semibold font-headline', isActive ? 'text-primary' : 'text-foreground')}>{category.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          <p className="text-xs font-medium text-primary mt-3">{count} offre{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}</p>
        </button>;
      })}
    </div>
    <Alert className="mb-8 bg-primary/5 border-primary/20 text-primary"><Info className="h-5 w-5" /><AlertDescription>Les tarifs affichés sont des estimations de départ et peuvent varier selon la saison, la disponibilité et le moment de la réservation. Pour un devis précis, veuillez nous contacter.</AlertDescription></Alert>
    {filteredItems.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredItems.map((item) => <Card key={item.id} className="overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col rounded-2xl border-border/50">
        <div className="relative h-64 overflow-hidden"><Image src={item.image} alt={item.titre} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" /><Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-md">{item.tag}</Badge></div>
        <CardContent className="p-5 flex flex-col flex-grow"><h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3><p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p><p className="text-base font-semibold text-accent-foreground mt-3">{item.prix}</p><div className="flex items-center gap-2 mt-4"><Link href={`/voyages-croisieres/${item.id}`}><Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Voir les détails</Button></Link><QuoteRequestButton defaultDestination={`${item.titre} (${item.tag})`} variant="link" className="p-0 text-primary">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></QuoteRequestButton></div></CardContent>
      </Card>)}
    </div> : <div className="text-center py-16">{activeCat && <activeCat.icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />}<p className="text-muted-foreground">Aucune offre dans la catégorie « {activeCat?.label} » pour le moment. Contactez-nous pour un voyage sur mesure.</p></div>}
  </>;
}
