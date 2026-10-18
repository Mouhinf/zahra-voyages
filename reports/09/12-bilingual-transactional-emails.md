# Emails Transactionnels Bilingues & Notifications d'Alerte
## SLAAC Voyages | Moteur d'Emails et Robustesse Outbox

### 1. Cycle de Vie Transactionnel d'une Demande
Lorsqu'un prospect soumet un formulaire de devis ou de contact, le système déclenche un pipeline de notification transactionnel résilient via l'Outbox Firestore :
1. **Accusé de réception client** : envoyé à l'adresse email saisie par le prospect dans sa langue (`fr` ou `en`).
2. **Notification agence** : envoyée à l'équipe commerciale (`contact@slaacvoyages.com`).
3. **Notification alerte direction** : envoyée au responsable (`mdslaacvoyages@gmail.com`).

### 2. Accusé de Réception Client en Anglais (`lang === 'en'`)
Implémenté dans `src/lib/email/templates.ts` :
- **Objet** : `Acknowledgment of your quote request — [REF-XXXX] | SLAAC Voyages`
- **Formule de salutation** : `Dear {Name},`
- **Texte de confirmation** : `Thank you for choosing SLAAC Voyages. We have successfully received your custom quote request.`
- **Tableau récapitulatif** : Traduction des en-têtes de colonnes (*File Reference*, *Requested Service*, *Departure Date*, *Travelers*, *Estimated Budget*).
- **Disclaimer juridique traduit** :
  > *"Important Notice: This email serves as an acknowledgment of receipt confirming that your request has been taken into account by SLAAC Voyages advisors. It does not constitute a confirmed booking or a guarantee of visa issuance or flight tickets. Our travel consultants will contact you within 24 to 48 business hours with a personalized offer."*
- **Bouton WhatsApp direct** : `Chat on WhatsApp` / `Call +221 77 312 90 90`.

### 3. Indicateur Linguistique dans les Alertes Équipe
Pour alerter immédiatement l'équipe de Dakar Plateau :
- Dans l'email agence et direction, une ligne en gras stipule :
  - `Langue du client : Anglais (English)` pour les leads en anglais.
  - `Langue du client : Français (French)` pour les leads en français.
- Cette mention évite toute méprise et permet de répondre dès la première relance dans la langue maternelle du voyageur.

### 4. Tests et Résilience Outbox
La suite de tests `tests/email-system.test.mjs` valide l'intégrité HTML/Text, le calcul de la clé d'idempotence (`contacts_{id}_customer`), et la non-régression du backoff exponentiel.
