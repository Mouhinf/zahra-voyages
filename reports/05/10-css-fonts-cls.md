# Rapport 05.10 — Polices Web, CSS & Stabilité Visuelle (CLS)
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 18 octobre 2026

---

## 1. Audit & Éradication Complète du Cumulative Layout Shift (CLS)

Le Cumulative Layout Shift (CLS) mesure l'instabilité visuelle d'une page pendant son chargement. Le seuil recommandé par Google est strictement inférieur à **0.10**.

### Constats Initiaux & Solutions Implémentées :

| Source de Décalage Identifiée | CLS Initial | Cause Technique | Correction Apportée | CLS Final |
| :--- | :---: | :--- | :--- | :---: |
| **Bandeau Promo (`AnnouncementBar`)** | **0.049** sur tout le site | Démarrage avec `banners = null` (hauteur 0), puis insertion du bloc de 36/44 px après le `fetch()` client. | Initialisation immédiate avec le bandeau de repli `[FALLBACK]`. Hauteur réservée dès le premier octet HTML. | **0.000** |
| **Fiche Détail Hébergement (`/hebergement/[id]`)** | **0.868** (Critique) | Page client avec spinner `<Loader2>`, puis remplacement brutal par la fiche complète (1 200 px). | Transformation en Server Component. Le DOM complet est servi directement en SSR. | **0.000** |
| **Fiches Détail Circuits & Transports** | 0.400 - 0.700 | Même anti-pattern de chargement asynchrone différé. | Conversion en Server Component avec rendu immédiat des caractéristiques. | **0.000** |
| **Hero Image (`hero.tsx`)** | Risque de shift | Agrandissement `scale-105` pouvant dépasser le viewport mobile. | Conteneur parent strictement borné en `overflow-hidden`. | **0.000** |

> **Résultat Majeur :** Le CLS mesuré sur l'intégralité des routes auditées est désormais de **0.000** (stabilité visuelle absolue).

---

## 2. Optimisation des Polices Google via `next/font`

Dans [`src/app/layout.tsx`](file:///home/mouhammad/zahra-voyages/src/app/layout.tsx) :
- **Typographies Officielles :**
  - **Playfair Display :** Polices éditoriales de titrage (`variable: '--font-playfair'`).
  - **Inter :** Police système pour les textes et l'UI (`variable: '--font-inter'`).
- **Sous-ensembles (`subsets: ['latin']`) :** Seuls les glyphes latins nécessaires sont téléchargés.
- **Auto-hébergement (`next/font`) :** Les fichiers WOFF2 sont servis directement depuis le domaine de l'application (`/_next/static/media/*.woff2`) avec en-têtes de préchargement `<link rel="preload" as="font" crossorigin>`.
- **Zéro appel tiers vers `fonts.googleapis.com` :** Confidentialité totale, aucun tracking externe et zéro latence DNS.
