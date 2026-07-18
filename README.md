# SLAAC Voyages

Site web de l'agence de voyage **SLAAC Voyages**, basée à Dakar (Sénégal). L'application permet de présenter les services de l'agence, ses destinations, et offre un système d'administration pour gérer le contenu.

---

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| **Next.js 15** (App Router) | Framework React avec rendu serveur, routage et optimisations |
| **TypeScript** | Typage statique pour un code robuste |
| **Tailwind CSS 3** | Framework CSS utilitaire pour le design |
| **shadcn/ui** (35 composants) | Bibliothèque de composants UI accessibles basée sur Radix UI |
| **Radix UI** (18 primitives) | Primitives d'interface accessibles (dialog, dropdown, tabs, toast, etc.) |
| **react-hook-form** + **Zod** | Gestion des formulaires et validation côté client |
| **Firebase** (Auth, Firestore, Storage) | Authentification admin, base de données, stockage |
| **Cloudinary** | Hébergement et optimisation d'images (upload depuis l'admin) |
| **Lucide React** | Librairie d'icônes |
| **date-fns** + **react-day-picker** | Gestion des dates et calendrier |
| **Embla Carousel** | Carousel horizontal |
| **Recharts** | Graphiques et diagrammes |

---

## Structure du projet

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx            # Accueil
│   ├── layout.tsx          # Layout racine (métadonnées, polices)
│   ├── globals.css         # Styles globaux (variables CSS, Tailwind)
│   ├── about/              # Page "À propos"
│   ├── contact/            # Page "Contact"
│   ├── destinations/       # Page "Destinations"
│   ├── services/           # Page "Services"
│   └── admin/              # Panneau d'administration
│       ├── page.tsx        # Dashboard (protégé par Firebase Auth)
│       └── login/          # Page de connexion admin
├── components/
│   ├── layout/             # Header, Footer, QuoteRequestDialog
│   ├── sections/           # Sections réutilisables (Hero, About, Services, etc.)
│   ├── admin/              # DestinationsManager (CRUD Firestore + Cloudinary)
│   └── ui/                 # 35 composants shadcn/ui (button, card, dialog, form, etc.)
├── hooks/                  # use-mobile, use-toast
├── lib/                    # firebase.ts (init Firebase), utils.ts (cn())
└── types/                  # Destination type
```

---

## Pages et sections

### Page d'accueil (`/`)

Composée de 6 sections :

| Section | Composant | Description |
|---|---|---|
| **Hero** | `hero.tsx` | Bannière pleine hauteur avec image de fond, slogan "Votre Passeport pour le Monde", CTA "Explorer les Destinations" et téléchargement de brochure |
| **À propos** | `home-about.tsx` | Présentation de l'agence avec photo d'avion et lien vers la page À propos |
| **Services** | `home-services.tsx` | 3 cartes : Billetterie Aérienne, Packages sur Mesure, Assistance Visas & Assurance |
| **Destinations** | `home-destinations.tsx` | Grille de 4 destinations (Paris, Dubaï, New York, Casamance) avec prix en FCFA |
| **Contact** | `contact.tsx` | Formulaire de contact avec validation Zod, lien WhatsApp, adresse et carte Google Maps |
| **Footer** | `footer.tsx` | Pied de page multi-colonnes : logo, navigation, newsletter, réseaux sociaux |

### Page À propos (`/about`)

| Section | Description |
|---|---|
| **Histoire** | Origine de l'agence, fondée à Dakar |
| **Mission** | Description des services (billets, visas, hôtels, préinscriptions) |
| **Pourquoi nous choisir** | 3 cartes : Expertise Personnalisée, Accès Global, Engagement |
| **Chiffres clés** | Années d'expérience, destinations, clients, partenaires |
| **Téléchargement** | Lien vers la brochure PDF |

### Page Destinations (`/destinations`)

Grille de destinations avec images, prix (FCFA) et tags. Chaque destination peut être sélectionnée via le `QuoteRequestDialog` pour demander un devis.

### Page Services (`/services`)

Deux catégories présentées avec des accordéons :
- **Tourisme** : billetterie aérienne, packages sur mesure, assurance voyage, assistance visas, réservation d'hôtels, circuits et excursions
- **Assistance import/export** : formalités douanières, logistique et transport
- **Location et vente de véhicules** (Toyota, Hyundai, Mercedes, BMW, etc.)

### Page Contact (`/contact`)

Formulaire complet avec validation Zod (nom, email, téléphone, message), intégration WhatsApp et carte Google Maps.

### Administration (`/admin`)

| Page | Description |
|---|---|
| **`/admin/login`** | Connexion par email/mot de passe via Firebase Auth |
| **`/admin`** | Dashboard avec `DestinationsManager` : CRUD complet sur les destinations (Firestore + upload Cloudinary avec barre de progression) |

---

## Composants d'interface

### Composants shadcn/ui (35)

```button, card, dialog, form, input, select, calendar, sheet, accordion, tabs, toast, alert, badge, carousel, chart, checkbox, dropdown-menu, label, popover, progress, radio-group, scroll-area, separator, skeleton, slider, switch, table, textarea, tooltip, avatar, collapsible, menubar, sidebar, alert-dialog```

### Composants métier (8)

| Composant | Type | Rôle |
|---|---|---|
| `Header` | Client | Navigation responsive avec menu mobile (Sheet) |
| `Footer` | Client | Pied de page avec newsletter et liens |
| `QuoteRequestDialog` | Client | Dialogue de demande de devis (formulaire multi-champs) |
| `Hero` | Serveur | Bannière d'accueil |
| `HomeAbout` / `About` | Serveur | Sections de présentation |
| `HomeServices` / `Services` | Serveur | Présentation des services |
| `HomeDestinations` / `Destinations` | Serveur | Grille de destinations |
| `DestinationsManager` | Client | CRUD admin avec upload Cloudinary |
| `Contact` | Client | Formulaire de contact |

---

## Développement

```bash
# Installation des dépendances
npm install

# Développement local
npm run dev

# Build production
npm run build

# Démarrage production
npm start

# Linter
npm run lint
```

### Variables d'environnement

Créer un fichier `.env.local` :

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

---

## Architecture

- **Routage** : App Router Next.js avec pages serveur et composants serveur par défaut
- **Formulaires** : `react-hook-form` + `@hookform/resolvers/zod` pour la validation
- **Base de données** : Firebase Firestore pour les destinations
- **Authentification** : Firebase Auth (email/mot de passe) pour l'admin
- **Images** : Cloudinary pour les uploads admin, images statiques dans `/public`
- **Design** : Variables CSS personnalisées (primary: bleu marine, accent: or), mode sombre via classe
