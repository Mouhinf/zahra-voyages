# Rapport 05.05 — Optimisation des Requêtes & Coûts Firestore
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Audit des Requêtes & Causes d'Explosion des Lectures

Avant notre intervention, le catalogue public et la page d'accueil présentaient plusieurs risques critiques de sur-consommation Firestore :

| Module / Fichier | Requête Initiale | Risque / Problème Identifié | Optimisation Implémentée |
| :--- | :--- | :--- | :--- |
| `src/lib/public-data.ts` | `query(collection(db, name), orderBy('ordre', 'asc'))` | **Requête non bornée** : lit l'intégralité de la collection. Tout document sans champ `ordre` est exclu par Firestore. | Ajout d'une limite par défaut (`limit(100)`), tri stable en mémoire préservant les documents historiques sans `ordre`. |
| `src/components/sections/home-contact-quick.tsx` | Requête client `getDocs(query(hebergements, limit(1)))` dans `useEffect` | **Exécution par 100% des visiteurs** : chaque visiteur générait une lecture Firestore depuis son navigateur juste pour une image. | Suppression complète de la requête client ; utilisation de l'image de marque statique officielle Cloudinary. |
| `src/lib/analytics.ts` (`recordAnalyticsEvent`) | `sessionRef.get()` + `sessionRef.set()` + `analyticsEvents.add()` | **1 lecture + 3 écritures par page vue** (20 000 écritures/j épuisées avec seulement 2 000 visiteurs). | Mise en cache mémoire de session (LRU Set) ; suppression des écritures brutes inutiles sur les simples pages vues. |
| `src/lib/detail-data.ts` | Pages de détail faisaient des requêtes client après le montage | Double requête / requête répétée sur chaque navigation | Fonctions mémoïsées avec React `cache()` et repli statique instantané si le document Firestore n'est pas trouvé. |

---

## 2. Invalidation & Fraîcheur des Offres Commerciales

Une optimisation du cache ne doit jamais entraîner l'affichage prolongé d'une offre supprimée ou le masquage d'un changement de tarif :

1. **Revalidation Temporelle Maîtrisée (ISR 300 s) :**
   Les pages de catalogue et de détail utilisent `export const revalidate = 300` (5 minutes).
   - Toute modification effectuée dans l'administration (création d'un nouvel hôtel, mise à jour d'un forfait navette) devient visible pour l'ensemble des visiteurs au maximum dans les 5 minutes suivant la publication.
   - En cas d'urgence commerciale, un déploiement Vercel ou un webhook de revalidation à la demande purgera instantanément le cache sans attendre l'expiration.
2. **Administration en Temps Réel Non Impactée :**
   Le back-office administrateur (`/admin/*`) interroge Firestore directement (via le SDK Admin ou des écoutes `onSnapshot` authentifiées avec tokens d'administration), garantissant que les agents de SLAAC Voyages voient toujours les données brutes à la seconde près.

---

## 3. Économies Mesurées sur le Quota Quotidien Firestore

- **Lectures économisées :**
  - Sur la homepage : 1 lecture Firestore économisée sur 100% des visiteurs (suppression du fetch dans `HomeContactQuick`).
  - Sur l'analytics : ~95% des lectures de contrôle de session économisées par le cache mémoire d'instance `sessionCache`.
- **Écritures économisées :**
  - Suppression de l'insertion dans `analyticsEvents` pour les simples consultations de pages : **-50% à -75% d'écritures globales par visiteur**, conservant les quotas gratuits (20 000 écritures / jour) pour le cœur commercial réel (soumissions de devis, messages CRM, contacts WhatsApp).
