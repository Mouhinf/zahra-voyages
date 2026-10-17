# RAPPORT 02/12 — PHASE B : SCHÉMAS DE VALIDATION ET CONTRATS D'API

## 1. Objectifs & Constats d'audit

Avant cette intervention :
- Les validations client et serveur divergeaient sur plusieurs champs clés :
  - `travelers` était contraint en entier strict `z.coerce.number().min(1)` côté client mais attendu en chaîne (`string`) par l'API serveur, forçant des transformations manuelles et risquant d'envoyer des valeurs incohérentes.
  - La route `/api/quotes` ne validait pas la cohérence des dates (`returnDate < departureDate` était permis).
  - Les numéros de téléphone n'avaient pas de validation de format structurée (chiffres utiles, indicatifs internationaux, etc.).
  - Il n'existait pas de protection systématique contre l'envoi de champs `undefined` à Firestore (ce qui provoquait des erreurs `Unsupported field value: undefined` lors de l'appel à `.add()` ou `.set()`).
  - Les formulaires de contact (`/contact`, `home-contact-quick.tsx`) dupliquaient leurs schémas et n'étaient pas synchronisés avec l'API `/api/contact`.

## 2. Architecture des schémas partagés

Deux nouveaux fichiers de validation universels ont été créés dans `src/lib/schemas/` :

### `src/lib/schemas/quote-schema.ts`
- **Typage exhaustif des services** : `SERVICE_VALUES` couvre les 10 prestations SLAAC Voyages :
  1. `hebergement`
  2. `transport`
  3. `voyages-croisieres`
  4. `excursions`
  5. `tourisme-affaires`
  6. `reservation-express`
  7. `assistance-visa`
  8. `assurance-voyage`
  9. `preinscription-universitaire`
  10. `prise-de-rendez-vous`
- **Support des caractères internationaux et Unicode** :
  - `name` autorise tous les caractères alphabétiques et accentués (ex : « Éléonore », « Abdou-Rahmane »), longueur minimale de 2 caractères et maximale de 100 caractères.
  - `phoneRegex` valide les indicatifs internationaux standards (`+`, espaces, tirets, parenthèses, de 6 à 30 caractères) compatible Sénégal (+221), France (+33), etc.
- **Règle de raffinement des dates** :
  - Si `departureDate`, `returnDate` et `roundTrip` sont présents, le schéma vérifie que `returnDate >= departureDate`. Dans le cas contraire, une erreur explicite est renvoyée sur le champ `returnDate`.
- **Champs contextuels par service** :
  - Hébergement : `nights`, `roomType`
  - Transport : `transportClass`, `roundTrip`, `departureDate`, `returnDate`
  - Croisières : `durationDays`, `cabinType`
  - Excursions : `excursionDate`, `pickupLocation`
  - Tourisme d'affaires : `attendees`, `eventType`, `companyName`
  - Assistance voyage / études : `studyCity`, `studyDegree`, `appointmentReason`
- **Traçabilité marketing (UTM)** :
  - `source`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `referrer`, `landingPage`
- **Idempotence & Sécurité** :
  - `clientSubmissionId` : jeton de soumission unique généré côté client
  - `website` : pot de miel invisible pour capture des robots spammeurs
- **Utilitaire `cleanFirestoreData`** :
  - Élimine récursivement toute clé avec valeur `undefined` avant toute opération Firestore.

### `src/lib/schemas/contact-schema.ts`
- Normalisation du formulaire de contact avec support international du téléphone, validation d'email, pot de miel anti-spam et attribution marketing.

## 3. Statut de conformité

- Typage TypeScript : aligné entre le client et l'API.
- Sécurité Firestore : protégé contre les valeurs `undefined`.
- Compatibilité descendante : totale avec les enregistrements CRM historiques.
