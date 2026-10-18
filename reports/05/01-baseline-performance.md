# Rapport 05.01 — Audit Initial des Performances & Baseline Technique
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date de mesure :** 17 octobre 2026  
> **Outil :** Google Lighthouse 13.5.0 (émulation mobile Chrome Headless, 4x CPU slowdown, réseau 3G/4G simulé)  
> **Serveur de test :** Build Next.js 15.5.22 optimisé (`next start -p 3100`)

---

## 1. Contexte & Méthodologie d'Audit

Conformément à la règle fondamentale du Prompt 05 (**Mesurer avant d'optimiser**), un protocole strict et reproductible a été exécuté sur l'ensemble des routes stratégiques du site SLAAC Voyages.

Chaque page a été évaluée sur les 4 catégories Lighthouse standard (Performance, Accessibilité, Bonnes Pratiques, SEO) ainsi que sur les Core Web Vitals officiels de Google :
- **LCP (Largest Contentful Paint)** : seuil cible < 2.5 s (Bon).
- **CLS (Cumulative Layout Shift)** : seuil cible < 0.10 (Bon).
- **TBT (Total Blocking Time)** : proxy laboratoire pour l'INP, seuil cible < 200 ms.
- **FCP (First Contentful Paint)** : seuil cible < 1.8 s.
- **Poids JavaScript & Images transférés**.

---

## 2. Tableau de Synthèse de la Baseline Initiale (Avant Optimisation)

| Route auditée | Type de Page | Score Perf. | LCP | TBT | CLS | FCP | JS Transféré | Total Transféré | Requêtes |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` | Page d'accueil | **74** | 3.9 s | 530 ms | 0.049 | 1.1 s | 346 KiB | 542 KiB | 42 |
| `/hebergement` | Catalogue Résidences | **88** | 3.3 s | 230 ms | 0.049 | 1.1 s | 354 KiB | 561 KiB | 38 |
| `/transport` | Service VTC & AIBD | **84** | 3.5 s | 310 ms | 0.049 | 1.2 s | 355 KiB | 517 KiB | 37 |
| `/voyages-croisieres` | Catalogue Voyages & Omra | **88** | 3.3 s | 250 ms | 0.049 | 1.1 s | 350 KiB | 522 KiB | 37 |
| `/excursions` | Catalogue Circuits | **87** | 3.3 s | 270 ms | 0.049 | 1.1 s | 350 KiB | 522 KiB | 37 |
| `/tourisme-affaires` | Tourisme MICE & B2B | **90** | 3.3 s | 190 ms | 0.049 | 1.1 s | 353 KiB | 524 KiB | 37 |
| `/assistance-voyage` | Visas & Assurances | **87** | 3.2 s | 280 ms | 0.049 | 1.1 s | 347 KiB | 520 KiB | 37 |
| `/destinations` | Guide Destinations | **91** | 3.0 s | 200 ms | 0.049 | 1.1 s | 348 KiB | 520 KiB | 37 |
| `/dakar-2026` | Événementiel JOJ | **90** | 3.2 s | 180 ms | 0.049 | 1.1 s | 346 KiB | 520 KiB | 37 |
| `/contact` | Formulaire & Contact | **88** | 3.0 s | 290 ms | 0.049 | 1.1 s | 789 KiB | 962 KiB | 41 |
| `/en` | Version Anglaise | **88** | 3.3 s | 210 ms | 0.049 | 1.1 s | 348 KiB | 520 KiB | 37 |
| `/hebergement/[id]` | Fiche Détail Hébergement | **50** | **5.4 s** | 290 ms | **0.868** | 1.3 s | 403 KiB | 586 KiB | 41 |
| `/admin/login` | Connexion Back-office | **89** | 2.7 s | 310 ms | 0.000 | 1.1 s | 412 KiB | 588 KiB | 40 |

> **Score Moyen Initial (Pages Publiques) :** **86.1 / 100**  
> **Fiche Produit /hebergement/[id] :** **50 / 100** (Urgence absolue : CLS critique de 0.868 et LCP à 5.4 s).

---

## 3. Diagnostic Approfondi des 6 Goulets d'Étranglement Majeurs

### Goulet n°1 : Les Pages de Détail (`/hebergement/[id]`, etc.) en Client-Side Rendering Pur
- **Symptôme :** Score de 50/100, LCP de 5.4 s, et un CLS gigantesque de **0.868** (seuil acceptable < 0.10).
- **Cause racine :** Le composant est préfixé `'use client'` et démarre avec `isLoading = true`. Le navigateur affiche d'abord un écran quasi vide avec un spinner `<Loader2 className="animate-spin" />`. Après la résolution de la promesse Firestore dans `useEffect`, tout le layout (titres, galeries d'images, carrousel d'avis, prix, bouton de devis) est injecté d'un coup, décalant l'intégralité du viewport.
- **Impact SEO :** Les robots d'indexation reçoivent une page vide sans titre h1, sans descriptif et sans métadonnées enrichies.
- **Solution requise :** Conversion en Server Component avec récupération des données sur le serveur (SSR / ISR) ou pré-remplissage dès l'envoi du HTML pour supprimer le flash de chargement et le décalage de mise en page.

### Goulet n°2 : LCP élevé sur la Homepage (3.9 s) et Hero `'use client'`
- **Symptôme :** LCP à 3.9 s sur mobile avec 530 ms de Total Blocking Time.
- **Cause racine :**
  1. Le composant `Hero` porte la directive `'use client'` alors qu'il ne comporte aucun state ou effet React (`QuoteRequestButton` enfant gère déjà sa propre interactivité).
  2. Le script principal de la page d'accueil pèse 331 kB First Load JS et monopolise le fil d'exécution principal pendant plus de 700 ms au bootup.
- **Solution requise :** Retirer `'use client'` de `Hero`, le rendre en Server Component statique et optimiser la priorité et les attributs `sizes` de l'image de fond Cloudinary.

### Goulet n°3 : Fuite du SDK Client Firebase Firestore dans la Page d'Accueil
- **Symptôme :** L'empreinte JavaScript de la homepage inclut les bibliothèques client `@firebase/firestore` et `@firebase/app`.
- **Cause racine :** Le composant `HomeContactQuick` (`src/components/sections/home-contact-quick.tsx`) est un Client Component qui importe `getDbInstance()` et `collection, query, orderBy, getDocs` uniquement pour charger une image d'agence dans un `useEffect` au montage.
- **Conséquence :** 
  - Chaque visiteur télécharge le SDK Firestore complet dans son navigateur.
  - Chaque visiteur déclenche une requête Firestore facturable juste pour une vignette d'illustration.
- **Solution requise :** Remplacer cet appel client par l'image Cloudinary officielle passée en prop ou intégrée directement, éliminant totalement l'import Firebase du bundle client de la page d'accueil.

### Goulet n°4 : Décalage Visuel CLS induit par le Bandeau Promo (`AnnouncementBar`)
- **Symptôme :** CLS de 0.049 sur toutes les pages hébergeant le Header.
- **Cause racine :** `AnnouncementBar` démarre avec `banners = null` et rend `null` (hauteur 0). Dès que l'appel `fetch('/api/promo-banners')` aboutit côté client, le bandeau de 36 px / 44 px s'insère au sommet de la page, poussant le Header et le Hero vers le bas. De plus, `fetch` est exécuté avec `{ cache: 'no-cache' }`, forçant un appel réseau à chaque navigation.
- **Solution requise :** Initialiser `banners` avec le bandeau de repli `[FALLBACK]`, éliminant le saut de hauteur (0 px de décalage), et exploiter le cache HTTP serveur (`s-maxage=60, stale-while-revalidate=300`).

### Goulet n°5 : Sur-consommation d'Écritures Firestore dans l'Analytics (`recordAnalyticsEvent`)
- **Symptôme :** Risque de saturation rapide des quotas gratuits Firestore (20 000 écritures / jour).
- **Cause racine :** Pour **chaque événement** (vue de page, clic WhatsApp, clic CTA) :
  1. Une lecture `sessionRef.get()` dans une sous-collection de session.
  2. Une écriture `sessionRef.set(...)`.
  3. Une mise à jour `dailyRef.set(..., { merge: true })`.
  4. Une insertion brute dans la collection `analyticsEvents.add(...)`.
  Total : **1 lecture + jusqu'à 3 écritures par page vue** !
- **Solution requise :** Supprimer l'insertion systématique dans `analyticsEvents` (collection non exploitée par le tableau de bord) et consolider les incréments atomiques directs dans `analyticsDaily`.

### Goulet n°6 : Requêtes Firestore non bornées dans `public-data.ts`
- **Symptôme :** Risque de latence et d'explosion des lectures à mesure que le catalogue s'étoffe.
- **Cause racine :** `fetchPublicCollection` exécute `getDocs(query(collection(...), orderBy('ordre', 'asc')))` sans clause `limit()`. Tout document manquant le champ `ordre` est également silencieusement exclu par Firestore.
- **Solution requise :** Ajouter des bornes explicites (`limit(50)`), sécuriser le tri et mettre en place une stratégie de mise en cache serveur adaptée à Next.js 15.

---

## 4. Données Brutes Enregistrées

Le jeu complet des mesures au format JSON standardisé est disponible dans :
- [`reports/05/metrics-before.json`](file:///home/mouhammad/zahra-voyages/reports/05/metrics-before.json)
