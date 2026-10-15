import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { cache } from 'react';

export const fetchPublicCollection = cache(
  async <T extends { id: string; disponible?: boolean }>(collectionName: string): Promise<T[]> => {
    try {
      const snapshot = await getDocs(
        query(collection(getDbInstance(), collectionName), orderBy('ordre', 'asc'))
      );

      return snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          return JSON.parse(JSON.stringify({ id: docSnap.id, ...data })) as T;
        })
        .filter((item) => item.disponible !== false);
    } catch (error) {
      console.error(`Erreur fetch ${collectionName}:`, error);
      return [];
    }
  }
);
