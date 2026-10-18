# Mesure des Performances Locales, Analytics & Intégration CRM
## SLAAC Voyages | Tableau de Bord du Référencement Local & Conversion

---

### 1. Distinction Essentielle entre Clics et Conversions Commerciales

En marketing local, une confusion fréquente consiste à assimiler un clic sur un bouton à une transaction commerciale réussie :
- **Un clic sur « Appeler »** n'est pas un appel décroché (l'internaute peut raccrocher avant la tonalité ou tomber sur ligne occupée).
- **Une demande d'itinéraire** n'est pas une visite effective en agence (le client peut consulter la distance depuis son bureau sans se déplacer).
- **Un clic sur le bouton WhatsApp** n'est pas un message envoyé (le prospect peut ouvrir l'application sans valider l'envoi de son texte).
- **Une demande de devis enregistrée** n'est pas une vente conclue (seule la facturation et l'émission du billet ou du voucher constituent une conversion finale).

---

### 2. Matrice des Indicateurs de Mesure

#### A. Indicateurs Google Business Profile (Performances Moteur)
*Ces indicateurs nécessitent l'accès gestionnaire à la fiche vérifiée :*
- **Recherches directes :** Utilisateurs ayant cherché explicitement « SLAAC Voyages ».
- **Recherches de découverte :** Utilisateurs ayant cherché une catégorie générique (« agence de voyage dakar », « billetterie sénégal »).
- **Vues de la fiche :** Sur Google Search (desktop/mobile) vs sur Google Maps.
- **Actions des clients :** Visites du site, demandes d'itinéraire, appels téléphoniques.

#### B. Indicateurs du Site Web (`slaacvoyages.com`)
*Mesurés via le module d'analytics interne et balises UTM :*
- Sessions issues du référencement local (`utm_campaign=google_business_profile`).
- Taux d'ouverture de la modale de devis (`quote_start` avec source locale).
- Soumissions effectives de formulaires (`quote_submit` et `contact_submit`).

#### C. Indicateurs CRM Firestore & Pipeline Commercial
*Enregistrés dans Firestore (`quotes` et `contacts`) :*
- Volume de leads qualifiés étiquetés `source: "google_business_profile"` ou `source: "contact-local"`.
- Délai moyen de prise en charge par l'équipe de Dakar Plateau (SLA cible < 2h).
- Taux de concrétisation devis -> vente payée.

---

### 3. Tableau de Suivi Avant / Après l'Intervention

| Indicateur | Avant Intervention (Prompt 08) | Situation Actuelle (Branche Locale) | Objectif à 90 Jours | Méthode de Mesure |
|---|---|---|---|---|
| **Fiche GBP Identifiée** | Non revendiquée / Confuse avec restaurant | Fiche documentée & auditée pour Dakar Plateau | Fiche vérifiée & active avec photos | Tableau de bord Google Business |
| **NAP du Site** | Téléphone unique, adresse brute sans repère | NAP centralisé (`src/lib/site.ts`), double ligne, horaires | 100% cohérent sur 10 annuaires | `reports/08/nap-audit.csv` |
| **Bouton Itinéraire Maps** | Absent (simple iframe statique Djolof Chicken) | Bouton interactif direct API Google Maps | Maintenu | Code déployé dans `/contact` |
| **Bouton Click-to-Call** | Absent sur `/contact` (uniquement lien WhatsApp) | 2 numéros `tel:` cliquables (accueil & commercial) | Maintenu | Code déployé dans `/contact` |
| **Données Structurées** | `TravelAgency` avec coordonnées approximatives | `TravelAgency` avec GPS exact, `hasMap`, `contactPoint` | Zéro avertissement Google Search | `src/lib/seo-schema.ts` |
| **Traçabilité UTM** | Inexistante | Plan de marquage UTM prêt pour la fiche GBP | Suivi des sessions actives | Module analytics & CRM |
