/**
 * Limiteur de débit en mémoire, partagé entre les routes API.
 *
 * Limites connues : les instances serverless (Vercel) sont froides/éphémères,
 * ce limiteur est donc "best effort" (par instance). Il protège contre les abus
 * simples et le scraping ; pour une protection forte en production, ajouter
 * un limiteur persistant (Upstash Redis, Vercel KV…) si nécessaire.
 */

type Entry = { count: number; start: number };

// Stocké sur globalThis pour survivre aux invocations à chaud d'un même worker.
const globalForRateLimit = globalThis as unknown as {
  __slaac_rate_limit_stores?: Map<string, Map<string, Entry>>;
};

const stores: Map<string, Map<string, Entry>> =
  globalForRateLimit.__slaac_rate_limit_stores ?? new Map();
globalForRateLimit.__slaac_rate_limit_stores = stores;

/**
 * @returns true si la requête est autorisée, false si la limite est dépassée.
 */
export function rateLimit(
  bucket: string,
  key: string,
  max: number,
  windowMs: number,
): boolean {
  let store = stores.get(bucket);
  if (!store) {
    store = new Map();
    stores.set(bucket, store);
  }

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.start > windowMs) {
    store.set(key, { count: 1, start: now });
    return true;
  }

  entry.count += 1;
  if (entry.count > max) {
    return false;
  }
  return true;
}

/** Extrait l'IP client au mieux des en-têtes Vercel/proxy. */
export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  return headers.get('x-real-ip') || 'unknown';
}
