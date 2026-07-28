import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { defaultPageContents } from '@/data/default-page-contents';
import type { PageContent, PageSlug } from '@/types';

export async function fetchPageContent(pageSlug: PageSlug): Promise<PageContent> {
  const defaults = defaultPageContents[pageSlug];
  try {
    const docSnap = await getDoc(doc(getDbInstance(), 'pageContents', pageSlug));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return JSON.parse(JSON.stringify({ ...defaults, ...data, id: pageSlug })) as PageContent;
    }
  } catch (error) {
    console.error(`Erreur fetch pageContents/${pageSlug}:`, error);
  }
  return defaults;
}

export async function savePageContent(pageSlug: PageSlug, content: PageContent): Promise<void> {
  const { id: _id, ...data } = content;
  await setDoc(doc(getDbInstance(), 'pageContents', pageSlug), { ...data, id: pageSlug });
}
