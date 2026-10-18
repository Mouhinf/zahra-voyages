# Détection de Locale dans le Middleware Next.js
## SLAAC Voyages | Performance & Routage Propre

### 1. Objectif du Middleware
Le middleware Next.js (`src/middleware.ts`) s'exécute sur l'Edge Runtime avant le rendu de chaque page. Dans le cadre de l'internationalisation FR/EN, il remplit une double mission :
1. **Identifier la langue demandée sans redirection intempestive** : analyser l'URL pour déterminer si le visiteur requiert la version anglaise (`/en` ou `/en/*`) ou la version française par défaut.
2. **Propager la locale au moteur SSR** : injecter un en-tête HTTP normalisé `x-slaac-locale: 'en' | 'fr'` utilisable par les Server Components de mise en page.

### 2. Implémentation dans `src/middleware.ts`
```typescript
// Détection de la locale demandée
const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
const locale = isEnglish ? 'en' : 'fr';

// En-tête personnalisé pour le rendu SSR dynamique dans RootLayout
requestHeaders.set('x-slaac-locale', locale);
```

### 3. Préservation des Règle d'Exclusion
Le middleware ignore strictement les requêtes techniques pour éviter toute surcharge :
- Chemins internes Next.js : `/_next/static`, `/_next/image`, `/_next/data`.
- Fichiers statiques et médias : `favicon.ico`, `.png`, `.jpg`, `.svg`, `.webp`, `.pdf`.
- Routes API : `/api/*` (qui gèrent leur propre validation et persistance).
- Fichiers d'indexation SEO : `/sitemap.xml`, `/robots.txt`.

### 4. Avantages Techniques et CRO
- **Zéro délai de redirection (0ms latency penalty)** : aucun saut HTTP 301/302 forcé pour les utilisateurs francophones ou anglophones naviguant directement sur leurs URLs respectives.
- **Support des navigateurs et bots** : Googlebot explore nativement les deux arborescences sans risque de boucles de redirection linguistique.
- **Résilience** : En l'absence d'en-tête, le système bascule automatiquement sur `'fr'` (territoire d'origine Sénégal).
