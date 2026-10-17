# Rapport d'Audit Exhaustif des Formulaires et Parcours de Conversion — SLAAC Voyages (Phase 02/12)

> **Date :** 17 octobre 2026  
> **Branche Git :** `feat/slaac-forms-crm`  
> **Auteur :** Lead Architect & CRO Specialist  
> **Périmètre :** Formulaires publics, dialogues modaux, points de contact, endpoints API (`/api/quotes`, `/api/contact`, `/api/newsletter`), CRM Admin et sécurité des flux.

---

## 1. Synthèse Globale de l'Audit

L'audit approfondi du code source de SLAAC Voyages a identifié **5 points d'entrée majeurs** et **20 parcours de services**. 

### Découvertes Critiques :
1. **Anomalie Majeure sur `/contact` :**  
   Dans la page dédiée [`src/app/contact/page.tsx`](file:///home/mouhammad/zahra-voyages/src/app/contact/page.tsx#L42-L49), la fonction `onSubmit` n'effectuait aucun appel réseau `fetch('/api/contact')`. Elle affichait un toast de succès purement factice sans rien enregistrer dans Firestore ni déclencher d'email.
2. **Absence d'Idempotence sur les Devis :**  
   L'endpoint [`/api/quotes`](file:///home/mouhammad/zahra-voyages/src/app/api/quotes/route.ts) ne possédait pas de clé de déduplication ou de soumission contrôlée (`clientSubmissionId`). Un double-clic d'un visiteur sur mobile générait deux devis distincts et déclenchait des notifications en double.
3. **Incohérences de Typage Frontend / Backend :**  
   - `travelers` était géré comme un `number` côté formulaire React Hook Form (`z.coerce.number().min(1)`), puis sérialisé en `string` à l'envoi, tandis que l'API l'acceptait en chaîne libre.
   - La validation de cohérence chronologique (`returnDate >= departureDate`) était absente.
   - Les formulaires conditionnels dans [`quote-request-dialog.tsx`](file:///home/mouhammad/zahra-voyages/src/components/layout/quote-request-dialog.tsx) utilisaient des grilles à 2 colonnes (`grid-cols-2`) non adaptées aux écrans étroits de smartphones (320px - 375px).
4. **Manque de Contextualisation Métier par Prestation :**  
   - Les transferts AIBD utilisaient le formulaire de transport aérien générique (classes de vol) au lieu des informations de vol, heure d'atterrissage, nombre de bagages et destination précise.
   - Les demandes Omra, visas et voyages internationaux ne recueillaient pas les spécificités requises dès le premier contact.
5. **Promesses Non Contrôlées :**  
   Le formulaire d'accueil [`home-contact-quick.tsx`](file:///home/mouhammad/zahra-voyages/src/components/sections/home-contact-quick.tsx#L78) promettait une réponse ferme « sous 24h » sans garantie opérationnelle.

---

## 2. Inventaire Exhaustif des Formulaires et Parcours

| N° | Page / Emplacement | CTA / Déclencheur | Formulaire / Modal | Endpoint API | Collection Firestore | Notifications Déclenchées | Problèmes Identifiés | Priorité |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: |
| **1** | Header, Hero, Services, English (`/`) | `QuoteRequestButton` ("Demander un devis") | `QuoteRequestModal` (Générique) | `POST /api/quotes` | `quotes` | Client + Agence + Manager (Prompt 01) | Pas d'idempotence client, confirmation toast trop fugace, pas d'écran récapitulatif avec référence persistante. | **Haute** |
| **2** | `/contact` | "Envoyer ma demande" | Formulaire local `ContactPage` | **AUCUN** (omission dans le code) | **Aucune** | **Aucune** | **CRITIQUE :** Le formulaire n'appelait pas `/api/contact` et simulait un succès. | **P0 (Urgent)** |
| **3** | Accueil (`home-contact-quick.tsx`) | "Envoyer mon message" | `HomeContactQuick` | `POST /api/contact` | `contacts` | Client + Agence + Manager | Promesse non vérifiable "sous 24h", pas de référence dossier affichée. | **Moyenne** |
| **4** | Footer (Toutes pages) | "S'inscrire" | Formulaire Newsletter | `POST /api/newsletter` | `newsletter` | Bienvenue client + Notice agence | Pas de consentement explicite checkbox RGPD / CASL si requis. | **Basse** |
| **5** | `/hebergement` | "Demander un devis" sur carte | `QuoteRequestModal` (`service="hebergement"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Champs enfants, nombre de chambres et budget non contextualisés. | **Haute** |
| **6** | `/transport` (Transfert AIBD) | "Réserver" / "Demander un devis" | `QuoteRequestModal` (`service="transport"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Demande une classe aérienne au lieu de l'heure d'arrivée du vol et des bagages. | **Haute** |
| **7** | `/transport` (Location privée) | "Demander un devis" | `QuoteRequestModal` (`service="transport"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Manque la durée de location et option avec chauffeur. | **Moyenne** |
| **8** | `/voyages-croisieres` | "Demander un devis" | `QuoteRequestModal` (`service="voyages-croisieres"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Destination préremplie mais pas de choix de dates flexibles. | **Moyenne** |
| **9** | `/excursions` | "Demander un devis" / "Circuit sur mesure" | `QuoteRequestModal` (`service="excursions"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Date d'excursion isolée, pas de nombre d'enfants/adultes distinct. | **Moyenne** |
| **10** | `/tourisme-affaires` | "Demander un devis" | `QuoteRequestModal` (`service="tourisme-affaires"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Manque le nom de l'entreprise et la fonction du contact. | **Haute** |
| **11** | `/assistance-voyage` (Visa) | "Demander un devis" | `QuoteRequestModal` (`service="assistance-visa"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Doit rappeler fermement qu'aucun visa n'est garanti d'avance. | **Haute** |
| **12** | `/assistance-voyage` (Assurance) | "Demander un devis" | `QuoteRequestModal` (`service="assurance-voyage"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Manque les dates de couverture et pays visités. | **Moyenne** |
| **13** | `/assistance-voyage` (Université) | "Demander un devis" | `QuoteRequestModal` (`service="preinscription-universitaire"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Manque le niveau d'études visé et l'année académique. | **Moyenne** |
| **14** | `/assistance-voyage` (Rendez-vous) | "Demander un devis" | `QuoteRequestModal` (`service="prise-de-rendez-vous"`) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Pas de créneau horaire souhaité ni motif explicite. | **Moyenne** |
| **15** | Assistance Chine / Asie | "Demander un devis" | `QuoteRequestModal` (générique) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Pas de distinction voyage d'affaires / approvisionnement usines. | **Moyenne** |
| **16** | Assistance Thaïlande / Dubaï | "Demander un devis" | `QuoteRequestModal` (générique) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Réutilise le devis générique sans guidage spécifique. | **Moyenne** |
| **17** | Omra / Séjours spirituels | "Demander un devis" | `QuoteRequestModal` (générique) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Pas de champ période (Ramadan, mois spécifique), ni type d'hôtel (proche Haram). | **Haute** |
| **18** | `/dakar-2026` (Transferts & Séjours) | "Demander un devis" | `QuoteRequestModal` (sources multiples) | `POST /api/quotes` | `quotes` | Client + Agence + Manager | Paramètre `source` bien transmis mais champs non contextualisés. | **Moyenne** |
| **19** | `/assistance-voyage` (Bouton WhatsApp) | "Nous écrire sur WhatsApp" | Lien externe direct | N/A | N/A | N/A | Bouton imbriqué dans une balise `<a>` (syntaxe HTML invalide). | **Haute** |
| **20** | Assistant Chatbot | "Envoyer" | `POST /api/chat` | Session locale | N/A | N/A | Pas de conversion directe en lead Firestore. | **Basse** |

---

## 3. Plan d'Action par Priorité

1. **P0 (Immédiat) :** Corriger [`src/app/contact/page.tsx`](file:///home/mouhammad/zahra-voyages/src/app/contact/page.tsx) pour brancher l'appel `POST /api/contact` avec honeypot et affichage de la confirmation.
2. **P0 (Immédiat) :** Corriger l'imbrication HTML invalide `<a><QuoteRequestButton></a>` dans [`src/app/assistance-voyage/page.tsx`](file:///home/mouhammad/zahra-voyages/src/app/assistance-voyage/page.tsx).
3. **P1 (Architecture & Contrats) :** Créer un schéma Zod unifié et partagé ([`src/lib/schemas/quote-schema.ts`](file:///home/mouhammad/zahra-voyages/src/lib/schemas/quote-schema.ts)) synchronisant strictement le frontend et le backend.
4. **P1 (Idempotence & Double-Clic) :** Implémenter la déduplication par `clientSubmissionId` et fenêtre temporelle dans [`/api/quotes`](file:///home/mouhammad/zahra-voyages/src/app/api/quotes/route.ts).
5. **P1 (UX Modale Contextuelle) :** Refondre [`src/components/layout/quote-request-dialog.tsx`](file:///home/mouhammad/zahra-voyages/src/components/layout/quote-request-dialog.tsx) avec sélection contextuelle par onglets/sections adaptées aux prestations (Hébergement, AIBD, Excursions, Omra, Affaires, Visa) et écran de confirmation avec référence permanente et bouton WhatsApp.
6. **P2 (CRM & Attribution) :** Enrichir [`src/lib/crm.ts`](file:///home/mouhammad/zahra-voyages/src/lib/crm.ts) et l'interface admin avec priorités commerciales, date de rappel, filtres par statut et attribution des sources UTM.
