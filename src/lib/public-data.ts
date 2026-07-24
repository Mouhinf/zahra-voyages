import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';

export async function fetchPublicCollection<T extends { id: string }>(
  collectionName: string
): Promise<T[]> {
  try {
    const snapshot = await getDocs(
      query(collection(getDbInstance(), collectionName), orderBy('ordre', 'asc'))
    );

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return JSON.parse(JSON.stringify({ id: docSnap.id, ...data })) as T;
    });
  } catch (error) {
    console.error(`Erreur fetch ${collectionName}:`, error);
    return [];
  }
}
