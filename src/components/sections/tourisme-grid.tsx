'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, Eye, Info, Landmark, Languages, Loader2, Map } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QuoteRequestDialog } from '@/components/layout/quote-request-dialog';
import { featuredTourismeOffers } from '@/data/featured-tourisme';

type Offre = { id: string; titre: string; description: string; prix: string; image: string; tag: string; type: string; disponible?: boolean };

const CATEGORIES = [
  { key: 'tourisme_religieux', label: 'Tourisme religieux', icon: Landmark, description: 'Pèlerinages et séjours spirituels' },
  { key: 'tourisme_local', label: 'Tourisme local', icon: Map, description: 'Découverte du Sénégal et de ses régions' },
  { key: 'tourisme_linguistique', label: 'Tourisme linguistique', icon: Languages, description: 'Séjours d’apprentissage et d’immersion' },
  { key: 'tourisme_affaires', label: "Tourisme d'affaires", icon: Building2, description: 'Missions, séminaires et événements professionnels' },
];

const legacyBusinessTypes = new Set(['seminaire', 'incentive', 'mice', 'mission_sur_mesure']);
const categoryFor = (item: Offre) => legacyBusinessTypes.has(item.type) ? 'tourisme_affaires' : item.type;

export default function TourismeGrid() {
  const [items, setItems] = useState<Offre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('tourisme_affaires');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const snapshot = await getDocs(query(collection(getDbInstance(), 'offresAffaires'), orderBy('ordre', 'asc')));
        const data: Offre[] = [];
        snapshot.forEach((doc) => {
          const offer = doc.data() as Omit<Offre, 'id'>;
          if (offer.disponible !== false) data.push({ id: doc.id, ...offer });
        });
        if (mounted) {
          const existingIds = new Set(data.map((item) => item.id));
          const combinedItems = [
            ...data,
            ...featuredTourismeOffers.filter((item) => !existingIds.has(item.id)),
          ];
          setItems(combinedItems);
          const categoryParam = new URLSearchParams(window.location.search).get('cat');
          if (categoryParam && CATEGORIES.some((category) => category.key === categoryParam)) setActiveCategory(categoryParam);
          else {
            const firstWithItems = CATEGORIES.find((category) => combinedItems.some((item) => categoryFor(item) === category.key));
            if (firstWithItems) setActiveCategory(firstWithItems.key);
          }
        }
      } catch (error) {
        console.error('Erreur fetch offres tourisme:', error);
        if (mounted) {
          setItems(featuredTourismeOffers);
          setActiveCategory('tourisme_religieux');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredItems = items.filter((item) => categoryFor(item) === activeCategory);
  const activeCat = CATEGORIES.find((category) => category.key === activeCategory);

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return <>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        const count = items.filter((item) => categoryFor(item) === category.key).length;
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
        <CardContent className="p-5 flex flex-col flex-grow"><h3 className="text-lg font-semibold text-primary font-headline">{item.titre}</h3><p className="text-sm text-muted-foreground mt-1 flex-grow line-clamp-3">{item.description}</p><p className="text-base font-semibold text-accent-foreground mt-3">{item.prix}</p><div className="flex items-center gap-2 mt-4"><Link href={`/tourisme-affaires/${item.id}`}><Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> Voir les détails</Button></Link><QuoteRequestDialog defaultDestination={`${item.titre} (${item.tag})`}><Button variant="link" className="p-0 text-primary">Demander un devis <ArrowRight className="ml-2 h-4 w-4" /></Button></QuoteRequestDialog></div></CardContent>
      </Card>)}
    </div> : <div className="text-center py-16">{activeCat && <activeCat.icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />}<p className="text-muted-foreground">Aucune offre dans la catégorie « {activeCat?.label} » pour le moment. Contactez-nous pour une demande personnalisée.</p></div>}
  </>;
}
