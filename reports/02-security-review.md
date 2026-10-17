# RAPPORT 02/12 — PHASE J : REVUE DE SÉCURITÉ ET PROTECTION DES DONNÉES

## 1. Menaces identifiées & Mesures de protection appliquées

| Vecteur de risque | Mesure appliquée | Fichiers concernés |
| :--- | :--- | :--- |
| **Spam automatisé par bots** | Pot de miel invisible (`website`) : rejet silencieux avec retour 200 sans écriture en base ni envoi d'email | `quote-schema.ts`, `api/quotes/route.ts`, `api/contact/route.ts` |
| **Déni de service / Flood** | Rate limiting strict par adresse IP (5 soumissions / 5 min / IP) | `api/quotes/route.ts`, `api/contact/route.ts`, `lib/rate-limit.ts` |
| **Surcharge de mémoire (DDoS)** | Plafonnement de la taille brute des requêtes HTTP (64 Ko pour devis, 32 Ko pour contact) | `api/quotes/route.ts`, `api/contact/route.ts` |
| **Injection & Champs arbitraires** | Validation stricte Zod avec bornage de chaque chaîne et rejet automatique des clés non autorisées | `quote-schema.ts`, `contact-schema.ts` |
| **Crash Firestore (`undefined`)** | Nettoyage récursif `cleanFirestoreData` avant écriture Firestore | `quote-schema.ts`, `api/quotes/route.ts`, `api/contact/route.ts` |
| **Usurpation d'identité admin** | Vérification cryptographique des JWT Firebase Admin (`verifyAdminToken`) sur toutes les mutations CRM | `api/admin/leads/route.ts`, `lib/firebase-admin.ts` |
| **Fuite de données clients** | Firestore Rules interdisant tout accès en lecture et écriture direct côté client sur `quotes` et `contacts` | `firestore.rules` |

## 2. Déduplication et Idempotence

- Double soumission client bloquée à deux niveaux :
  1. Jeton de session client `clientSubmissionId` sur fenêtre de 10 minutes.
  2. Empreinte SHA-256 (`ip + phone + service + destination + departureDate`) sur fenêtre de 2 minutes.
- Résultat : aucune notification email en double vers l'agence ou le client, aucun encombrement de l'outbox Firestore.

## 3. Conformité et Confidentialité

- Aucune donnée bancaire n'est demandée ou stockée sur les formulaires de devis.
- Les données de contact recueillies (nom, téléphone, email) sont strictement limitées à la finalité de traitement de la demande de devis et au suivi commercial interne par SLAAC Voyages.
