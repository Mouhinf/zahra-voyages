import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

export function mergeWithFeatured<T extends { id: string }>(
  firestoreItems: T[],
  featuredItems: T[]
): T[] {
  const existingIds = new Set(firestoreItems.map((item) => item.id));
  return [
    ...firestoreItems,
    ...featuredItems.filter((item) => !existingIds.has(item.id)),
  ];
}

export function isFeaturedOnly(
  id: string,
  featuredIds: Set<string>,
  persistedIds: Set<string>
): boolean {
  return featuredIds.has(id) && !persistedIds.has(id);
}

export async function saveCatalogItem(
  db: Firestore,
  collectionName: string,
  data: Record<string, unknown>,
  editingId: string | null,
  featuredIds: Set<string>,
  persistedIds: Set<string>
): Promise<void> {
  if (editingId) {
    if (isFeaturedOnly(editingId, featuredIds, persistedIds)) {
      await setDoc(doc(db, collectionName, editingId), data);
      return;
    }
    await updateDoc(doc(db, collectionName, editingId), data);
    return;
  }
  await addDoc(collection(db, collectionName), data);
}

export async function patchCatalogItem(
  db: Firestore,
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
  featuredIds: Set<string>,
  persistedIds: Set<string>
): Promise<void> {
  if (isFeaturedOnly(id, featuredIds, persistedIds)) {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
    return;
  }
  await updateDoc(doc(db, collectionName, id), data);
}

export async function hideOrDeleteCatalogItem(
  db: Firestore,
  collectionName: string,
  id: string,
  featuredIds: Set<string>,
  persistedIds: Set<string>
): Promise<'hidden' | 'deleted'> {
  // Si l'item est uniquement featured (pas encore persistant en base),
  // on le masque (disponible = false) pour qu'il ne réapparaisse pas après rechargement.
  if (isFeaturedOnly(id, featuredIds, persistedIds)) {
    await setDoc(doc(db, collectionName, id), { disponible: false }, { merge: true });
    return 'hidden';
  }

  // Si l'item est featured ET persistant, on le masque (disponible = false) (car on ne veut pas le supprimer définitivement).
  // Sinon, on le supprime définitivement.
  if (featuredIds.has(id)) {
    await setDoc(doc(db, collectionName, id), { disponible: false }, { merge: true });
    return 'hidden';
  }

  // Sinon (non‑featured), on le supprime définitivement.
  await deleteDoc(doc(db, collectionName, id));
  return 'deleted';
}
