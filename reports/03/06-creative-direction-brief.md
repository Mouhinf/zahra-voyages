# Brief de Direction Créative & Design System UX/UI — SLAAC Voyages
> **Rôle du document :** Spécifications graphiques, ergonomiques et artistiques servant de référence pour la refonte UX/UI du Prompt 04.  
> **Alignement :** Préservation stricte de la marque SLAAC Voyages tout en rehaussant son statut visuel vers un standard international premium.  
> **Date :** 17 Octobre 2026  
> **Auteur :** Directeur Artistique & Lead UX/UI Designer  

---

## 1. Vision Créative & Moodboard Stratégique

La nouvelle identité visuelle de SLAAC Voyages doit incarner la rencontre harmonieuse entre :
1. **La Teranga Sénégalaise :** Chaleur humaine, élégance, hospitalité sincère et fierté culturelle.
2. **L'Efficacité Digitale Internationale :** Sobriété suisse, fluidité des plateformes scandinaves, précision des conciergeries haut de gamme (Aman, Four Seasons, Blacklane).
3. **La Réalité Dakaroise Contemporaine :** Une métropole vibrante, atlantique, tournée vers l'avenir (Diamniadio, Dakar 2026, hub régional d'affaires).

---

## 2. Charte Chromatique & Règles d'Accessibilité (WCAG AA)

La palette colorimétrique s'articule autour d'une dominante d'autorité institutionnelle réchauffée par des touches dorées inspirées du soleil couchant sur l'océan Atlantique et de la terre ocre du Sénégal.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PALETTE OFFICIELLE SLAAC                           │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│ BLEU NUIT PROFOND│ OR TERANGA      │ BLANC ÉCLATANT  │ ARDOISE TECHNIQUE     │
│ #0F172A (Navy)  │ #D97706 / #F59E0B│ #FFFFFF (Surface│ #334155 (Texte)       │
│ Base Confiance  │ Accent Luxe/Warm│ Clarté & Espace │ Lisibilité Parfaite   │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

### 2.1. Nuancier Technique (Tailwind CSS)
- **Bleu Primaire (Primary Navy) :**
  - `slaac-navy-900` : `#0A1128` (Arrière-plans sombres, Hero text, En-têtes de tableau)
  - `slaac-navy-700` : `#1E293B` (Boutons secondaires, bordures d'accent)
  - `slaac-navy-50`  : `#F8FAFC` (Fonds de cartes de réassurance, surfaces neutres)
- **Doré Teranga (Accent Gold) :**
  - `slaac-gold-500` : `#D97706` (Boutons d'action principaux, badges de statut VIP)
  - `slaac-gold-400` : `#F59E0B` (Survol des boutons, étoiles d'avis)
  - `slaac-gold-100` : `#FEF3C7` (Arrière-plan des badges promotionnels)
- **Vert Relationnel (WhatsApp / Succès) :**
  - `slaac-green-500`: `#10B981` / `#25D366` (Bouton flottant WhatsApp, notifications de confirmation de devis)
- **Gris Typographiques (Neutrals) :**
  - `slaac-text-main`: `#0F172A` (Titres H1/H2, fort contraste 14.5:1 sur blanc)
  - `slaac-text-muted`: `#475569` (Paragraphes descriptifs, contraste 5.8:1 sur blanc)
  - `slaac-border`   : `#E2E8F0` (Séparateurs fins et contours de formulaires)

---

## 3. Typographie & Hiérarchie Visuelle

Le système typographique combine modernité géométrique et haute lisibilité sur écrans mobiles de toutes résolutions.

### 3.1. Polices Recommandées
- **Titres & Identité (Display & Headings) :** `Plus Jakarta Sans` ou `Outfit`
  - *Caractère :* Géométrique, moderne, chaleureux, hautement distinctif.
  - *Graisses :* `SemiBold (600)` et `Bold (700)`.
- **Corps de texte & Données Chiffrées (Body & Data) :** `Inter`
  - *Caractère :* Standard mondial de lisibilité UI, rendu parfait des chiffres et symboles monétaires (FCFA, €, $).
  - *Graisses :* `Regular (400)` et `Medium (500)`.

### 3.2. Échelle Typographique Mobile-First
- **H1 (Hero Title) :** `text-3xl md:text-5xl font-bold tracking-tight text-slate-900`
- **H2 (Section Header) :** `text-2xl md:text-3xl font-bold text-slate-900`
- **H3 (Card Title) :** `text-lg md:text-xl font-semibold text-slate-900`
- **Body Large (Intro) :** `text-base md:text-lg text-slate-600 leading-relaxed`
- **Body Regular :** `text-sm md:text-base text-slate-600 leading-normal`
- **Caption / Badge :** `text-xs font-medium tracking-wide uppercase`

---

## 4. Direction Artistique Photographique & Iconographie

### 4.1. Règle d'Or : Bannir les Banques d'Images Génériques Déconnectées [IMPORTANT]
- **Interdit :** Photos de poignées de main en costumes dans des gratte-ciels new-yorkais, photos de taxis jaunes américains, mannequins occidentaux feignant de visiter une fausse réserve.
- **Obligatoire :**
  1. **Photographies Réelles de Dakar et du Sénégal :**
     - Vues aériennes lumineuses de la presqu'île du Cap-Vert, du Monument de la Renaissance, de la Corniche Ouest, de Gorée, du Lac Rose au coucher du soleil.
     - Prises de vue réelles des véhicules de la flotte SLAAC (propres, récents, climatisés, immatriculés au Sénégal).
  2. **Portraits Humains Authentiques :**
     - Chauffeurs professionnels sénégalais en tenue élégante (costume ou chemise soignée avec insigne discret).
     - Accueil chaleureux à la sortie de l'AIBD avec panneau nominatif élégant.
     - Membres de l'équipe au bureau du Plateau recevant un client autour d'un café Touba ou d'un rafraîchissement.

### 4.2. Traitement des Médias & Performance (Cloudinary)
- Formats exclusifs de nouvelle génération : `WebP` et `AVIF` avec compression automatique (`q_auto,f_auto`).
- Ratios d'aspect standardisés :
  - *Cartes Services & Excursions :* `16:9` ou `4:3` avec bords adoucis (`rounded-2xl`).
  - *Portraits Équipe / Chauffeurs :* `1:1` carré ou `3:4` vertical.
  - *Bannières Hero :* `21:9` en desktop, `4:5` vertical en mobile pour préserver l'espace texte.

---

## 5. Composants UI Clés & Micro-Interactions (Prompt 04)

### 5.1. Le "Floating Concierge Bar" Mobile
- Un bandeau flottant discret fixé en bas d'écran sur mobile (`fixed bottom-4 inset-x-4 z-50`) offrant deux actions instantanées :
  1. Bouton Vert WhatsApp : *"Contacter un concierge"* (icône WhatsApp + pastille verte clignotante `En ligne`).
  2. Bouton Or : *"Devis express"* (ouverture de la modale en 1 tap).

### 5.2. Cartes de Services Haute Conversion (Service Cards)
- Élévation subtile (`shadow-sm` vers `hover:shadow-xl transition-all duration-300`).
- Badges d'information immédiate :
  - `Transfert Garanti AIBD`
  - `Annulation Gratuite 24h`
  - `Paiement Sécurisé / Espèces à l'arrivée`
- Prix d'appel clairement mis en avant : `À partir de 30 000 FCFA`.

### 5.3. Modale Universelle de Devis (Améliorations Visuelles)
- Fil d'Ariane d'étape discret : `Étape 1 : Votre projet` ➔ `Étape 2 : Vos coordonnées` ➔ `Étape 3 : Confirmation & Réf`.
- Affichage du numéro de référence de devis sous forme de badge découpé élégant façon carte d'embarquement (Boarding Pass).
- Remplacement des cases à cocher standard par des tuiles tactiles de sélection (Touch Targets de 48px minimum).

---

## 6. Ton Éditorial (Copywriting & Voix de Marque)

| Situation | Ton Recommandé | Exemple de Formulation | Formulations à Proscrire |
| :--- | :--- | :--- | :--- |
| **Accroche Principale** | Affirmé, accueillant, prestigieux | *"Votre conciergerie de voyage de confiance à Dakar. Transferts AIBD, séjours sur mesure et mobilité d'affaires sans compromis."* | *"Meilleure agence pas cher du Sénégal promo vol"* (trop low-cost) |
| **Engagement de Délai** | Transparent, professionnel, réaliste | *"Notre équipe commerciale basée au Plateau étudie votre demande et vous transmet une cotation personnalisée sous 24h ouvrées."* | *"Réponse immédiate en 5 secondes garantie"* (mensonger et non tenu) |
| **WhatsApp Handover** | Convivial, personnalisé, direct | *"Besoin d'une réponse urgente ? Échangez directement avec Mamadou, notre responsable conciergerie, sur WhatsApp."* | *"Contactez notre support"* (trop froid/robotique) |
| **Mentions Dakar 2026** | Fierté panafricaine, rigueur internationale | *"Dakar 2026 : Vivez les premiers Jeux Olympiques d'Afrique avec l'opérateur logistique de référence au Sénégal."* | *"Achetez vos billets JOJ ici"* (illégal/non accrédité billetterie CIO) |
