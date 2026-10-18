# Protocole de Contrôle Qualité Éditoriale (QA)
## SLAAC Voyages | Grille d'Audit et Procédure de Validation Pré-Publication

---

### 1. Objectif du Protocole QA

Garantir qu'aucun contenu éditorial ne soit publié sur `https://slaacvoyages.com` sans avoir satisfait aux normes de qualité rédactionnelle, d'intégrité juridique, d'optimisation SEO technique et de conversion commerciale.

---

### 2. Checklist d'Évaluation en 20 Points

#### Dimension Rédactionnelle & E-E-A-T (Points 1 à 6)
- [x] **01. Auteur identifié :** Nom réel, rôle dans l'agence et rattachement à Dakar Plateau.
- [x] **02. Date de fraîcheur :** Date de publication et date de dernière vérification explicite (`verifiedAt`).
- [x] **03. Niveau d'approfondissement :** Contenu substantiel (> 800 mots), découpé avec 3 à 5 H2 clairs.
- [x] **04. Sources officielles citées :** Liens ou mentions d'organismes vérifiés (AIBD, Nusuk, CVASC, etc.).
- [x] **05. Absence de promesse trompeuse :** Aucun terme « visa garanti », respect strict de la souveraineté consulaire.
- [x] **06. Orthographe & style :** Ton soigné, empathique, respectueux des traditions locales et adapté au voyageur.

#### Dimension SEO Technique & Sémantique (Points 7 à 12)
- [x] **07. Balise Title optimisée :** Longueur entre 50 et 65 caractères, mot-clé prioritaire en tête, marque SLAAC Voyages en fin.
- [x] **08. Meta Description percutante :** Longueur entre 140 et 160 caractères avec proposition de valeur claire.
- [x] **09. URL Canonique :** Format slug court, kebab-case, sans caractères accentués.
- [x] **10. Données Structurées JSON-LD :** Schéma `Article` ou `Service` valide, plus `FAQPage` pour les questions fréquentes.
- [x] **11. Fil d'Ariane :** Présence du composant visuel et du balisage Schema `BreadcrumbList`.
- [x] **12. Maillage interne descendant et ascendant :** Liens vers les services associés et retour depuis les pages mères.

#### Dimension Performance & Responsive (Points 13 à 16)
- [x] **13. Images optimisées :** Utilisation de `next/image` avec `priority` ou `loading="lazy"`, attribut `alt` descriptif et dimensions adaptées.
- [x] **14. Ergonomie mobile :** Lisibilité parfaite des polices sur écran 360px sans débordement horizontal.
- [x] **15. Rendu SSG / ISR :** Génération statique validée lors du `npm run build` (`generateStaticParams`).
- [x] **16. Gestion 404 :** Déclenchement de `notFound()` HTTP 404 pour les identifiants ou slugs inconnus.

#### Dimension CRO & Commerciale (Points 17 à 20)
- [x] **17. CTA contextuel :** Présence d'un encart d'action ou d'une sidebar avec bouton `QuoteRequestButton`.
- [x] **18. Préremplissage du devis :** Paramètres `defaultService` et `defaultDestination` dûment renseignés.
- [x] **19. Traçabilité Analytics :** Attribut `source` unique pour suivre l'origine du lead.
- [x] **20. Validation des tests automatisés :** Succès 20/20 de `node tests/editorial-seo.test.mjs`.
