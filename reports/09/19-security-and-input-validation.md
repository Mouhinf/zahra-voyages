# Sécurité, Validation des Données et Résilience API
## SLAAC Voyages | Protection des Flux Bilingues & Anti-Abus

### 1. Niveaux de Protection sur les Formulaires
L'ouverture d'un formulaire bilingue expose le site à des soumissions internationales automatisées et du spam. Pour garantir l'intégrité de la plateforme :
1. **Validation Stricte par Schémas Zod** :
   - Côté client et côté serveur (`src/lib/schemas/quote-schema.ts` et `contact-schema.ts`).
   - Rejet immédiat de toute valeur non conforme (`status 400 Bad Request` avec détail des champs).
2. **Protection Anti-Spam Pot de Miel (Honeypot)** :
   - Champ `website` invisible pour les humains dans le DOM.
   - Si un bot remplit ce champ, l'API retourne un faux succès (`{ ok: true, deduped: true }`) sans écrire dans Firestore ni déclencher d'email transactionnel.
3. **Limitation de Débit (Rate Limiting)** :
   - Protection IP : 5 requêtes par tranche de 5 minutes par adresse IP sur `/api/contact` et `/api/quotes`.
   - Code HTTP `429 Too Many Requests` en cas de dépassement.
4. **Déduplication par Empreinte Cryptographique (Fingerprinting)** :
   - Calcul de hash SHA-256 sur `(email + message)` ou `(email + service + destination)`.
   - Les soumissions identiques sous un intervalle de 10 minutes sont dédupliquées pour éviter les doublons accidentels causés par des doubles-clics sur mobile.
5. **Nettoyage Strict Firestore (`cleanFirestoreData`)** :
   - Élimination récursive de toute valeur `undefined` avant écriture dans Firestore pour éviter les rejets fatals du SDK Firebase Admin.

### 2. Échappement HTML dans les Templates d'Email
Tous les champs saisis par les utilisateurs sont systématiquement passés par `escapeHtml()` avant injection dans le corps des emails HTML pour prévenir toute tentative d'injection de script ou de phishing par email.
