# Refonte des Pages de Services Commerciales — SLAAC Voyages
> **Objectif :** Doter chaque prestation d'une page commerciale claire, transparente et hautement rassurante, levant les freins à l'achat et guidant naturellement vers la demande de devis.  
> **Pages Traitées :** `/transport`, `/hebergement`, `/excursions`, `/tourisme-affaires`, `/assistance-voyage`, `/dakar-2026`, `/about`, `/contact`  
> **Date :** 17 Octobre 2026  
> **Auteur :** Lead UX/CRO & Senior Frontend Engineer  

---

## 1. Vue d'Ensemble des Améliorations par Métier

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SYNTHÈSE DES GAINS COMMERCIAUX PAR PAGE                     │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ PAGE SERVICE      │ AMÉLIORATION CLÉ APPORTÉE (PROMPT 04)                   │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/transport`      │ Affichage de la grille forfaitaire officielle AIBD      │
│                   │ (Dakar 30k FCFA, Saly 35k FCFA) + Garantie Vol Retardé  │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/hebergement`    │ 4 Badges de sécurité critiques : Fibre optique vérifiée,│
│                   │ Groupe électrogène 24/7, Réserve d'eau et Gardiennage   │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/excursions`     │ Mise en valeur des guides d'État assermentés et circuits│
│                   │ privatifs climatisés (Gorée, Bandia, Lac Rose)          │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/tourisme-       │ Offre MICE structurée : conventions entreprises,        │
│ affaires`         │ facturation certifiée conforme (TVA/BRS) & salons VIP   │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/assistance-     │ Sécurisation juridique consulaire (pas de fausse        │
│ voyage`           │ promesse de visa) + accompagnement Chine/Dubaï/Schengen │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/dakar-2026`     │ Cartographie des 3 pôles (Dakar, Diamniadio, Saly),     │
│                   │ 4 packages d'hospitalité et correction du champ CRM     │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ `/about` &        │ Enregistrement officiel République du Sénégal (NINEA,   │
│ `/contact`        │ RCCM, Licence d'exploitation) et adresse Plateau        │
└───────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 2. Analyse Détaillée des Interventions

### 2.1. Page Transport (`/transport`)
- **Levée du frein numéro 1 :** L'absence d'indication tarifaire obligeait les clients à quitter le site pour réserver chez des VTC informels.
- **Grille Tarifaire Intégrée :**
  - *AIBD ⇄ Dakar Centre (Plateau, Fann, Médina) : 30 000 FCFA (~46 €)*
  - *AIBD ⇄ Almadies / Ngor / Ouakam : 35 000 FCFA (~53 €)*
  - *AIBD ⇄ Saly Portudal / Somone : 35 000 FCFA (~53 €)*
  - *Mise à disposition Berline journée intra-Dakar : 60 000 FCFA (~90 €)*
- **Bandeau "Garantie Vol Retardé" :** Mention rassurante précisant le suivi en temps réel du statut du vol et l'absence de frais d'attente jusqu'à 3h de retard.
- **Inclusions Explicites :** Péage autoroute à péage inclus, accueil nominatif avec pancarte aux arrivées passagers, climatisation, bouteille d'eau fraîche.

### 2.2. Page Hébergement (`/hebergement`)
- **Prise en compte des angoisses locales :** Les coupures d'électricité (Senelec) et d'eau (SDE) constituent la première hantise des voyageurs d'affaires et de la diaspora à Dakar.
- **Bandeau de Réassurance Technique :**
  - `⚡ Groupe Électrogène 24/7 (Zéro coupure)`
  - `📶 Fibre Optique Vérifiée (Idéal télétravail)`
  - `💧 Réserve d'Eau & Surpresseur (Alimentation continue)`
  - `🛡️ Gardiennage & Concierge (Sécurité 7j/7)`

### 2.3. Page Dakar 2026 (`/dakar-2026`)
- **Correction Critique du Contrat de Données :** Remplacement de `service: 'tourisme-affaires'` par la valeur canonique reconnue par `quoteSchema` (`service: 'affaires'`), évitant tout échec de validation à la soumission du devis.
- **Structuration en 3 Pôles :** Pôle 1 (Dakar Centre / Corniche), Pôle 2 (Diamniadio / Dakar Arena / Stade Abdoulaye Wade), Pôle 3 (Saly Portudal / Sports nautiques).
- **Conformité Charte Olympique :** Mention explicite d'opérateur réceptif indépendant pour les délégations, la billetterie officielle des épreuves restant l'exclusivité du COJOJ.

### 2.4. Page Assistance Voyage (`/assistance-voyage`)
- **Déontologie & Protection Juridique :** Ajout de l'encadré légal obligatoire rappelant que l'octroi d'un visa relève de la compétence souveraine des autorités consulaires.
- **Remplacement des Images Déconnectées :** Substitution de l'image externe Unsplash par un actif Cloudinary certifié.

### 2.5. Pages Institutionnelles (`/about` et `/contact`)
- **Consolidation des Preuves Légales :** Affichage transparent du siège social à Dakar Plateau (rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage), du NINEA, du RCCM et de la licence d'exploitation touristique.
- **Email Professionnel Unifié :** Affichage de `contact@slaacvoyages.com` sur toutes les interfaces publiques, avec `mdslaacvoyages@gmail.com` réservé à l'administration interne.
