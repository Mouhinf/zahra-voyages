import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Hotel, Car, Ship, MapPinned, Briefcase, FileCheck2, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuoteRequestButton } from '@/components/layout/quote-request-button';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { cache } from 'react';
import type { ServiceType } from '@/lib/schemas/quote-schema';

const FALLBACK_IMAGES: Record<string, string> = {
  transports: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-transport.png',
  hebergements: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-hebergement.png',
  excursions: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-excursions.png',
  offresAffaires: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-affaires.png',
  assistanceVoyage: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png',
  voyagesCroisieres: 'https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png',
};

type ServiceItem = {
  href: string;
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  badgeVariant?: 'gold' | 'navy' | 'verified';
  priceCallout?: string;
  serviceType: ServiceType;
  collectionName: string;
};

const services: ServiceItem[] = [
  {
    href: '/transport',
    icon: Car,
    title: 'Transport & Navette AIBD',
    tagline: 'Chauffeurs privés & Flotte VIP',
    description: 'Accueil personnalisé avec pancarte nominative à l’arrivée AIBD, berlines récentes climatisées, péage inclus et zéro supplément en cas de retard de vol.',
    badge: 'Ponctualité Garantie',
    badgeVariant: 'verified',
    priceCallout: 'Dès 30 000 FCFA',
    serviceType: 'transport',
    collectionName: 'transports',
  },
  {
    href: '/hebergement',
    icon: Hotel,
    title: 'Hébergements & Résidences',
    tagline: 'Villas & Appartements Meublés',
    description: 'Logements rigoureusement audités à Dakar (Almadies, Ngor, Plateau, Mermoz). Équipement garanti : fibre optique haut débit, groupe électrogène et réserve d’eau.',
    badge: 'Fibre & Générateur 24/7',
    badgeVariant: 'gold',
    priceCallout: 'Séjours vérifiés',
    serviceType: 'hebergement',
    collectionName: 'hebergements',
  },
  {
    href: '/excursions',
    icon: MapPinned,
    title: 'Excursions & Découverte',
    tagline: 'Circuits Privés d’Exception',
    description: 'Immersion culturelle et naturelle au Sénégal : Île de Gorée avec guide certifié, safari à la Réserve de Bandia, dunes du Lac Rose et pirogue dans le Saloum.',
    badge: 'Guides Certifiés',
    badgeVariant: 'verified',
    priceCallout: 'Journée dès 35 000 FCFA',
    serviceType: 'excursions',
    collectionName: 'excursions',
  },
  {
    href: '/tourisme-affaires',
    icon: Briefcase,
    title: "Tourisme d'Affaires & MICE",
    tagline: 'Séminaires & Délégations VIP',
    description: 'Coordination logistique de grands événements, conventions d’entreprises, facturation certifiée conforme (TVA/BRS) et accueil au salon d’honneur AIBD.',
    badge: 'Contrats B2B & Événements',
    badgeVariant: 'navy',
    priceCallout: 'Devis sous 24h ouvrées',
    serviceType: 'tourisme-affaires',
    collectionName: 'offresAffaires',
  },
  {
    href: '/assistance-voyage',
    icon: FileCheck2,
    title: 'Assistance Voyage & Visas',
    tagline: 'Accompagnement Consulaire Rapide',
    description: 'Traitement express des dossiers de visa d’affaires (Chine, Dubaï, Schengen), délivrance immédiate d’attestation d’assurance voyage et mobilité étudiante.',
    badge: 'Dossiers Express',
    badgeVariant: 'gold',
    priceCallout: 'Conseil sur mesure',
    serviceType: 'assistance-visa',
    collectionName: 'assistanceVoyage',
  },
  {
    href: '/voyages-croisieres',
    icon: Ship,
    title: 'Voyages, Croisières & Omra',
    tagline: 'Circuits & Pèlerinages Premium',
    description: 'Forfaits spirituels Omra grand confort avec hôtels proches du Haram, croisières maritimes internationales et circuits de vacances clé en main.',
    badge: 'Encadrement Soigné',
    badgeVariant: 'navy',
    priceCallout: 'Programmes exclusifs',
    serviceType: 'voyages-croisieres',
    collectionName: 'voyagesCroisieres',
  },
];

const fetchServiceImages = cache(async (): Promise<Record<string, string>> => {
  const result: Record<string, string> = { ...FALLBACK_IMAGES };
  try {
    const db = getDbInstance();
    await Promise.all(
      services.map(async (service) => {
        try {
          const q = query(collection(db, service.collectionName), orderBy('ordre', 'asc'), limit(1));
          const snap = await getDocs(q);
          snap.forEach((docSnap) => {
            const d = docSnap.data() as { image?: string; disponible?: boolean };
            if (d.disponible !== false && d.image && !d.image.includes('unsplash')) {
              result[service.collectionName] = d.image;
            }
          });
        } catch {
          // Utilise le fallback fiable Cloudinary
        }
      })
    );
  } catch {
    // Utilise les fallbacks Cloudinary
  }
  return result;
});

export default async function HomeServicesGrid() {
  const images = await fetchServiceImages();

  return (
    <section id="services" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          surtitle="Excellence Opérationnelle"
          title="Nos 6 Pôles de Prestations Majeures"
          description="Une maîtrise complète de la chaîne du voyage : de votre arrivée à Dakar jusqu'à vos déplacements d'affaires internationaux."
        />

        {/* Grille 3x2 des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const imgSrc = images[service.collectionName] || FALLBACK_IMAGES[service.collectionName];

            return (
              <div
                key={service.href}
                className="card-premium overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Visuel Cloudinary */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={imgSrc}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Badge supérieur */}
                    <div className="absolute top-3.5 left-3.5">
                      <Badge variant={service.badgeVariant || 'gold'} className="shadow-sm">
                        {service.badge}
                      </Badge>
                    </div>

                    {/* Prix d'appel indicatif */}
                    {service.priceCallout && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slaac-navy-950/90 text-slaac-gold-400 text-xs font-bold shadow">
                        {service.priceCallout}
                      </div>
                    )}
                  </div>

                  {/* Contenu textuel */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="p-1.5 rounded-lg bg-slaac-gold-50 text-slaac-gold-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                        {service.tagline}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-slaac-gold-700 transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Actions en bas de carte */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slaac-gold-600 transition-colors"
                  >
                    <span>Détails & tarifs</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <QuoteRequestButton
                    variant="gold"
                    size="sm"
                    defaultService={service.serviceType}
                    source={`accueil-grid-${service.serviceType}`}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" /> Devis
                  </QuoteRequestButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
