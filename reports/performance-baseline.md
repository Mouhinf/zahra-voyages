# Rapport de Référence (Baseline) — Audit de Performance SLAAC Voyages

> Date de mesure : 14 octobre 2026  
> Outil de mesure : Google Lighthouse 13.5.0 (émulation mobile standard : Moto G Power, réseau 4G simulé, CPU throttling 4x)  
> Environnement testé : Production Vercel (`https://slaac-voyages.vercel.app`)  
> Navigateur : Google Chrome Headless 130+

---

## 1. Synthèse Globale des Mesures Initiales

| Route | Perf (/100) | Accessibilité | Bonnes Pratiques | SEO | LCP | FCP | TBT | CLS | Speed Index | TTFB | Poids Réseau |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`/` (Accueil)** | **67** | 96 | 100 | 100 | **5.9 s** | 1.8 s | 110 ms | 0.000 | **16.0 s** | 120 ms | 798 KiB |
| **`/hebergement`** | 94 | 100 | 100 | 100 | 2.3 s | 1.9 s | 150 ms | 0.049 | 3.8 s | 110 ms | 657 KiB |
| **`/transport`** | 92 | 100 | 100 | 100 | 2.7 s | 1.3 s | 140 ms | 0.049 | 4.1 s | 130 ms | 525 KiB |
| **`/voyages-croisieres`** | 85 | 100 | 100 | 100 | 2.6 s | 1.2 s | **430 ms** | 0.049 | 2.6 s | 130 ms | 558 KiB |
| **`/excursions`** | 86 | 100 | 100 | 100 | 1.5 s | 1.3 s | **300 ms** | 0.049 | 7.2 s | 2 030 ms | 653 KiB |
| **`/tourisme-affaires`** | 87 | 100 | 100 | 100 | 2.4 s | 1.0 s | 80 ms | 0.054 | 11.2 s | 380 ms | 786 KiB |
| **`/destinations`** | 98 | 100 | 100 | 100 | 2.3 s | 1.1 s | 60 ms | 0.049 | 2.0 s | 110 ms | 672 KiB |
| **`/contact`** | 99 | 98 | 100 | 100 | 1.5 s | 1.5 s | 40 ms | 0.052 | 2.1 s | 230 ms | 944 KiB |
| **`/dakar-2026`** | 96 | 100 | 100 | 100 | 2.5 s | 1.1 s | 100 ms | 0.053 | 2.8 s | 510 ms | 510 KiB |
| **`/admin/login`** | 75 | 98 | 100 | 63 | **5.2 s** | 1.7 s | 180 ms | 0.000 | 4.3 s | 110 ms | 526 KiB |

---

## 2. Analyse Détaillée par Page

### 2.1. Page d'Accueil (`/`)
- **Mesures :** Score Perf: 67/100, LCP: 5.9 s, FCP: 1.8 s, TBT: 110 ms, Speed Index: 16.0 s, Poids: 798 KiB.
- **Causes suspectées :**
  1. Le composant `Hero` télécharge en parallèle les 4 diapositives Cloudinary de haute résolution au montage, entrant en concurrence directe avec la première diapositive visible.
  2. Le composant `ChatbotLoader` (`src/components/chatbot-loader.tsx`) monte le composant lourd `Chatbot` (~14 KB + dépendances) dès le chargement initial dans `src/app/layout.tsx`.
  3. `HomeServicesGrid` (`src/components/sections/home-services-grid.tsx`) est un Client Component qui exécute dans un `useEffect` 5 requêtes Firestore séquentielles via le SDK client pour obtenir une image par service.
  4. `HomePartenaires` (`src/components/sections/home-partenaires.tsx`) est un Client Component qui exécute une requête Firestore dans un `useEffect` et affiche un spinner bloquant avec décalage de mise en page.
  5. `HomeStats` (`src/components/sections/home-stats.tsx`) effectue une requête Firestore dans un `useEffect` côté client pour une image de fond.
  6. `HomeFeatured` (`src/components/sections/home-featured.tsx`) interroge séquentiellement 3 collections Firestore au rendu serveur sans parallélisation `Promise.all`.
- **Éléments confirmés par inspection :**
  - Code vérifié dans `src/components/sections/hero.tsx`, `src/components/sections/home-services-grid.tsx`, `src/components/sections/home-partenaires.tsx`, `src/components/sections/home-featured.tsx`, `src/components/sections/home-stats.tsx`.
  - Cascades de requêtes Firestore visibles côté client.
- **Gravité :** Élevée (page d'accueil, première impression visiteur).
- **Optimisation proposée :**
  - Ne précharger que l'image de la diapositive 0 du Hero avec `priority={true}` et charger les autres diapositives en lazy-loading différé ou à l'interaction.
  - Différer le chargement du bundle Chatbot : afficher un simple bouton d'action flottant léger, et n'importer dynamiquement `Chatbot` qu'au clic ou au survol.
  - Transformer `HomeServicesGrid` et `HomePartenaires` en Server Components (ou passer les données en props depuis la page serveur) pour supprimer les 6 requêtes Firestore client post-hydratation.
  - Paralléliser les requêtes serveur dans `HomeFeatured` via `Promise.all` et mutualiser les requêtes d'offres phares.
- **Risque de régression :** Faible (préservation stricte de la structure visuelle et du comportement interactif).
- **Gain attendu (hypothèse) :** LCP ramené sous 2.5 s, score Perf > 90/100 sur mobile.

---

### 2.2. Pages Catalogue (`/hebergement`, `/transport`, `/voyages-croisieres`, `/excursions`, `/tourisme-affaires`)
- **Mesures :**
  - Scores Perf entre 85 et 94.
  - LCP entre 1.5 s et 2.7 s.
  - TBT élevé sur `/voyages-croisieres` (430 ms) et `/excursions` (300 ms).
  - TTFB d'excursion atteignant 2 030 ms lors de la régénération ISR.
- **Causes suspectées :**
  1. `fetchPublicCollection()` (`src/lib/public-data.ts`) lit l'intégralité d'une collection Firestore via le SDK Client exécuté sur le runtime Node.js, sans filtre `disponible !== false` ni pagination.
  2. Chaque page catalogue appelle `fetchPageContent(pageSlug)` deux fois : une fois dans `generateMetadata` et une fois dans le composant `Page`. Sans `React.cache()`, deux lectures Firestore distinctes sont envoyées pour le même document.
  3. Format d'image moderne : `next.config.ts` ne spécifie pas `formats: ['image/avif', 'image/webp']`.
- **Éléments confirmés par inspection :**
  - `src/lib/public-data.ts` ligne 8 : `query(collection(getDbInstance(), collectionName), orderBy('ordre', 'asc'))`.
  - `src/lib/page-content.ts` n'utilise pas `React.cache()`.
- **Gravité :** Moyenne.
- **Optimisation proposée :**
  - Utiliser `React.cache()` dans `fetchPageContent` pour dédupliquer les appels entre `generateMetadata` et le corps de page.
  - Configurer `formats: ['image/avif', 'image/webp']` dans `next.config.ts`.
  - Filtrer les offres au niveau serveur ou restreindre la taille des documents récupérés.
- **Risque de régression :** Très faible.
- **Gain attendu (hypothèse) :** Réduction du TTFB, TBT sous 150 ms, réduction de 20-30% du poids des images.

---

### 2.3. Page de Connexion Admin (`/admin/login`)
- **Mesures :** Score Perf: 75/100, LCP: 5.2 s, TBT: 180 ms.
- **Causes suspectées :** L'image d'arrière-plan ou logo sur la page de login n'a pas de dimension responsive stricte ni de priorité LCP adaptée.
- **Gravité :** Faible (page interne d'authentification).
- **Optimisation proposée :** Ajout de `priority` sur l'image LCP et optimisation des conteneurs.
- **Risque de régression :** Nul.
- **Gain attendu (hypothèse) :** LCP sous 2.5 s.

---

### 2.4. Back-Office Admin (`/admin/dashboard`, `/admin/demandes`, etc.)
- **Constats d'architecture :**
  1. `topPagesDetailed()` et `topSourcesDetailed()` dans `src/lib/admin-db.ts` exécutent des scans intégraux (`collection('analytics').get()`) sur toute la collection `analytics`.
  2. `crmOverview()` dans `src/lib/crm.ts` effectue 12 requêtes `count()` séquentielles et 4 requêtes de fenêtres temporelles (90 j et 30 j).
  3. L'API `GET /api/admin/dashboard/overview` regroupe 2 scans intégraux, 1 scan 30 jours, 14 requêtes `count()` de catalogue et l'ensemble du CRM dans un unique point de terminaison monolithique.
  4. Le tableau de bord `dashboard-page.tsx` importe Recharts statiquement (~300 KB) et bloque sur un spinner plein écran tant que la totalité des requêtes Firestore n'est pas terminée.
- **Gravité :** Critique pour la scalabilité Firestore et le temps de réponse de l'administration.
- **Optimisation proposée :**
  - Remplacer les scans complets de la collection `analytics` par des documents d'agrégation journalière (`analyticsDaily`, `analyticsPageDaily`, `analyticsSourceDaily`, etc.).
  - Découper ou cacher avec TTL court les statistiques de dashboard, paralléliser les agrégations CRM via `Promise.all`.
  - Charger les graphiques Recharts dynamiquement avec `next/dynamic` pour ne pas pénaliser le premier affichage du back-office.
- **Risque de régression :** Faible si les fonctions d'agrégation préservent les types retournés.
- **Gain attendu (hypothèse) :** Temps de réponse de `/api/admin/dashboard/overview` réduit de 80%, suppression des scans complets O(N) sur Firestore.
