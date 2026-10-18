# Rapport 05.06 — Performance & Sécurité du CRM et du Back-Office
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Architecture des Requêtes & Agrégations CRM

Le back-office commercial de SLAAC Voyages (`/admin/dashboard`, `/admin/demandes/*`, `/admin/statistiques`) gère le cycle de vie complet des prospects (devis, formulaires de contact, newsletter).

L'audit architectural confirme que le CRM est hautement optimisé et sécurisé :
1. **Agrégations `count()` serveur Firestore :**
   Dans `src/lib/crm.ts` (`crmOverview`), les totaux globaux et par statut (`quotesTotalSnap`, `contactsTotalSnap`, statuts `en_discussion`, `devis_envoye`, etc.) sont exécutés via `.count().get()`. Firestore facture 1 lecture par tranche de 1 000 entrées d'index au lieu de lire chaque document un par un.
2. **Projections ciblées (`select`) :**
   Les requêtes de détection des demandes non traitées (`> 48 h`) utilisent `.select('crmStatus')`, évitant le transfert inutile des charges utiles complètes (notes, historiques, adresses, descriptions de projets).
3. **Pagination par Curseurs (`startAfter`) :**
   La fonction `listLeads` ne charge pas les listes en mémoire par décalage aveugle (`offset`), mais s'appuie sur le snapshot du dernier identifiant reçu (`startAfter(cursorSnap)`), garantissant des temps de réponse O(1) quelle que soit la profondeur de la liste de prospects.

---

## 2. Sécurité Strictement Préservée & Isolation des Caches

- **Zéro Cache Public sur le CRM :**
  Aucune route d'API administrative ne renvoie d'en-tête `Cache-Control: public`. Toutes les réponses retournent `Cache-Control: private, no-cache, no-store, must-revalidate`.
- **Vérification d'Identité par Token Firebase (`verifyAdminToken`) :**
  Chaque requête vers `/api/admin/*` exige un en-tête `Authorization: Bearer <ID_TOKEN>`. Le token est décodé par le SDK Firebase Admin et vérifié (revocation check, email vérifié, claim `admin: true`).
- **Isolation Totale des Données Personnelles :**
  Les collections `quotes` et `contacts` restent totalement inaccessibles depuis le SDK client dans les règles Firestore. Les données de contact des clients de SLAAC Voyages ne peuvent en aucun cas fuiter vers des tiers ou des crawlers publics.
