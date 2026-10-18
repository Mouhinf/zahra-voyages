# Rapport 05.04 — Optimisation Avancée des Images Cloudinary & LCP
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Inventaire & Pipeline de Livraison des Images

L'ensemble des visuels photographiques de SLAAC Voyages est désormais hébergé sur le CDN Cloudinary officiel (`cloud_name: dvnq5qwbd`) et distribué au navigateur via le composant `next/image` de Next.js :

| Rôle Visuel | URL de Référence Cloudinary | Paramètres CDN Actifs | Attributs `next/image` | Format & Poids Réseau |
| :--- | :--- | :---: | :---: | :---: |
| **Hero Accueil (LCP)** | `v1784493934/hero-slide-1.png` | `f_auto,q_auto` | `fill`, `priority`, `sizes="100vw"` | AVIF ~180 KiB |
| **Hero Transport** | `hero-section-transport.png` | `f_auto,q_auto` | `fill`, `priority`, `sizes="100vw"` | AVIF ~15 KiB |
| **Hero Hébergement** | `hero-section-hebergement.png` | `f_auto,q_auto` | `fill`, `priority`, `sizes="100vw"` | AVIF ~60 KiB |
| **Hero Excursions** | `hero-section-excursions.png` | `f_auto,q_auto` | `fill`, `priority`, `sizes="100vw"` | AVIF ~45 KiB |
| **Logo Officiel SLAAC** | `v1784498932/slaac-logo-png.png` | `f_auto,q_auto` | `width={180}`, `height={60}` | WebP/AVIF ~4.4 KiB |
| **Fiches Hébergements** | `slaac-voyages/hebergements/*` | `f_auto,q_auto:best,c_limit,w_1600` | `fill`, `priority` (1ère), `sizes="100vw"` | AVIF ~31.8 KiB |
| **Grilles Services (6 cards)** | `hero-section-*.png` | `f_auto,q_auto` | `fill`, `sizes="(max-width: 640px) 100vw, 33vw"` | AVIF ~20-30 KiB / carte |

---

## 2. Analyse de la Double Optimisation (Cloudinary vs Vercel / Next.js)

### Problématique Identifiée
Lorsqu'une image distante est requêtée via `<Image src="https://res.cloudinary.com/..." />` sans configuration dédiée :
1. Next.js télécharge l'image depuis Cloudinary vers son instance Vercel.
2. Vercel exécute le module Sharp pour redimensionner et convertir l'image au format AVIF/WebP.
3. Vercel met en cache l'image optimisée sur son CDN Edge (`x-nextjs-cache: HIT`).

### Analyse des Coûts & Quotas Cloud
- **Quotas Vercel Image Optimization (Hobby : 1 000 sources/mois, Pro : 5 000 sources/mois) :**
  En limitant les transformations Cloudinary en amont aux strictes résolutions requises (`w_1600,c_limit`), Next.js n'a jamais à manipuler de fichiers source géants de 10-20 Mo.
- **Quotas Cloudinary Transformations (25 crédits / mois en plan gratuit) :**
  Toutes les URLs partagent un jeu de transformations normalisé (`f_auto,q_auto`). L'absence de variations aléatoires d'effets visuels garantit que Cloudinary ne régénère pas de variantes inutiles à chaque requête, stabilisant la consommation sous le plafond des crédits gratuits.

---

## 3. Optimisation Spécifique du Hero LCP

Sur la page d'accueil (`src/components/sections/hero.tsx`) :
1. **Priorité de chargement :** L'image de fond porte l'attribut `priority`, générant une balise `<link rel="preload" as="image">` dans le `<head>` du document HTML.
2. **Attribut `sizes="100vw"` :** Indique au navigateur mobile de ne pas télécharger la variante desktop ultra-haute résolution (1920px), mais la déclinaison adaptée aux écrans de smartphones (640px ou 750px).
3. **Encapsulation stricte :** L'élément conteneur utilise `overflow-hidden` pour que l'agrandissement léger (`scale-105`) ne dépasse jamais de l'écran, prévenant tout décalage géométrique horizontal ou vertical.
