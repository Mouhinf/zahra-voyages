# Refonte Stratégique de la Page d'Accueil — SLAAC Voyages
> **Objectif :** Transformer la page d'accueil en un parcours de décision limpide, valorisant le positionnement de conciergerie locale et maximisant la conversion de prospects qualifiés.  
> **Composants Touchés :** `src/app/page.tsx`, `src/components/sections/hero.tsx`, `src/components/sections/service-quick-select.tsx`, `src/components/sections/home-services-grid.tsx`, `src/components/sections/home-contact-quick.tsx`, `src/components/layout/footer.tsx`  
> **Date :** 17 Octobre 2026  
> **Auteur :** Lead CRO & Senior Frontend Engineer  

---

## 1. Vue d'Ensemble de la Transformation Éditoriale

L'ancienne page d'accueil souffrait d'un empilement excessif de 14 blocs successifs, générant des redondances notables (plusieurs carrousels d'offres sans hiérarchie claire, discrépance entre le titre annonçant 6 services et une grille n'en affichant que 5).

La nouvelle page d'accueil s'articule autour d'une architecture en **9 étapes rigoureusement coordonnées** :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NOUVELLE STRUCTURE DE LA PAGE D'ACCUEIL                  │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ 1. Hero         │ Accroche éditoriale majeure "Votre Conciergerie de Voyage │
│    Éditorial    │ au Sénégal et dans le Monde" + Bandeau Réassurance        │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 2. Sélecteur    │ 3 Parcours : "Je viens au Sénégal", "Je voyage à          │
│    3 Parcours   │ l'international", "Voyage d'affaires & JOJ 2026"          │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 3. Pôles de     │ 6 Cartes Premium : Transport AIBD, Résidences, Excursions,│
│    Prestations  │ MICE Affaires, Assistance Visas, Voyages/Omra             │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 4. Offres &     │ Forfaits phares réels avec prix d'appel indicatifs        │
│    Sélections   │ (Transfert AIBD dès 30 000 FCFA)                          │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 5. Circuits     │ Découverte authentique du Sénégal (Gorée, Bandia, Saloum) │
│    Sénégal      │ avec mise en avant des guides officiels certifiés         │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 6. Tourisme     │ Conventions entreprises, accueil salon VIP AIBD et        │
│    Affaires & JO│ opérateur logistique indépendant pour les JOJ Dakar 2026  │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 7. Réassurance  │ Agence physique Dakar Plateau, licence et garanties       │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 8. FAQ Enrichie │ Questions réelles des voyageurs avec balisage Schema.org  │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ 9. CTA Final    │ Prise de contact directe et formulaire commercial         │
└─────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 2. Détails des Améliorations par Section

### 2.1. Hero Éditorial & Cinématographique (`hero.tsx`)
- **Élimination de la fatigue visuelle du carrousel automatique :** Remplacement de la rotation perpétuelle par une composition éditoriale fixe haut de gamme, avec chargement prioritaire LCP (`priority={true}`) sur l'image Cloudinary optimisée.
- **Titre H1 fort et différenciant :** *"Votre Conciergerie de Voyage au Sénégal et dans le Monde"*.
- **Hiérarchisation des CTAs :** 
  - CTA Principal : Bouton Or `variant="gold"` ("Demander un devis" ouvrant la modale contextualisée).
  - CTA Secondaire : Bouton Vert `variant="whatsapp"` ("WhatsApp Concierge" avec message pré-rempli).
- **Bandeau de réassurance sous le Hero :** Affichage de 4 engagements concrets : *Bureau physique au Plateau*, *Devis sous 24h ouvrées*, *Chauffeurs professionnels AIBD*, *Résidences Fibre & Générateur*.

### 2.2. Le Sélecteur de 3 Parcours (`service-quick-select.tsx`)
Pour orienter immédiatement les trois personas majeurs identifiés dans le Prompt 03 :
1. **Parcours Incoming :** *"Je viens au Sénégal"* (Touristes, diaspora) ➔ mise en avant des navettes AIBD, des résidences meublées et des excursions.
2. **Parcours Outgoing :** *"Je voyage à l'international"* (Commerçants, étudiants, pèlerins) ➔ mise en avant des visas d'affaires Chine/Dubaï, de l'assurance voyage et des forfaits Omra.
3. **Parcours Corporate :** *"Voyage d'affaires & Délégation"* (PME, multinationales, JOJ 2026) ➔ mise en avant de la flotte VIP, des conventions d'entreprises et de la logistique d'événements.

### 2.3. Grille des 6 Prestations Majeures (`home-services-grid.tsx`)
- Résolution de la discrépance historique : le titre annonce désormais exactement les 6 pôles réels présentés.
- Intégration de prix d'appel transparents rassurants (*Transfert AIBD dès 30 000 FCFA*, *Excursions dès 35 000 FCFA*).
- Badges de réassurance sur chaque carte : `Ponctualité Garantie`, `Fibre & Générateur 24/7`, `Guides Certifiés`, `Contrats B2B & Événements`, `Dossiers Express`.

---

## 3. Impact Commercial & CRO

1. **Suppression de la friction tarifaire :** L'affichage de repères de prix réalistes pour les transferts rassure les visiteurs sans nécessiter d'échange préalable fastidieux.
2. **Orientation en moins de 3 secondes :** Grâce aux 3 tuiles de parcours, le visiteur s'auto-qualifie immédiatement.
3. **Maintien de la chaîne technique :** Tous les boutons conservent la propagation correcte de `defaultService` et `source` vers le CRM Firestore et l'Outbox transactionnelle.
