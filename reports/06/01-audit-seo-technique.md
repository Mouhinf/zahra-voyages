# Rapport 01/20 : Audit SEO Technique Initial & Cartographie d'Indexabilité

**Date :** 18 Octobre 2026  
**Plateforme :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Environnement :** Next.js 15 App Router, React 19, TypeScript, Firestore Admin SDK, Vercel Edge  
**Branche Git :** `feat/slaac-technical-seo`

---

## 1. Objectifs de l'Audit

L'objectif de cet audit est d'évaluer de manière rigoureuse et exhaustive l'architecture technique de référencement de SLAAC Voyages, d'identifier les anomalies bloquant ou freinant l'indexation par Googlebot, et de formaliser un plan d'actions correctives concrètes et mesurables.

L'inventaire complet des URLs est consultable dans [`reports/06/url-inventory.csv`](file:///home/mouhammad/zahra-voyages/reports/06/url-inventory.csv), et la liste détaillée des dysfonctionnements dans [`reports/06/seo-issues.csv`](file:///home/mouhammad/zahra-voyages/reports/06/seo-issues.csv).

---

## 2. Cartographie de l'Architecture Technique

Le site s'articule autour de quatre grandes typologies d'URLs :

1. **Pages Publiques Statiques et Institutionnelles (14 URLs) :**
   - `/` (Accueil France & Sénégal)
   - `/en` (Accueil international anglophone)
   - `/hebergement` (Catalogue hébergements)
   - `/transport` (Transferts aéroport AIBD et navettes privées)
   - `/excursions` (Circuits Sénégal : Gorée, Lac Rose, etc.)
   - `/tourisme-affaires` (MICE, séminaires et délégations)
   - `/voyages-croisieres` (Voyages sur mesure, pèlerinages et croisières)
   - `/assistance-voyage` (Formalités, visas Chine/Dubaï/Schengen, assurance)
   - `/destinations` (Catalogue d'inspiration)
   - `/services` (Vue récapitulative des prestations)
   - `/dakar-2026` (Offres logistiques pour l'événement fin 2026)
   - `/about` (Présentation institutionnelle, immatriculation au Sénégal)
   - `/contact` (Formulaire commercial, coordonnées agence Plateau)
   - `/confidentialite` (Politique de protection des données personnelles)

2. **Pages Publiques Dynamiques d'Offres (5 gabarits paramétrés) :**
   - `/hebergement/[id]`
   - `/transport/[id]`
   - `/excursions/[id]`
   - `/tourisme-affaires/[id]`
   - `/voyages-croisieres/[id]`

3. **Espace Privé d'Administration CRM (21 routes sous `/admin`) :**
   - `/admin/login` (Connexion sécurisée Firebase Auth)
   - `/admin/(protected)/*` (Dashboard, devis, contacts, statistiques, bandeau)

4. **Points de Terminaison Techniques & Données :**
   - `/robots.txt`
   - `/sitemap.xml`
   - `/api/*` (Endpoints serverless)

---

## 3. Principales Faiblesses et Anomalies Identifiées

### A. Anomalie Critique : Risque de « Soft 404 » sur les gabarits dynamiques
- **Constat :** Lorsqu'un identifiant d'offre inexistant était demandé (ex: `/hebergement/offre-inexistante-123`), le serveur SSR ne déclenchait pas `notFound()`. Le composant client prenait le relais et affichait un message « Hébergement introuvable » avec un code statut HTTP **200 OK**.
- **Impact SEO :** Pour Googlebot, une page contenant un message d'erreur mais renvoyant un statut 200 est classée en **Soft 404**. Cela gaspille le budget d'exploration (crawl budget) et nuit à la crédibilité globale du domaine.
- **Correction requise :** Appel immédiat de `notFound()` dans le Server Component `page.tsx`, et création d'une véritable page [`src/app/not-found.tsx`](file:///home/mouhammad/zahra-voyages/src/app/not-found.tsx) retournant un vrai code HTTP 404.

### B. Fiabilité du Sitemap XML (`src/app/sitemap.ts`)
- **Fake `lastmod` :** Le code attribuait `new Date()` (date et heure courantes de génération) à l'ensemble des pages à chaque appel de `/sitemap.xml`. Google ignore ou pénalise les dates de modification fictives non corrélées à une mise à jour réelle du document.
- **Bornage arbitraire `limit(200)` :** Risque de tronquer silencieusement le catalogue si le volume d'offres croît.
- **Filtrage des statuts :** Le sitemap ne filtrait que `disponible !== false`, omettant d'exclure d'éventuels brouillons non publiés (`statut: 'brouillon'`) ou offres supprimées.

### C. Directives Robots.txt et Protection Admin
- **Contradiction Robots.txt / Noindex :** Dans `robots.ts`, la règle `disallow: ['/admin']` empêchait les moteurs d'explorer les URL sous `/admin`. Or, si Google trouve un lien externe pointant vers `/admin/login`, il ne peut pas lire la balise `noindex` et risque d'indexer l'URL sans snippet (« Aucun extrait n'est disponible pour cette page »).
- **Solution recommandée :** Intégrer une balise `<meta name="robots" content="noindex, nofollow" />` globale dans un layout serveur dédié `/admin/layout.tsx`.

### D. Métadonnées On-Page Incomplètes
- La page d'accueil `/` n'avait pas de `title` ni de `description` explicites dans son propre fichier `page.tsx`, s'appuyant uniquement sur le titre par défaut du layout racine.
- Absence d'attributs OpenGraph complets (`og:image:width`, `og:image:height`, `og:locale`) sur plusieurs sous-pages.

### E. SEO International & Découvrabilité Anglophone
- Bien que `/` et `/en` disposent de balises `rel="alternate"` dans le `<head>`, il n'existait **aucun lien HTML visible dans la navigation** (header et footer) permettant à un visiteur ou au robot de basculer de langue.

---

## 4. Matrice de Priorités d'Exécution

| Priorité | Domaine | Action Corrective | Impact Attendu |
| :---: | :--- | :--- | :--- |
| **P0 (Urgent)** | Erreurs HTTP | Supprimer les Soft 404 via `notFound()` et créer `src/app/not-found.tsx` | Statut 404 réel, assainissement de l'index |
| **P0 (Urgent)** | Sitemap XML | Corriger `sitemap.ts` (vrais timestamps, exclusion brouillons, pagination) | Indexation exacte des offres réelles |
| **P1 (Élevé)** | Métadonnées | Rédiger titles, descriptions, OpenGraph uniques sur chaque route | Augmentation du CTR dans les SERP |
| **P1 (Élevé)** | International | Ajouter sélecteur linguistique crawlable FR/EN + hreflang réciproque | Visibilité sur les requêtes anglophones |
| **P1 (Élevé)** | Schema.org | Enrichir `TravelAgency`, `LocalBusiness`, ajouter `BreadcrumbList` | Compréhension sémantique, Google Maps |
| **P2 (Moyen)** | Maillage interne | Ajouter fils d'Ariane et liens contextuels transversaux | Distribution du PageRank interne |
| **P2 (Moyen)** | Images | Vérifier `alt` descriptifs Cloudinary sans keyword stuffing | Référencement Google Images |
