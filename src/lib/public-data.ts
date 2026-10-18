import { collection, getDocs, limit, query } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { cache } from 'react';

/**
 * Récupère une collection publique Firestore avec :
 * - Borne maximale stricte (évite de télécharger des collections volumineuses incontrôlées).
 * - Tri en mémoire tolérant les documents sans champ 'ordre' explicite.
 * - Filtrage des éléments non disponibles.
 * - Mémoïsation par requête (React cache).
 */
export const fetchPublicCollection = cache(
  async <T extends { id: string; disponible?: boolean; ordre?: number }>(
    collectionName: string,
    maxItems = 100
  ): Promise<T[]> => {
    try {
      const snapshot = await getDocs(
        query(collection(getDbInstance(), collectionName), limit(maxItems))
      );

      const items = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          return JSON.parse(JSON.stringify({ id: docSnap.id, ...data })) as T;
        })
        .filter((item) => item.disponible !== false);

      // Tri stable en mémoire : respecte 'ordre' sans exclure les documents historiques qui en sont dépourvus
      items.sort((a, b) => (a.ordre ?? 999) - (b.ordre ?? 999));

      return items;
    } catch (error) {
      console.error(`Erreur fetch ${collectionName}:`, error);
      return [];
    }
  }
);
