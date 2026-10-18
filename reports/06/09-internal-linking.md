# 09 — Architecture de Maillage Interne & Siloing Thématique
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Silos thématiques structurés & maillage d'ancrage optimisé

---

## 1. Contexte & Problématique Initiale

Le maillage interne d'origine présentait plusieurs lacunes :
- Des pages orphelines ou faiblement liées (comme `/assistance-voyage`, accessible uniquement depuis le footer).
- Absence de liens contextuels entre les offres complémentaires (ex: un utilisateur consultant un hébergement à Dakar n'avait aucun lien direct vers un transfert AIBD).
- Absence de fil d'Ariane, forçant Googlebot à recalculer la hiérarchie de chaque page.

---

## 2. Restructuration en Silos Thématiques

Nous avons établi une architecture en silos étanches mais interconnectés de façon logique :

```
                        [ ACCUEIL (/) ]
                              │
    ┌──────────────┬──────────┴───────────┬──────────────┐
    │              │                      │              │
[TRANSPORT]   [HÉBERGEMENT]          [EXCURSIONS]   [CORPORATE]
    │              │                      │              │
Navette AIBD   Appartements           Gorée/Bandia   Séminaires
Flotte VIP     Résidences             Lac Rose       Visas Affaires
```

### 2.1. Intégration du Fil d'Ariane (`Breadcrumbs`)
Déployé sur l'intégralité des 6 hubs de services et des 5 types de fiches détaillées dynamiques :
- Permet à l'utilisateur de remonter d'un clic au hub parent (`Accueil > Hébergements & Résidences > Détail`).
- Fournit aux robots de recherche une arborescence explicite via le balisage `BreadcrumbList`.

### 2.2. Liens Contextuels Transverses (Cross-Selling SEO)
- Sur `/dakar-2026` : Liens directs ancrés vers `/transport` (transferts AIBD) et `/hebergement` (résidences meublées sécurisées).
- Sur les fiches détaillées : Composant `SimilarOffers` qui propose 3 offres alternatives de la même catégorie pour éviter les impasses d'exploration.
- Dans le Header : Menu déroulant catégorisé avec titres et descriptions complètes.
- Dans le Footer : Double colonne d'exploration structurée (Navigation institutionnelle vs Nos Prestations).
