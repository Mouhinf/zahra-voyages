# 19 — Tableau Comparatif Avant / Après (Chantier SEO Technique)
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Synthèse d'impact des optimisations réalisées

---

| Dimension SEO Technique | Situation Initiale (Avant Refonte) | Situation Optimisée (Après Prompt 06) | Impact Google & Utilisateur |
| :--- | :--- | :--- | :--- |
| **Gestion des erreurs d'URL** | Soft 404 (code HTTP 200 OK avec message "introuvable") | Vrai code HTTP 404 via `notFound()` + page 404 design noindex | Évite le gaspillage du budget de crawl, supprime les alertes Search Console |
| **Sitemap XML `lastmod`** | Faux `new Date()` regénéré à chaque requête dynamique | Horodatage fixe certifié ou date réelle issue de Firestore | Restaure la crédibilité de fraîcheur des contenus auprès de Googlebot |
| **Filtrage du Sitemap** | Limite 200 documents, risque d'inclure des brouillons | Capacité 1000 docs, exclusion stricte des brouillons et supprimés | Protection contre l'indexation de contenus inachevés |
| **Protection Espace Admin** | Dépendance exclusive au fichier `robots.txt` | Balise `<meta name="robots" content="noindex, nofollow">` dans `admin/layout` | Double verrou : exclusion garantie même si le robots.txt est ignoré |
| **Données Structurées** | 0 balise Schema.org JSON-LD dans l'ensemble du site | Schémas `TravelAgency`, `LocalBusiness`, `BreadcrumbList`, `Service` | Éligibilité aux Rich Snippets Google et ancrage dans le Knowledge Graph |
| **Fil d'Ariane (Breadcrumbs)**| Aucun fil d'Ariane visuel ni sémantique | Composant `Breadcrumbs` sur tous les hubs et fiches détaillées | Améliore le taux de rebond et structure les URLs dans la SERP |
| **SEO International (EN)** | Route `/en` orpheline dans la navigation, pas de hreflang | Commutateur `FR \| EN` crawlable dans Header/Footer + `alternates` | Découvrabilité totale de la version anglaise pour touristes & expat |
| **Métadonnées des Hubs** | Titres et descriptions génériques peu différenciés | Balises sur-mesure intégrant mots-clés Dakar, AIBD, Gorée, Saly | Taux de clic (CTR) accru dans les résultats de recherche |
| **SEO Images & Multimédia** | Pas de directive Googlebot-Image, alt parfois absents | Directive explicite dans `robots.ts`, balises alt descriptives | Indexation optimisée dans Google Images et Google Lens |
| **URL Canonique de Base** | Parfois floue entre Vercel et le futur nom de domaine | Déclaration unifiée sur `https://slaacvoyages.com` via `metadataBase` | Prévient tout risque de duplicate content post-migration DNS |
