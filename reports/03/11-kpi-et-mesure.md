# Cadre de Mesure de la Performance & Tableau de Bord KPI — SLAAC Voyages
> **Objectif :** Définir les indicateurs clés de performance (KPI) permettant de piloter avec rigueur la visibilité, la conversion, la rentabilité et l'excellence opérationnelle de SLAAC Voyages.  
> **Classification :** [OBSERVÉ] Métriques techniques et d'attribution disponibles sur la stack Next.js/Firestore | [INFÉRÉ] Cibles et seuils de performance sectoriels  
> **Date :** 17 Octobre 2026  
> **Auteur :** Lead Data Analyst & Responsable CRO  

---

## 1. Architecture Globale du Système de Mesure

Le pilotage de la croissance de SLAAC Voyages repose sur quatre piliers interconnectés, reliant le comportement de navigation en amont jusqu'à la signature du contrat et l'encaissement dans le CRM :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LES QUATRE PILIERS DE MESURE SLAAC                       │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│ 1. VISIBILITÉ   │ 2. EXPÉRIENCE   │ 3. CONVERSION   │ 4. PERFORMANCE CRM    │
│ Notoriété, SEO  │ Rapidité web,   │ Taux de devis,  │ Closing, Délai de     │
│ & Google Maps   │ Ergonomie mobile│ Clics WhatsApp  │ réponse, Chiffre d'Aff│
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

---

## 2. Indicateurs Détaillés par Pilier

---

### Pilier 1 : Visibilité, Notoriété & Présence Locale

Ce pilier mesure la capacité de l'agence à attirer une audience qualifiée et intentionniste à Dakar et à l'international.

| Indicateur Clé | Outil de Mesure | Définition & Méthode de Calcul | Cible Mensuelle M+3 |
| :--- | :--- | :--- | :---: |
| **Clics & Impressions SEO Organiques** | Google Search Console | Volume d'internautes accédant au site via les résultats naturels Google | > 3 000 clics / mois |
| **Actions sur Fiche Google Maps (GBP)** | Tableau de bord Google Business | Somme des appels téléphoniques, demandes d'itinéraires et clics vers le site | > 450 actions / mois |
| **Note Moyenne des Avis Google** | Google Maps | Moyenne arithmétique des notes attribuées par les clients | **≥ 4,8 / 5 étoiles** |
| **Nombre d'Avis Clients Vérifiés** | Google Maps | Nombre total d'avis authentiques publiés avec commentaire textuel | > 40 avis à M+3 |
| **Portée Organique Réseaux Sociaux** | Meta Business / TikTok | Vues cumulées des vidéos éducatives (conseils voyage, AIBD, Dakar) | > 25 000 vues / mois |

---

### Pilier 2 : Expérience Utilisateur & Performance Technique

Ce pilier garantit que l'infrastructure technique ne constitue jamais un frein à la conversion, particulièrement sur smartphone en réseau 3G/4G au Sénégal.

| Indicateur Clé | Outil de Mesure | Seuil Standard Requis | Objectif SLAAC |
| :--- | :--- | :--- | :---: |
| **Largest Contentful Paint (LCP)** | Vercel Analytics / PageSpeed | < 2,5 secondes (Bon) | **< 1,8 seconde** |
| **Interaction to Next Paint (INP)** | Vercel Analytics / PageSpeed | < 200 millisecondes | **< 100 millisecondes** |
| **Cumulative Layout Shift (CLS)** | Vercel Analytics / PageSpeed | < 0,1 (Stabilité visuelle) | **< 0,02** |
| **Taux d'Engagement Session** | Google Analytics 4 (GA4) | Sessions > 10s ou avec au moins 2 pages vues | **> 65%** |
| **Temps Moyen par Session** | Google Analytics 4 (GA4) | Durée moyenne passée sur le site par visiteur | **> 2 min 15 s** |

---

### Pilier 3 : Conversion Commerciale & CRO

Ce pilier surveille l'efficacité avec laquelle les visiteurs sont convertis en opportunités commerciales exploitables.

| Indicateur Clé | Formule de Calcul | Cible Standard | Règle d'Alerte |
| :--- | :--- | :---: | :--- |
| **Taux de Conversion Devis Global** | $\frac{\text{Devis Soumis}}{\text{Sessions Totales}} \times 100$ | **≥ 4,5%** | Alerte si < 2,5% sur 7 jours consécutifs |
| **Taux de Clic-to-WhatsApp** | $\frac{\text{Clics Bouton WhatsApp}}{\text{Sessions Mobiles}} \times 100$ | **≥ 6,0%** | Alerte si < 3,5% |
| **Taux d'Abandon de Formulaire** | $\frac{\text{Abandons en Étape 2}}{\text{Ouvertures Modale}} \times 100$ | **≤ 35%** | Alerte si > 50% (friction sur les champs requis) |
| **Coût par Lead (CPL) Payant** | $\frac{\text{Dépenses Publicitaires}}{\text{Leads Qualifiés Obtenus}}$ | **≤ 3 500 FCFA (~5,30 €)**| Alerte si > 5 000 FCFA |

---

### Pilier 4 : Performance CRM & Relation Client

Ce pilier, alimenté par le module CRM Firestore développé en Phase 02, mesure la concrétisation financière et la fidélisation.

| Indicateur Clé | Définition & Règle Métier | Objectif Opérationnel | Responsable |
| :--- | :--- | :---: | :--- |
| **Délai de Première Prise de Contact (SLA)**| Temps écoulé entre la soumission du devis et le premier appel/message de l'agence | **< 1 heure ouvrée** (max 2h) | Responsable Commercial |
| **Taux de Qualification des Demandes** | Pourcentage de leads avec numéro WhatsApp joignable et projet réel | **≥ 80%** | Équipe Commerciale |
| **Taux de Transformation Commerciale (Win Rate)**| Pourcentage de devis convertis en réservations effectives payées | **≥ 35%** (Transport/Excursions) <br> **≥ 20%** (Séjours/Vols) | Direction Commerciale |
| **Panier Moyen par Réservation (ARPB)** | Montant moyen hors taxes facturé par dossier client | > 65 000 FCFA (Global) | Direction Générale |
| **Taux de Récidive / Fidélisation (Repeat Rate)**| Pourcentage de clients réalisant une 2ème commande dans les 6 mois | **≥ 25%** | Pôle Conciergerie |

---

## 3. Plan de Marquage & Suivi d'Attribution (Data Tracking)

Pour garantir une visibilité complète dans Google Analytics 4 et le CRM sans compromettre la confidentialité des données personnelles :

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Événement Web   │ ────> │ Événement GA4   │ ────> │ Enregistrement  │
│ Clic WhatsApp   │       │ 'click_whatsapp'│       │ Firestore CRM   │
└─────────────────┘       └─────────────────┘       │ Avec UTMs       │
                                                    └─────────────────┘
```

1. **Événements GA4 Clés Standardisés :**
   - `quote_modal_opened` : Déclenchement de la modale de devis.
   - `quote_step_completed` : Passage avec succès à l'étape des coordonnées.
   - `quote_submission_success` : Enregistrement réussi dans l'API `/api/quotes` avec génération de la référence `DV-XXXX`.
   - `whatsapp_concierge_clicked` : Clic sur le bouton flottant WhatsApp avec contexte de page.
   - `phone_call_clicked` : Clic sur le lien direct d'appel téléphonique.
2. **Attribution Publicitaire dans Firestore :**
   - Chaque lead enregistré dans Firestore conserve de manière immuable ses paramètres marketing capturés lors de la visite (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `referrer`).
   - Cela permet à la direction de SLAAC Voyages de calculer précisément à la fin du mois quel canal (Google Search, Meta Ads ou SEO direct) a généré le chiffre d'affaires le plus rentable.

---

## 4. Rituels & Cadence de Pilotage Stratégique

- **Pulse Quotidien (10 minutes - Équipe Commerciale) :**
  - Revue des demandes de devis non traitées et des relances du jour (`nextFollowUpAt`).
  - Vérification des transferts AIBD prévus pour la nuit suivante.
- **Revue Hebdomadaire (45 minutes - Lead CRO & Équipe Technique) :**
  - Analyse du volume de leads par canal, taux de conversion des formulaires et métriques de bugs/erreurs.
  - Examen des avis Google Maps reçus et validation des réponses.
- **Comité Mensuel de Direction (1 heure 30 - Direction Générale) :**
  - Analyse du compte d'exploitation marketing (Dépenses publicitaires vs Marge brute générée).
  - Décision d'ajustement des budgets vers les scénarios 2 ou 3.
