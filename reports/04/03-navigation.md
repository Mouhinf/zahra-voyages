# Refonte de la Navigation & du Header — SLAAC Voyages
> **Objectif :** Transformer le header en un système de navigation aéré, intuitif et à forte conversion sur ordinateur comme sur smartphone.  
> **Composants Touchés :** `src/components/layout/header.tsx`, `src/components/layout/announcement-bar.tsx`  
> **Date :** 17 Octobre 2026  
> **Auteur :** Lead UX Designer & Frontend Engineer  

---

## 1. Diagnostic de l'Ancienne Navigation vs Nouvelle Solution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 COMPARAISON DE L'ARCHITECTURE DE NAVIGATION                 │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ AVANT (État Initial)         │ APRÈS (Refonte Prompt 04)                    │
├──────────────────────────────┼──────────────────────────────────────────────┤
│ · 10 liens alignés côte à    │ · 5 entrées claires et aérées :              │
│   côte sur desktop           │   1. Accueil                                 │
│ · Taille minuscule (11px)    │   2. Nos Prestations [Menu Déroulant Radix]  │
│   illisibles                 │   3. JO Dakar 2026 [Badge JOJ]               │
│ · Menu basculant en burger dès│   4. À propos                                │
│   1279px (manque d'espace)   │   5. Contact                                 │
│ · CTA sans libellé explicite │ · Menu mobile riche avec tiroir Sheet Radix, │
│   (icône seule)              │   sous-sections catégorisées et CTAs directs │
│ · Rupture sur les tablettes  │ · Cibles tactiles >= 48px et focus visible   │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Détails de l'Implémentation Desktop

### 2.1. Regroupement par Menu Déroulant Accessible (`DropdownMenu`)
Plutôt que d'encombrer l'en-tête avec 10 liens individuels, le menu déroulant **Nos Prestations** regroupe les 7 services clés dans une carte popover élégante et aérée (`w-72 p-2 bg-white shadow-xl rounded-xl`) :
1. *Transport & Navette AIBD* (Icône voiture, lien `/transport`)
2. *Hébergements & Résidences* (Icône hôtel, lien `/hebergement`)
3. *Excursions & Découverte* (Icône épingle carte, lien `/excursions`)
4. *Tourisme d'Affaires & MICE* (Icône mallette, lien `/tourisme-affaires`)
5. *Assistance & Visas* (Icône dossier validé, lien `/assistance-voyage`)
6. *Voyages & Croisières* (Icône navire, lien `/voyages-croisieres`)
7. *Toutes les Destinations* (Lien catalogue `/destinations`)

Chaque élément présente un titre en gras et une ligne de description synthétique permettant au voyageur d'identifier son besoin en un coup d'œil.

### 2.2. Mise en Avant Stratégique de Dakar 2026
Le lien vers les Jeux Olympiques de la Jeunesse (`/dakar-2026`) est conservé au premier niveau avec un badge doré distinctif `JOJ`, signalant immédiatement aux délégations sportives et aux visiteurs internationaux l'expertise de SLAAC Voyages sur cet événement historique.

---

## 3. Détails de l'Expérience Mobile (Menu Hamburger)

Le menu hamburger mobile a été entièrement restructuré dans un composant `Sheet` Radix :

1. **Ouverture & Fermeture Immédiates :**
   - Bouton de déclenchement 44x44px accessible (`aria-label="Ouvrir le menu"`).
   - Fermeture automatique à chaque clic sur un lien grâce à `SheetClose asChild`.
2. **Hiérarchie Visuelle Structurée :**
   - En-tête avec logo officiel et sous-titre "Conciergerie Dakar".
   - Section dédiée "Prestations & Services" avec icônes dorées dédiées.
   - Entrées institutionnelles (JO Dakar 2026, À propos, Contact & Agence Plateau).
3. **Pôle de Conversion Directe :**
   - Bouton doré pleine largeur : `"Demander un devis"` (ouverture de la modale).
   - Bouton vert WhatsApp officiel : `"Discuter sur WhatsApp"` avec ouverture directe de la conversation.
   - Lien direct d'appel d'urgence : `"Appel direct : +221 77 312 90 90"`.

---

## 4. Conformité & Tests de Non-Régression

- **Respect du protocole de test `tests/header-banners.test.mjs` :**
  - Bouton WhatsApp présent avec `aria-label="Contacter SLAAC Voyages sur WhatsApp"` et lien `wa.me/221773129090`.
  - Bouton Devis présent avec `aria-label="Demander un devis"` et déclenchement de la modale de cotation.
  - Lien `JO Dakar 2026` avec `href="/dakar-2026"` conservé au sein de `nav`.
- **Zéro Débordement Horizontal :** Largeur maximale contrôlée sur toutes les résolutions (320px à 1920px).
