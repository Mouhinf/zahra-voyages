# Design System & Spécifications Visuelles — SLAAC Voyages
> **Périmètre :** Tokens de design, règles typographiques, palette officielle et bibliothèque de composants  
> **Conformité :** Accessibilité WCAG 2.2 niveau AA | Mobile-first | Standard Tailwind CSS & shadcn/ui  
> **Date de Publication :** 17 Octobre 2026  
> **Auteur :** Lead Product Designer & Frontend Architect  

---

## 1. Identité de Marque & Direction Artistique

Le Design System de SLAAC Voyages a été conçu pour donner à l'agence une stature internationale haut de gamme, en conjuguant l'élégance hospitalière de la **Teranga sénégalaise** et la rigueur d'une **conciergerie digitale contemporaine**.

### 1.1. Intégrité Absolue du Logo Officiel
- Le logo officiel de SLAAC Voyages (`/logo-slaac.png`), composé du globe stylisé et des lignes dorées/marines, est strictement préservé dans ses proportions exactes.
- Aucun recadrage, distorsion, modification de couleur ou remplacement par un template n'est toléré.
- Il est accompagné du libellé textuel typographié `SLAAC Voyages` avec graisse `font-bold` en bleu marine profond (`text-primary` / `#0A1128`).

### 1.2. Signature Officielle
- **Français :** *"Votre conciergerie de voyage au Sénégal et dans le monde."*
- **Anglais (EN) :** *"Your trusted travel concierge & DMC in Senegal."*

---

## 2. Palette Chromatique & Tokens de Couleurs

La palette officielle s'articule autour de 4 teintes maîtresses, testées pour garantir un contraste supérieur au ratio 4.5:1 exigé par le standard WCAG 2.2 AA.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PALETTE CHROMATIQUE OFFICIELLE                     │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│ BLEU MARINE     │ OR TERANGA      │ VERT RELATIONNEL│ BLANC & ARDOISE       │
│ #0A1128 (Navy)  │ #D97706 / #F59E0B│ #25D366 (WA)    │ #FFFFFF / #334155     │
│ Base Confiance  │ Accent Luxe/CTA │ Contact Rapide  │ Clarté & Lisibilité   │
└─────────────────┴─────────────────┴─────────────────┴───────────────────────┘
```

### 2.1. Nuancier Tailwind Déployé (`tailwind.config.ts`)
- **Bleu Marine Institutionnel (`slaac-navy`) :**
  - `slaac-navy-950` : `#060B14` (Fonds sombres extrêmes, contrastes élevés)
  - `slaac-navy-900` : `#0A1128` (Couleur primaire officielle, Hero text, en-têtes)
  - `slaac-navy-800` : `#102A43` (Variante de survol et cartes sombres)
  - `slaac-navy-700` : `#1E3A5F` (Bordures actives et séparateurs)
  - `slaac-navy-50`  : `#F8FAFC` (Surfaces de réassurance et fonds de sections)
- **Doré Teranga (`slaac-gold`) :**
  - `slaac-gold-700` : `#92400E` (Texte doré sur fond clair pour contraste AAA)
  - `slaac-gold-600` : `#B45309` (Survol des boutons principaux)
  - `slaac-gold-500` : `#D97706` (Couleur d'accent majeure, boutons de devis)
  - `slaac-gold-400` : `#F59E0B` (Étoiles d'avis, badges promotionnels)
  - `slaac-gold-100` : `#FEF3C7` (Arrière-plan des badges légers)
  - `slaac-gold-50`  : `#FFFBEB` (Bandeaux informatifs chaleureux)
- **Vert Relationnel (`slaac-green`) :**
  - `slaac-green-whatsapp` : `#25D366` (Bouton d'échange direct WhatsApp)
  - `slaac-green-600` : `#059669` (Survol du bouton WhatsApp)
  - `slaac-green-50`  : `#ECFDF5` (Badges de vérification "Chauffeur vérifié")

---

## 3. Typographie & Hiérarchie Éditoriale

Le système typographique combine deux polices complémentaires chargées de manière optimisée via `next/font/google` :

1. **`Inter` (Sans-Serif - `--font-inter`) :**
   - Rôle : Navigation, corps de texte, boutons d'action, champs de formulaires, chiffres et prix en FCFA.
   - Justification : Lisibilité irréprochable sur les petits écrans de smartphones Android/iOS, même en conditions de fort ensoleillement extérieur.
2. **`Playfair Display` (Serif Élégant - `--font-playfair`) :**
   - Rôle : Grands titres de sections (`.font-headline`), accroches du Hero et valorisation des expériences culturelles (Gorée, Saloum, Dakar 2026).
   - Justification : Confère le statut éditorial d'une maison de conciergerie sans nuire à la lisibilité générale.

### Échelle Typographique Mobile-First :
- **Hero Title :** `text-3xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight`
- **Titre de Section (H2) :** `text-2xl sm:text-3xl md:text-4xl font-bold font-headline text-slate-900`
- **Titre de Carte (H3) :** `text-lg sm:text-xl font-semibold text-slate-900`
- **Surtitre Éditorial :** `text-xs sm:text-sm font-semibold uppercase tracking-widest text-slaac-gold-600`
- **Corps de texte :** `text-sm sm:text-base text-slate-600 leading-relaxed`
- **Mentions légales & Badges :** `text-xs font-medium`

---

## 4. Bibliothèque de Composants Clés

### 4.1. Boutons (`Button` - `src/components/ui/button.tsx`)
- `variant="gold"` : Bouton doré avec texte blanc à fort contraste, ombre portée douce et effet d'accentuation au survol (`bg-slaac-gold-500 hover:bg-slaac-gold-600`).
- `variant="whatsapp"` : Bouton vert relationnel (`bg-[#25D366] hover:bg-[#20ba5a]`).
- `variant="navy"` : Bouton d'autorité institutionnelle (`bg-slaac-navy-900 hover:bg-slaac-navy-800`).
- `variant="outline"` : Bouton secondaire épuré avec bordure discrète.
- Tailles : `sm` (36px), `default` (40px), `lg` (44px), `xl` (48px - touch target mobile recommandée).

### 4.2. Badges (`Badge` - `src/components/ui/badge.tsx`)
- `variant="gold"` : Arrière-plan or clair avec texte ocre sombre (`bg-slaac-gold-100 text-slaac-gold-700`).
- `variant="verified"` : Badge de réassurance verte avec icône coche (`border-emerald-200 bg-emerald-50 text-emerald-700`).
- `variant="navy"` : Badge technique sombre (`bg-slaac-navy-900 text-white`).

### 4.3. Titres de Sections Unifiés (`SectionHeading` - `src/components/ui/section-heading.tsx`)
Composant réutilisable standardisant les surtitres dorés, les titres H2, les séparateurs d'accent et les textes d'introduction sur toutes les pages de l'application.

### 4.4. Cartes de Services & Prestations (`.card-premium`)
- Fond blanc pur avec bordure subtile en ardoise claire (`border-slate-200/85`).
- Rayon de courbure de `14px` (`rounded-xl`).
- Micro-interaction d'élévation fluide (`.hover-lift`) : translation de `-2px` avec accentuation de l'ombre portée et surlignage discret de la bordure en or Teranga.

---

## 5. Règles Déontologiques & Interdictions Graphiques

Pour préserver la crédibilité de SLAAC Voyages, les règles strictes suivantes sont appliquées dans l'ensemble de l'interface :
1. **Zéro Gradient Criard Injustifié :** Bannissement des dégradés arc-en-ciel ou fluorescents.
2. **Zéro Glassmorphism Envahissant :** Les effets de transparence floutée (`backdrop-blur`) sont réservés au header fixe et aux badges flottants.
3. **Zéro Faux Témoignages ou Chiffres Inventés :** Seuls les témoignages et avis authentiques avec prénoms réels et villes vérifiées sont acceptés.
4. **Zéro Débordement Horizontal Masqué :** Le hack aveugle `overflow-x: hidden` a été éliminé au profit de conteneurs rigoureusement dimensionnés (`w-full max-w-full`).
5. **Respect Strict de `prefers-reduced-motion` :** Toutes les transitions et animations sont automatiquement désactivées lorsque l'utilisateur le spécifie dans son système d'exploitation.
