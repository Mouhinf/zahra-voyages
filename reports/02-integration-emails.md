# RAPPORT 02/12 — PHASES E & I : FIABILITÉ BACKEND, IDEMPOTENCE ET INTÉGRATION EMAIL

## 1. Objectifs & Constats d'audit

- **Constats initiaux** :
  - Sur `/api/quotes`, un double-clic ou une perte de connexion temporaire du client pouvait soumettre deux fois la même demande, générant deux références de devis distinctes et déclenchant deux fois la chaîne de notifications email à l'agence et au client.
  - Absence de nettoyage centralisé des clés `undefined` pour Firestore.
  - Nécessité de garantir la continuité parfaite avec l'architecture transactionnelle Outbox introduite lors du Prompt 01 (`sendQuoteNotifications`, `sendContactNotifications`).

## 2. Solutions d'Idempotence et de Fiabilité implémentées

### A. Idempotence à deux niveaux (`/api/quotes`)
1. **Niveau 1 — Jeton de soumission client (`clientSubmissionId`)** :
   Chaque ouverture du formulaire ou session de saisie génère un jeton unique côté client. Si une requête ultérieure arrive avec le même `clientSubmissionId` dans un intervalle de 10 minutes, l'API Firestore vérifie son existence et renvoie le document déjà créé :
   `{ ok: true, id: existingDoc.id, reference: existingDoc.reference, deduped: true }`
   Aucun second document n'est écrit, et aucune notification n'est réémise.
2. **Niveau 2 — Empreinte cryptographique à court terme (2 minutes)** :
   Si le jeton n'est pas fourni (ex: appel API externe direct), un hash SHA-256 est calculé sur :
   `ip | phone | service | destination | departureDate`
   Si une soumission rigoureusement identique a été reçue moins de 120 secondes plus tôt, l'API déduplique la requête et retourne le même statut `deduped: true`.

### B. Nettoyage strict des données (`cleanFirestoreData`)
La fonction utilitaire récursive `cleanFirestoreData` parcourt l'ensemble des champs du payload avant toute opération `collection('quotes').add()` ou `collection('contacts').add()`.
Toutes les clés associées à `undefined` sont supprimées, ce qui élimine 100 % des rejets Firestore pour cause de valeur non prise en charge.

### C. Préservation de l'Outbox Email Transactionnelle (Prompt 01)
- L'appel à `sendQuoteNotifications(docRef.id, quoteEmailData)` est maintenu dans le flux asynchrone sécurisé :
  - L'accusé de réception client (si email présent).
  - La notification de l'agence (`contact@slaacvoyages.com`).
  - La notification du responsable (`mdslaacvoyages@gmail.com`).
- L'échec éventuel d'un fournisseur email ne bloque jamais la réponse 200 au client et ne détruit pas le lead commercial : le statut de notification est consigné (`notifyStatus: 'pending'` ou `'failed'`), permettant un rejeu immédiat depuis le CRM d'administration.
- Même robustesse assurée pour `sendContactNotifications` dans `/api/contact`.

### D. Traçabilité marketing complète (Attribution UTM)
Les métadonnées suivantes sont collectées et stockées sur les documents `quotes` et `contacts` :
- `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`
- `referrer` (page source)
- `landingPage` (point d'entrée sur le site)
- `source` (bouton ou emplacement précis de déclenchement du devis)
