# 07 — Données Structurées Schema.org & JSON-LD
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Conforme aux consignes Google Search Central — Données vérifiées

---

## 1. Contexte & Enjeux

Avant cette refonte, aucune donnée structurée JSON-LD n'était injectée dans le code HTML de SLAAC Voyages, privant le site de visibilité sous forme d'extraits enrichis (Rich Snippets) dans la SERP Google et affaiblissant la compréhension sémantique de l'entité de l'agence.

Le piège fréquent des agences consiste à injecter des avis fictifs (`AggregateRating` arbitraires à 4.9/5 sans validation tierce), ce qui constitue une violation directe des *Google Search Essentials* et expose le domaine à une pénalité manuelle pour spam de données structurées.

---

## 2. Architecture Implémentée (`src/lib/seo-schema.ts`)

Une bibliothèque modulaire et typée a été développée pour générer les schémas Schema.org conformes :

### 2.1. Entité Principale : `TravelAgency` & `LocalBusiness`
Injectée directement dans `src/app/layout.tsx` pour s'appliquer à l'ensemble du domaine :
- **`@type` :** `['TravelAgency', 'LocalBusiness']`
- **`@id` :** `https://slaacvoyages.com/#travelagency`
- **`name` & `legalName` :** SLAAC Voyages SARL
- **`url` & `logo` :** `https://slaacvoyages.com` / `https://slaacvoyages.com/logo-slaac.png`
- **`telephone` & `email` :** `+221773129090` / `contact@slaacvoyages.com`
- **`address` (PostalAddress) :** Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau, Sénégal
- **`geo` (GeoCoordinates) :** Latitude `14.6713`, Longitude `-17.4334`
- **`openingHoursSpecification` :** Lundi-Vendredi 08:30-18:30, Samedi 09:00-15:00
- **`priceRange` & Devises :** `$$`, `XOF, EUR, USD`
- **Moyens de paiement acceptés :** Espèces, CB, Virement, Wave, Orange Money
- **Zone desservie :** Sénégal, France, Italie, Espagne, Belgique, USA

### 2.2. Fil d'Ariane : `BreadcrumbList`
Intégré dans le composant `src/components/seo/breadcrumbs.tsx` :
- Génère automatiquement la séquence hiérarchique avec `@type: ListItem` et positions `1, 2, ...`
- Associe chaque étape à son URL canonique absolue.

### 2.3. Services & Fiches Détaillées
- **`getServiceSchema` :** Pour les offres de transport VIP, navettes AIBD, voyages organisés et croisières, avec rattachement au `provider` SLAAC Voyages.
- **`getLodgingSchema` :** Pour les hébergements et résidences meublées (`@type: LodgingBusiness`).
- **`getTouristAttractionSchema` :** Pour les circuits et excursions (Gorée, Bandia, Lac Rose, etc.).

---

## 3. Conformité Google Search Central

1. **Aucun `AggregateRating` fictif :** Google interdit explicitement les avis auto-déclarés non auditables.
2. **Pas d'échappement XSS :** Données sérialisées via `JSON.stringify` dans des balises `<script type="application/ld+json">`.
3. **Validation Rich Results Test :** Tous les schémas respectent la syntaxe officielle et sont prêts pour la validation via le Google Rich Results Tool.
