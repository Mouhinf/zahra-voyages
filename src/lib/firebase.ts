import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  getFirestore, type Firestore,
  collection, query, orderBy, Timestamp,
  where, limit, getDocs, addDoc, doc, setDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD6jQBcC97mljSHrQU0JPjUxuT4TPrrGRw',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'slaac-voyages.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'slaac-voyages',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'slaac-voyages.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1068036954211',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1068036954211:web:857db1c86c589491220056',
};

let appInstance: any = null;
let authInstance: any = null;
let dbInstance: any = null;

function getAppInstance() {
  if (!appInstance) {
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
}

export function getAuthInstance() {
  if (!authInstance) authInstance = getAuth(getAppInstance());
  return authInstance;
}

export function getDbInstance() {
  if (!dbInstance) dbInstance = getFirestore(getAppInstance());
  return dbInstance;
}

// ---------- Analytics helpers ----------

/**
 * Returns total visits (documents in analytics).
 */
export const totalVisits = async (): Promise<number> => {
  const snapshot = await getDocs(collection(getDbInstance(), 'analytics'));
  return snapshot.size;
};

/**
 * Returns total bookings.
 */
export const totalBookings = async (): Promise<number> => {
  const snapshot = await getDocs(collection(getDbInstance(), 'bookings'));
  return snapshot.size;
};

/**
 * Returns total revenue from bookings.
 */
export const totalRevenue = async (): Promise<number> => {
  const snapshot = await getDocs(collection(getDbInstance(), 'bookings'));
  let total = 0;
  snapshot.forEach((doc) => {
    const amount = Number(doc.data().amount);
    if (!isNaN(amount)) total += amount;
  });
  return total;
};

/**
 * Returns total offers across all collections.
 */
export const totalOffers = async (): Promise<number> => {
  const collections = ['destinations', 'hebergements', 'transports', 'voyages', 'excursions', 'offresAffaires', 'partenaires'];
  let total = 0;
  for (const coll of collections) {
    const snapshot = await getDocsOrdered(collection(getDbInstance(), coll), 'id');
    total += snapshot.length;
  }
  return total;
};

/**
 * Returns conversion rate: bookings / visits * 100.
 */
export const conversionRate = async (visits?: number, bookings?: number): Promise<number> => {
  const v = visits ?? await totalVisits();
  const b = bookings ?? await totalBookings();
  return v === 0 ? 0 : (b / v) * 100;
};

/**
 * Returns unique visitors count (distinct non‑null userId) across analytics.
 */
export const totalUniqueVisitors = async (): Promise<number> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'analytics'), 'timestamp');
  const distinct = new Set();
  snapshot.forEach((doc) => {
    const uid = doc.data().userId;
    if (uid) distinct.add(uid);
  });
  return distinct.size;
};

/**
 * Returns top N pages by visit count.
 */
export const topPagesDetailed = async (): Promise<Array<{ page: string; count: number }>> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'analytics'), 'timestamp');
  const pages: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const page = doc.data().page;
    pages[page] = (pages[page] ?? 0) + 1;
  });
  return Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));
};

/**
 * Returns top N sources by visit count.
 */
export const topSourcesDetailed = async (): Promise<Array<{ source: string; count: number }>> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'analytics'), 'timestamp');
  const sources: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const source = doc.data().source;
    sources[source] = (sources[source] ?? 0) + 1;
  });
  return Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }));
};

/**
 * Returns top N transports (location_voiture) by bookings.
 */
export const topTransportsDetailed = async (): Promise<Array<{ type: string; count: number }>> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'bookings'), 'type');
  const byType: Record<string, number> = {};
  snapshot.forEach((doc) => {
    byType[doc.data().type] = (byType[doc.data().type] ?? 0) + 1;
  });
  return Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
};

/**
 * Returns top N destinations by visits.
 */
export const topDestinations = async (): Promise<Array<{ destination: string; visits: number }>> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'analytics'), 'timestamp');
  const destCounts: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const page = doc.data().page;
    if (page.includes('/destinations')) destCounts[page] = (destCounts[page] ?? 0) + 1;
  });
  return Object.entries(destCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ destination: page, visits: count }));
};

/**
 * Returns top N transports by visits (pages that match /transport).
 */
export const topTransportsByVisits = async (): Promise<Array<{ transport: string; visits: number }>> => {
  const snapshot = await getDocsOrdered(collection(getDbInstance(), 'analytics'), 'timestamp');
  const transportCounts: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const page = doc.data().page;
    if (page.includes('/transport')) transportCounts[page] = (transportCounts[page] ?? 0) + 1;
  });
  return Object.entries(transportCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ transport: page, visits: count }));
};

/**
 * Returns daily analytics (visits) for the last 30 days.
 */
export const analyticsPerDay = async (): Promise<Array<{ date: string; count: number }>> => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - 30));
  const q = query(collection(getDbInstance(), 'analytics'), where('timestamp', '>=', Timestamp.fromDate(start)), where('timestamp', '<=', Timestamp.fromDate(now)), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  const daily: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const date = doc.data().timestamp.toDate().toISOString().split('T')[0];
    daily[date] = (daily[date] ?? 0) + 1;
  });
  return Object.entries(daily).map(([date, count]) => ({ date, count }));
};

/**
 * Returns daily bookings for the last 30 days.
 */
export const bookingsPerDay = async (): Promise<Array<{ date: string; count: number }>> => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - 30));
  const q = query(collection(getDbInstance(), 'bookings'), where('createdAt', '>=', Timestamp.fromDate(start)), where('createdAt', '<=', Timestamp.fromDate(now)), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const daily: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const date = doc.data().createdAt.toDate().toISOString().split('T')[0];
    daily[date] = (daily[date] ?? 0) + 1;
  });
  return Object.entries(daily).map(([date, count]) => ({ date, count }));
};

/**
 * Returns daily revenue for the last 30 days.
 */
export const revenuePerDay = async (): Promise<Array<{ date: string; revenue: number }>> => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - 30));
  const q = query(collection(getDbInstance(), 'bookings'), where('createdAt', '>=', Timestamp.fromDate(start)), where('createdAt', '<=', Timestamp.fromDate(now)), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const dailyRevenue: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const date = doc.data().createdAt.toDate().toISOString().split('T')[0];
    const amount = Number(doc.data().amount);
    dailyRevenue[date] = (dailyRevenue[date] ?? 0) + amount;
  });
  return Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue }));
};

/**
 * Returns daily unique visitors for the last 30 days.
 */
export const uniqueVisitorsPerDay = async (): Promise<Array<{ date: string; count: number }>> => {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - 30));
  const q = query(collection(getDbInstance(), 'analytics'), where('timestamp', '>=', Timestamp.fromDate(start)), where('timestamp', '<=', Timestamp.fromDate(now)), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  const daily: Record<string, Set<string>> = {};
  snapshot.forEach((doc) => {
    const date = doc.data().timestamp.toDate().toISOString().split('T')[0];
    if (!daily[date]) daily[date] = new Set();
    const uid = doc.data().userId;
    if (uid) daily[date].add(uid);
  });
  return Object.entries(daily).map(([date, set]) => ({ date, count: set.size }));
};

/**
 * Returns a summary object with all key metrics.
 */
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const [
    totalVisitsVal,
    totalBookingsVal,
    revenueVal,
    uniqueVisitorsVal,
    pagesVal,
    sourcesVal,
    topTransportsVal,
    topDestinationsVal,
    topOffersVal,
    bookingsPerDayVal,
    topVisitsPerDayVal,
    topRevenuePerDayVal,
    topUniqueVisitorsPerDayVal,
    topTransportsByVisitsVal,
  ] = await Promise.all([
    totalVisits(),
    totalBookings(),
    totalRevenue(),
    totalUniqueVisitors(),
    topPagesDetailed(),
    topSourcesDetailed(),
    topTransportsDetailed(),
    topDestinations(),
    totalOffers(),
    bookingsPerDay(),
    analyticsPerDay(),
    revenuePerDay(),
    uniqueVisitorsPerDay(),
    topTransportsByVisits(),
  ]);

  const conversionRateVal = await conversionRate(totalVisitsVal, totalBookingsVal);

  return {
    totalVisits: totalVisitsVal,
    totalBookings: totalBookingsVal,
    conversionRate: conversionRateVal,
    revenue: revenueVal,
    uniqueVisitors: uniqueVisitorsVal,
    pages: pagesVal,
    sources: sourcesVal,
    topTransports: topTransportsVal,
    topDestinations: topDestinationsVal,
    topOffers: topOffersVal,
    topBookings: bookingsPerDayVal,
    topVisitsPerDay: topVisitsPerDayVal,
    topRevenuePerDay: topRevenuePerDayVal,
    topBookingsPerDay: bookingsPerDayVal,
    topUniqueVisitorsPerDay: topUniqueVisitorsPerDayVal,
    topTransportsByVisits: topTransportsByVisitsVal,
  } as const;
};

/**
 * Seeds dashboard data: creates test offers, bookings and analytics logs.
 * Should be called from admin API (seedDashboard).
 */
export const seedDashboard = async (): Promise<void> => {
  const db = getDbInstance();
  const auth = getAuthInstance();
  const uid = auth.currentUser?.uid;
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));

  // 30 offres (1 per collection)
  const collections = ['destinations', 'hebergements', 'transports', 'voyages', 'excursions', 'offresAffaires', 'partenaires'];
  for (const coll of collections) {
    const offer = {
      titre: `${coll.charAt(0).toUpperCase() + coll.slice(1)} offre test`,
      description: 'Description de test',
      prix: '1000',
      image: `https://picsum.photos/seed/${coll}/600/400`,
      tag: coll,
      disponible: true,
      ordre: 1,
    };
    await addDoc(collection(db, coll), offer);
  }

  // 100 bookings
  for (let i = 1; i <= 100; i++) {
    const amount = Math.random() * 200000;
    const booking = {
      userId: uid ?? `test-${i}`,
      transportId: `seed-transport-${Math.floor(Math.random() * 5)}`,
      titre: `Réservation ${i}`,
      description: 'Réservation de test',
      prix: amount.toString(),
      amount: amount,
      status: 'confirmed',
      createdAt: Timestamp.fromDate(new Date(today.getTime() - Math.random() * 86400000)),
    };
    await addDoc(collection(db, 'bookings'), booking);
  }

  // 2000 logs analytics
  const logPages = ['/', '/destinations', '/hebergements', '/transports', '/voyages', '/excursions', '/affaires', '/partenaires', '/contact'];
  for (let i = 0; i < 2000; i++) {
    const page = logPages[Math.floor(Math.random() * logPages.length)];
    const source = Math.random() < 0.2 ? 'facebook' : Math.random() < 0.1 ? 'google' : 'direct';
    const referrer = source === 'direct' ? null : `https://${source}.com`;
    await addDoc(collection(db, 'analytics'), {
      page,
      timestamp: Timestamp.fromDate(new Date(yesterday.getTime() + Math.random() * 86400000)),
      source,
      referrer,
      userId: uid ?? `test-${i}`,
      method: 'GET',
    });
  }
}

export const deleteAllAnalytics = async (): Promise<void> => {
  const db = getDbInstance();
  const analyticsCol = collection(db, 'analytics');
  const snapshot = await getDocs(analyticsCol);
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export type AnalyticsSummary = {
  totalVisits: number;
  totalBookings: number;
  conversionRate: number;
  revenue: number;
  uniqueVisitors: number;
  pages: Array<{ page: string; count: number }>;
  sources: Array<{ source: string; count: number }>;
  topTransports: Array<{ type: string; count: number }>;
  topDestinations: Array<{ destination: string; visits: number }>;
  topOffers: number;
  topBookings: Array<{ date: string; count: number }>;
  topVisitsPerDay: Array<{ date: string; count: number }>;
  topRevenuePerDay: Array<{ date: string; revenue: number }>;
  topBookingsPerDay: Array<{ date: string; count: number }>;
  topUniqueVisitorsPerDay: Array<{ date: string; count: number }>;
  topTransportsByVisits: Array<{ transport: string; visits: number }>;
};

/**
 * Helper to get documents from a collection ordered by a field.
 */
export const getDocsOrdered = async (
  collectionRef: any,
  orderByField: string,
  maxResults = 100,
): Promise<any[]> => {
  const q = query(collectionRef, orderBy(orderByField), limit(maxResults));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() as Record<string, unknown> }));
};

/**
 * Helper to add a document to a collection (auto-generated ID).
 */
export const addDocToCollection = async (collectionRef: any, data: any): Promise<string> => {
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
};

