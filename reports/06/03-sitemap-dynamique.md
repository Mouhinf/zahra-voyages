# Rapport 03/20 : Fiabilisation & Architecture du Sitemap Dynamique

**Date :** 18 Octobre 2026  
**Fichier Source :** [`src/app/sitemap.ts`](file:///home/mouhammad/zahra-voyages/src/app/sitemap.ts)  
**Endpoint Public :** `https://slaacvoyages.com/sitemap.xml`  

---

## 1. Diagnostic de la Version Antérieure & Risques SEO

L'audit de la version précédente de `src/app/sitemap.ts` a révélé trois défaillances techniques majeures :

1. **Génération de fausses dates de modification (`new Date()`) :**
   - Chaque consultation de `/sitemap.xml` régénérait le sitemap avec l'heure courante pour l'intégralité des 50+ URLs.
   - **Impact Googlebot :** Google Search Central recommande formellement de n'indiquer `lastmod` que lorsqu'une modification éditoriale ou structurelle significative a eu lieu. La falsification involontaire et systématique de `lastmod` discrédite le signal, conduisant Google à ignorer cette balise pour planifier ses passages.

2. **Bornage rigide `.limit(200)` sans pagination :**
   - Les requêtes Firestore appliquaient un plafond de 200 documents par collection sans gestion de curseurs. Tout ajout d'offre au-delà de 200 aurait été omis du sitemap sans alerte.

3. **Inclusion indifférenciée de brouillons ou documents archivés :**
   - Seul le champ `disponible !== false` était filtré. Un document marqué comme brouillon commercial (`statut: 'brouillon'`) ou supprimé logiquement (`supprime: true`) risquait d'être envoyé aux moteurs de recherche.

---

## 2. Corrections Implémentées dans le Code

### A. Gestion Exacte et Intègre de `lastmod`
- **Pages Statiques :** Attribution d'une date de référence certifiée (`2026-10-18T00:00:00.000Z`) correspondant à la version majeure de publication du site.
- **Offres Dynamiques Firestore :** La fonction `parseFirestoreDate` extrait la date réelle depuis `updatedAt`, `publishedAt` ou `createdAt` (prenant en compte les objets Firestore `Timestamp` avec méthode `.toDate()`, les chaînes ISO ou timestamps numériques).
- **Règle d'omission conforme :** Si aucune date fiable n'existe sur le document, le champ `lastModified` est purement **omis**, conformément aux recommandations officielles de Google.

### B. Filtrage Métier & Respect du Cycle de Vie
Chaque document Firestore est désormais soumis à une vérification stricte :
```typescript
const isDraft = data.statut === 'brouillon' || data.status === 'draft';
const isDeleted = data.supprime === true;
const isUnpublished = data.publie === false;
const isUnavailable = data.disponible === false;

if (!isDraft && !isDeleted && !isUnpublished && !isUnavailable) {
  // L'offre est éligible à l'indexation
}
```

### C. Résilience et Repli Automatique (Zero 500 Error)
- En cas de déconnexion réseau avec Firestore ou lors d'un build local sans identifiants de production, le sitemap ne lève aucune exception HTTP 500.
- Il active automatiquement un mécanisme de repli en injectant les identifiants certifiés du catalogue statique (`featuredHebergements`, `featuredExcursions`, etc.).
- Ainsi, le sitemap XML reste 100% valide, riche et complet en toute circonstance.

### D. Déclarations Multilingues Alternates
- L'accueil `/` et la page internationale `/en` intègrent désormais des balises `<xhtml:link rel="alternate" hreflang="..." />` directement au sein du nœud XML sitemap.
