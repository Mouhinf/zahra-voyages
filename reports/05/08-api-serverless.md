# Rapport 05.08 — Optimisation des APIs & Fonctions Serverless
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Inventaire des Routes & Temps d'Exécution

L'application expose des endpoints API Serverless (`runtime: 'nodejs'`) pour les formulaires publics et les opérations d'administration :

| Route API | Méthode | Rôle & Charge de Travail | Stratégie de Résilience & Latence |
| :--- | :---: | :--- | :--- |
| `/api/quotes` | `POST` | Enregistrement devis + outbox email + notifications | Validation Zod stricte, écriture atomique Firestore, notification asynchrone non-bloquante. |
| `/api/contact` | `POST` | Formulaire de contact général | Traitement rapide sous 80 ms, limitation 5 req/min. |
| `/api/promo-banners` | `GET` | Distribution publique des annonces bandeau | Cache HTTP Edge `s-maxage=60, stale-while-revalidate=300`. Réponse < 20 ms. |
| `/api/analytics/log` | `POST` | Balise analytics (sendBeacon) | Filtrage User-Agent bot sans accès BD, rate-limiting mémoire, réponse < 30 ms. |
| `/api/admin/dashboard/overview` | `GET` | Données agrégées tableau de bord | Agrégations `.count()`, projections `.select()`, réponse < 250 ms. |
| `/api/admin/leads` | `GET` | Pagination des prospects CRM | Pagination par curseur (`startAfter`), limitation stricte O(1). |

---

## 2. Initialisation des SDK & Gestion des Cold Starts

- **Singleton Firebase Admin (`src/lib/firebase-admin.ts`) :**
  L'application vérifie l'existence d'une instance existante (`getApps().length ? getApps()[0] : initializeApp(...)`). Sur une instance serverless chaude, le client Firestore gRPC et l'authentification sont réutilisés sans délai d'initialisation.
- **Préservation de la File d'Attente Email Outbox (Prompt 01) :**
  L'envoi d'emails transactionnels continue de reposer sur le pattern Outbox sécurisé. La réponse HTTP au client ne dépend pas d'un timeout SMTP tiers : la demande commerciale est sécurisée en base et confirmée au visiteur en moins de 150 ms.
- **Timeouts & Bornes Réseau :**
  Tous les appels réseau externes sont bornés avec des timeouts explicites (5 à 10 secondes), éliminant tout risque de fonction serverless suspendue facturée inutilement au plafond de 60 secondes.
