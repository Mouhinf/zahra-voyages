# 13 — Gestion des Codes HTTP, Redirections & Élimination des Soft 404
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Statuts HTTP stricts, page 404 dédiée & zéro soft 404

---

## 1. Contexte & Définition du Soft 404

Un **Soft 404** se produit lorsqu'une page inexistante (ou une ressource introuvable) renvoie un code HTTP 200 OK avec un texte comme « Offre introuvable » ou une page quasi-vide.
Pour les robots Googlebot, c'est une anomalie grave :
- Gaspillage du budget de crawl (le bot continue de crawler des pages fantômes).
- Risque de diluer le signal de qualité du domaine.
- Signalement d'erreurs d'indexation dans Google Search Console.

---

## 2. Élimination Totale des Soft 404

### 2.1. Ingestion de `notFound()` dans les Server Components
Sur les 5 routes dynamiques :
- `/hebergement/[id]`
- `/excursions/[id]`
- `/transport/[id]`
- `/tourisme-affaires/[id]`
- `/voyages-croisieres/[id]`

Lorsqu'un identifiant n'existe ni dans Firestore ni dans le catalogue de secours statique, le code invoque désormais explicitement :
```typescript
import { notFound } from 'next/navigation';

// ...
if (!item) {
  notFound();
}
```
Cette méthode délègue la réponse au gestionnaire d'erreur de Next.js, qui envoie un véritable entête HTTP **404 Not Found**.

### 2.2. Page 404 Sur-Mesure (`src/app/not-found.tsx`)
La page 404 a été dotée d'une ergonomie premium et d'une protection SEO :
- **Directive Robots :** `robots: { index: false, follow: false, nocache: true }`.
- **UI Réconfortante :** Design navy & gold, message clair, bouton de retour vers l'accueil, sélection rapide des services principaux et raccourci d'assistance WhatsApp.
- **Rétention Visiteur :** L'utilisateur n'est jamais bloqué et peut poursuivre sa recherche.

---

## 3. Matrice des Codes de Statut du Projet

| Type d'URL | Code HTTP Attendu | Comportement SEO |
| :--- | :--- | :--- |
| Pages publiques régulières (`/`, `/transport`, etc.) | **200 OK** | Indexable, exploration normale |
| Fiche détail active existante | **200 OK** | Indexable, balises Schema.org injectées |
| Fiche détail inexistante ou supprimée | **404 Not Found** | Désindexation automatique par Googlebot |
| Routes API protégées sans token | **401 Unauthorized** | Non indexable (exclues par robots.txt) |
| Espace administration (`/admin/*`) | **200 OK** (si authentifié) | `noindex, nofollow` obligatoire |
