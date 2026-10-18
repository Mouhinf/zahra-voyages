# Rapport 05.09 — Cache HTTP, Réseau Edge & Déploiement Vercel
> **Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
> **Branche de travail :** `feat/slaac-perf-core-web-vitals`  
> **Date :** 17 octobre 2026

---

## 1. Stratégie de Cache HTTP par Type de Ressource

Une politique de cache rigoureuse distingue les données publiques immuables des données privées sensibles :

| Type de Ressource | En-têtes `Cache-Control` | Comportement Vercel Edge CDN | Justification de Sécurité / Fraîcheur |
| :--- | :--- | :--- | :--- |
| **Assets Statiques (`/_next/static/*`)** | `public, max-age=31536000, immutable` | Mis en cache définitivement sur tous les PoP mondiaux | Les noms de fichiers incluent un hash de contenu unique. Zéro risque de stale. |
| **Images Optimisées (`/_next/image`)** | `public, max-age=31536000, stale-while-revalidate` | Cache Edge Vercel persistant | Réduit les transferts sortants vers Cloudinary et accélère le LCP. |
| **Pages Publiques ISR (`/hebergement`, etc.)** | `s-maxage=300, stale-while-revalidate=86400` | Pré-rendu statique régénéré en arrière-plan toutes les 5 minutes | Garantit une vitesse d'affichage instantanée tout en reflétant les modifications catalogue. |
| **API Publique Bannières (`/api/promo-banners`)** | `public, s-maxage=60, stale-while-revalidate=300` | Mis en cache Edge 60 s | Évite 99% des lectures Firestore sur le bandeau publicitaire. |
| **API Analytics (`/api/analytics/log`)** | `private, no-cache, no-store` | Non mis en cache | Traitement immédiat des événements. |
| **API CRM & Administration (`/api/admin/*`)** | `private, no-cache, no-store, must-revalidate` | **Strictement interdit de mise en cache publique** | Protection intégrale des données personnelles des voyageurs (RGPD / CDP Sénégal). |

---

## 2. Configuration Next.js 15 & Compression

Dans [`next.config.ts`](file:///home/mouhammad/zahra-voyages/next.config.ts) :
1. **`compress: true` :** Compression Brotli / Gzip automatique des réponses HTML, CSS et JS.
2. **`poweredByHeader: false` :** Suppression de l'en-tête d'empreinte `x-powered-by: Next.js` (durcissement sécurité).
3. **`formats: ['image/avif', 'image/webp']` :** Négociation de contenu par défaut pour servir le format AVIF (gain de 20 à 30% par rapport au WebP).
