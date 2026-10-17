# Audit UX/UI Initial & Baseline Visuelle — SLAAC Voyages
> **Périmètre :** État des lieux exhaustif du frontend avant refonte (Desktop, Tablette, Mobile)  
> **Méthode d'Audit :** Inspection statique du code source Next.js 15 + Rendu réel via Playwright Chromium sous résolutions cibles  
> **Captures Réalisées :** 11 captures enregistrées dans `reports/04/screenshots/`  
> **Date de l'Audit :** 17 Octobre 2026  
> **Auteur :** Lead Product Designer & Senior Frontend Engineer  

---

## 1. Inventaire des Captures d'Écran Initiales

Toutes les captures d'écran de l'état initial ont été prises sur le serveur local via Playwright (`scripts/take-initial-screenshots.mjs`) :

| Référence du Fichier | Écran & Configuration | Vue / Élément Audité |
| :--- | :--- | :--- |
| `initial-desktop-home.png` | Desktop 1280x800 | Page d'accueil, Hero carrousel, Header et bandeau d'annonces |
| `initial-mobile-home.png` | Mobile 390x844 (iPhone 12/13/14) | Page d'accueil mobile, lisibilité du Hero, compacité |
| `initial-mobile-menu.png` | Mobile 390x844 | Menu hamburger ouvert (Sheet Radix), liste des liens |
| `initial-quote-dialog.png` | Desktop 1280x800 | Modale universelle de devis, sélecteur de service et champs |
| `initial-hebergement.png` | Desktop 1280x800 | Catalogue hébergement, fiches résidences et filtres |
| `initial-transport.png` | Desktop 1280x800 | Page transport, tarification et formulaire navette AIBD |
| `initial-excursions.png` | Desktop 1280x800 | Page circuits & excursions, cartes d'offres et programmes |
| `initial-assistance.png` | Desktop 1280x800 | Page assistance voyage, visas, assurance et mobilité |
| `initial-dakar-2026.png` | Desktop 1280x800 | Page thématique Jeux Olympiques de la Jeunesse 2026 |
| `initial-en.png` | Desktop 1280x800 | Page d'accueil anglophone `/en` et header partagé |
| `initial-admin-mobile.png` | Mobile 390x844 | Écran d'administration / connexion back-office sur smartphone |

---

## 2. Synthèse des Problèmes Confirmés & Analyse d'Impact

L'inspection approfondie du frontend initial met en évidence 8 familles de problèmes majeurs :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MATRICE DES DÉFAILLANCES VISUELLES & UX                  │
├─────────────────┬──────────────┬────────────────────────┬───────────────────┤
│ Problème        │ Gravité      │ Impact Utilisateur     │ Impact Commercial │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 1. Header dense │ CRITIQUE     │ Liens illisibles (11px)│ Fuite de trafic,  │
│    & sans CTA   │              │ et CTA icône invisible │ faible conversion │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 2. Hero auto-   │ ÉLEVÉE       │ Surcharge cognitive et │ Rebond mobile,    │
│    carrousel    │              │ 3 boutons concurrents  │ hésitation prospect│
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 3. Empilement   │ ÉLEVÉE       │ Fatigue de défilement, │ Dispersion du     │
│    (14 sections)│              │ redondance des blocs   │ message principal │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 4. Discordance  │ MOYENNE      │ Confusion ("Nos 6      │ Baisse de         │
│    grille 5 vs 6│              │ services" avec 5 cartes créditibilité       │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 5. Tarifs AIBD  │ ÉLEVÉE       │ Incertitude budgétaire,│ Abandon au profit │
│    masqués      │              │ obligation de devis    │ des VTC affichés  │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 6. Équipements  │ ÉLEVÉE       │ Doute sur électricité, │ Perte des clients │
│    non garantis │              │ eau et fibre optique   │ corporate/diaspora│
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 7. Parcours EN  │ MOYENNE      │ Rupture linguistique   │ Perte des délégat.│
│    hybride FR   │              │ (Header FR sur /en)    │ internationales   │
├─────────────────┼──────────────┼────────────────────────┼───────────────────┤
│ 8. Hack global  │ MOYENNE      │ Masque les débordements│ Risque de bugs    │
│    overflow-x   │ (Technique)  │ sans régler la cause   │ sur petits écrans │
└─────────────────┴──────────────┴────────────────────────┴───────────────────┘
```

---

## 3. Analyse Détaillée par Composant & Page

### 3.1. Header & Navigation (`src/components/layout/header.tsx`)
- **Observation `[OBSERVÉ]` :**
  - Le header desktop aligne 10 liens textuels directs côte-à-côte avec une taille de police minuscule (`text-[11px] 2xl:text-sm`).
  - Sur les écrans de largeur intermédiaire (768px à 1279px, format iPad/tablettes et petits ordinateurs portables 13 pouces), la barre de navigation disparaît brusquement pour afficher un hamburger.
  - Le CTA principal n'a aucun texte explicite : il s'agit d'un bouton icône de 44x44px avec une icône de stylo (`FilePenLine`), ce qui n'incite pas à l'action.
- **Correctif Validé :**
  - Regrouper la navigation en 5 rubriques stratégiques :
    1. *Accueil*
    2. *Nos Services* (Menu déroulant accessible groupant Transport, Hébergements, Excursions, Croisières, Affaires, Visas)
    3. *Dakar 2026* (Badge dynamique)
    4. *À Propos*
    5. *Contact*
  - Remplacer l'icône muette par un véritable bouton CTA doré : **"Demander un devis"** avec texte visible dès `sm:inline-flex`.

### 3.2. Hero Section (`src/components/sections/hero.tsx`)
- **Observation `[OBSERVÉ]` :**
  - Le carrousel automatique fait défiler 4 diapositives toutes les 5 secondes. Bien qu'il respecte `prefers-reduced-motion`, il engendre une instabilité visuelle et empêche l'internaute de lire sereinement le texte.
  - Le titre H1 *"Votre Passeport pour le Monde"* est un slogan touristique générique qui n'affirme pas l'expertise locale à Dakar.
  - Trois boutons d'action se font concurrence dans le Hero : "Demander un devis" (doré), "Explorer les offres" (blanc translucide), "WhatsApp" (blanc translucide).
- **Correctif Validé :**
  - Transition vers une composition éditoriale premium et stable : image d'accroche magistrale, promesse de marque forte alignée avec l'Hypothèse C ("Votre conciergerie de voyage au Sénégal et dans le monde").
  - Hiérarchisation claire en 2 boutons d'action : CTA Principal "Demander un devis" + CTA Secondaire "WhatsApp Concierge".

### 3.3. Architecture de la Page d'Accueil (`src/app/page.tsx`)
- **Observation `[OBSERVÉ]` :**
  - La page enchaîne 14 sections successives. Il en résulte un effet de redondance (deux sections de services successives : `service-quick-select` puis `home-services-grid`, puis `home-featured`, puis `home-destinations`, etc.).
  - Dans `home-services-grid.tsx`, le titre annonce *"Nos 6 Services pour Voyager Serein"* alors que seules 5 cartes sont rendues (`services` ne contient que 5 objets, l'Assistance Voyage et Dakar 2026 étant omis).
- **Correctif Validé :**
  - Restructuration éditoriale en 9 sections équilibrées conformément au brief stratégique :
    1. Hero Éditorial
    2. Sélecteur 3 Parcours ("Je viens au Sénégal", "Je voyage à l'international", "Je prépare un voyage professionnel")
    3. Nos Prestations Essentielles (Grille maîtrisée des 10 services réels)
    4. Sélection d'Expériences au Sénégal (Gorée, Lac Rose, Saloum, Saly)
    5. Dakar 2026 : Votre DMC & Logistique au Sol
    6. Hébergements & Mobilité d'Affaires VIP (Générateur, Fibre, Berlines)
    7. Réassurance & Présence Locale (Bureau au Plateau, Chauffeurs vérifiés)
    8. Questions Fréquentes (FAQ structurée Schema.org)
    9. CTA Final Haute Conversion

### 3.4. Pages de Services Spécifiques
- **Transport (`/transport`) :** Absence d'affichage des forfaits fixes aéroport AIBD (Dakar 30 000 FCFA, Saly 35 000 FCFA).
- **Hébergement (`/hebergement`) :** Manque d'identification visuelle des critères de sécurité critiques (badges `Groupe électrogène 24/7` et `Fibre optique vérifiée`).
- **Assistance Voyage (`/assistance-voyage`) :** Pas de distinction claire entre frais d'assistance de l'agence et frais consulaires officiels.
- **Dakar 2026 (`/dakar-2026`) :** Présentation trop conceptuelle, sans la répartition des 3 pôles (Dakar, Diamniadio, Saly).

### 3.5. Mobile & CSS Global (`src/app/globals.css`)
- **Observation `[OBSERVÉ]` :**
  - Présence de `overflow-x: hidden` forcé sur `html, body`, masquant des débordements potentiels d'éléments absolus ou de marges négatives.
- **Correctif Validé :**
  - Nettoyer les conteneurs responsables des débordements et supprimer la dépendance aveugle à ce hack global.

---

## 4. Plan de Remédiation par Lots

Les correctifs identifiés seront exécutés dans les lots suivants :
- **Lot 2 :** Design System, Tokens, Palette Officielle et Typographie.
- **Lot 3 :** Refonte du Header, Menu Déroulant Desktop et Menu Hamburger Mobile.
- **Lot 4 :** Refonte Stratégique de la Page d'Accueil.
- **Lot 5 :** Refonte des Pages de Services Phares (`/transport`, `/hebergement`, `/assistance-voyage`, `/dakar-2026`).
- **Lot 6 :** Formulaires de Devis, Modale Universelle et Floating Concierge Bar Mobile.
- **Lot 7 :** Parité Linguistique de la Version Anglaise `/en`.
- **Lot 8 :** Optimisation des Performances, Accessibilité WCAG AA et Validations Visuelles.
