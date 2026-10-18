# 17 — Intégration Continue (CI) & Non-Régression du SEO Technique
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Suite de tests automatisée `tests/seo-technical.test.mjs` intégrable en CI

---

## 1. Objectif du Garde-Fou CI

Les régressions SEO sont fréquentes lors des mises à jour applicatives (oubli d'une balise canonical, injection involontaire d'un `noindex` global, suppression d'un attribut alt ou plantage de la génération du sitemap).

Pour immuniser SLAAC Voyages contre ces risques, nous avons développé une suite de tests unitaire et d'intégration dédiée :
```bash
node tests/seo-technical.test.mjs
```

---

## 2. Intégration dans le Pipeline de Déploiement

Dans `package.json`, le script peut être exécuté dans l'étape de pré-commit ou avant tout build Vercel :

```json
"scripts": {
  "test:seo": "node tests/seo-technical.test.mjs",
  "test:all": "npm run test:api && npm run test:seo"
}
```

### Critères Validés Automatiquement (Code de sortie 0) :
1. Présence et syntaxe des règles dans `robots.ts` (allow, disallow admin/api, sitemap).
2. Protection noindex/nofollow sur `src/app/admin/layout.tsx`.
3. Existence de la page 404 personnalisée avec noindex.
4. Élimination des soft 404 (`notFound()`) sur les 5 routes dynamiques.
5. Absence de churn de faux `new Date()` dans le sitemap.
6. Filtrage des brouillons et offres supprimées dans le sitemap.
7. Présence des balises hreflang dans les entrées du sitemap.
8. URL canonique de base configurée sur `https://slaacvoyages.com`.
9. Déclaration des langues bilingues `fr-SN` et `en-US` dans le layout racine.
10. Intégrité des constructeurs Schema.org JSON-LD dans `seo-schema.ts`.
11. Exactitude des coordonnées GPS et NAP de Dakar Plateau.
12. Injection du schéma TravelAgency dans le layout racine.
13. Présence du composant Fil d'Ariane avec JSON-LD.
14. Présence de Breadcrumbs et JSON-LD sur les 5 templates de détail.
15. Métadonnées descriptive pour les 4 hubs majeurs de services.
16. Métadonnées ciblées et Breadcrumbs pour la page `/dakar-2026`.
17. Présence du commutateur de langue crawlable dans le header et le footer.
18. Disponibilité des inventaires d'URLs et registre des anomalies.
19. Configuration des balises OpenGraph et Twitter Cards avec image.
20. Non-régression des briques logicielles antérieures (Outbox, CRM, Tokens).
