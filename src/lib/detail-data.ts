import { getDbInstance } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getFeaturedHebergement } from '@/data/featured-hebergements';
import { getHebergementEnrichment } from '@/data/hebergement-enrichments';
import { getFeaturedExcursion } from '@/data/featured-excursions';
import { getExcursionEnrichment } from '@/data/excursion-enrichments';
import { featuredDestinations } from '@/data/featured-destinations';
import { featuredTransfertsAeroport } from '@/data/featured-transferts';
import { featuredTransfertsPlage } from '@/data/featured-transferts-plage';
import { featuredTourismeOffers } from '@/data/featured-tourisme';
import { withBusinessOfferImage } from '@/data/business-offer-images';
import type { Hebergement, Excursion, Transport, OffreAffaires, VoyageCroisiere } from '@/types';
import { cache } from 'react';

export const fetchHebergementItem = cache(async (id: string): Promise<Hebergement | null> => {
  try {
    const snap = await getDoc(doc(getDbInstance(), 'hebergements', id));
    if (snap.exists()) {
      const storedItem = { id: snap.id, ...snap.data() } as Hebergement;
      return { ...storedItem, ...getHebergementEnrichment(snap.id) };
    }
  } catch (e) {
    // Repli statique fiable
  }
  return (getFeaturedHebergement(id) as Hebergement) || null;
});

export const fetchExcursionItem = cache(async (id: string): Promise<Excursion | null> => {
  try {
    const snap = await getDoc(doc(getDbInstance(), 'excursions', id));
    if (snap.exists()) {
      const storedItem = { id: snap.id, ...snap.data() } as Excursion;
      return { ...storedItem, ...getExcursionEnrichment(snap.id) };
    }
  } catch (e) {
    // Repli statique
  }
  return (getFeaturedExcursion(id) as Excursion) || null;
});

export const fetchTransportItem = cache(async (id: string): Promise<Transport | null> => {
  try {
    const snap = await getDoc(doc(getDbInstance(), 'transports', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Transport;
    }
  } catch (e) {
    // Repli statique
  }
  const allStatic = [...featuredDestinations, ...featuredTransfertsAeroport, ...featuredTransfertsPlage];
  return (allStatic.find((t) => t.id === id) as Transport) || null;
});

export const fetchOffreAffairesItem = cache(async (id: string): Promise<OffreAffaires | null> => {
  try {
    const snap = await getDoc(doc(getDbInstance(), 'offresAffaires', id));
    if (snap.exists()) {
      return withBusinessOfferImage({ id: snap.id, ...snap.data() } as OffreAffaires);
    }
  } catch (e) {
    // Repli statique
  }
  const found = featuredTourismeOffers.find((o) => o.id === id);
  return found ? withBusinessOfferImage(found as OffreAffaires) : null;
});

export const fetchVoyageCroisiereItem = cache(async (id: string): Promise<VoyageCroisiere | null> => {
  try {
    const snap = await getDoc(doc(getDbInstance(), 'voyagesCroisieres', id));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as VoyageCroisiere;
    }
  } catch (e) {
    // Repli
  }
  return null;
});
