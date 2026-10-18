# Rapport 02/20 : Gestion du Domaine Principal, Redirections & Canonicalisation

**Date :** 18 Octobre 2026  
**Domaine Officiel :** `https://slaacvoyages.com`  
**Ancien Domaine Technique :** `https://slaac-voyages.vercel.app`  
**Registrar DNS :** LWS  
**Hébergeur Cloud :** Vercel  

---

## 1. Choix du Domaine Principal & Stratégie Canonique

La direction de SLAAC Voyages a validé la consolidation définitive vers :
**`https://slaacvoyages.com` (HTTPS, apex non-www)**.

### Matrice des Variantes et Règles de Redirection

| Variante Testée | Statut Cible | Action / Redirection | Conservation du Chemin |
| :--- | :---: | :--- | :---: |
| `http://slaacvoyages.com` | **301 / 308** | Redirigé vers `https://slaacvoyages.com` | Oui (`$request_uri`) |
| `https://slaacvoyages.com` | **200 OK** | **Domaine principal canonique officiel** | - |
| `http://www.slaacvoyages.com` | **301 / 308** | Redirigé vers `https://slaacvoyages.com` | Oui (`$request_uri`) |
| `https://www.slaacvoyages.com` | **301 / 308** | Redirigé vers `https://slaacvoyages.com` (Vercel Domain Config) | Oui (`$request_uri`) |
| `https://slaac-voyages.vercel.app` | **308** ou **Noindex** | Consolidation canonique / en-tête `X-Robots-Tag: noindex` | Oui |

---

## 2. Implémentation Technique dans Next.js 15

### A. Résolution Centrale de `SITE_URL` (`src/lib/site.ts`)
```typescript
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://slaacvoyages.com').replace(/\/$/, '');
```
- Cette valeur est la référence unique pour l'ensemble du site (Sitemap XML, balises meta canonical, OpenGraph, schémas JSON-LD).
- Même en environnement de preview ou si une variable d'environnement est omise, le repli par défaut pointe inconditionnellement vers l'adresse de production `https://slaacvoyages.com`.

### B. `metadataBase` dans le Root Layout (`src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // ...
};
```
- Toutes les balises relatives définies dans les pages (ex: `alternates: { canonical: '/transport' }`) sont automatiquement résolues par Next.js en URLs absolues parfaites : `https://slaacvoyages.com/transport`.
- Cela élimine tout risque de génération de canoniques pointant par inadvertance vers `localhost` ou `vercel.app`.

### C. Protection contre l'Indexation de l'Ancien Domaine Vercel (`slaac-voyages.vercel.app`)
- **Problématique :** Vercel fournit par défaut une URL en `*.vercel.app`. Si cette URL est partagée ou découverte par des robots tiers, elle peut créer du duplicate content.
- **Solution recommandée :**
  1. Dans le tableau de bord Vercel > Settings > Domains, `slaacvoyages.com` est configuré comme **Production Domain**. Vercel active automatiquement la redirection 308 permanente depuis `www.slaacvoyages.com`.
  2. Sur les déploiements preview et l'URL technique `slaac-voyages.vercel.app`, Vercel et le code applicatif injectent l'en-tête de réponse HTTP :
     ```http
     X-Robots-Tag: noindex, nofollow
     ```
  3. Chaque page HTML sert une balise `canonical` pointant invariablement vers `https://slaacvoyages.com/...`, garantissant que même si un robot accède au domaine Vercel, tout le crédit de ranking est transféré au domaine officiel.

---

## 3. Gestion des Paramètres d'URL & Traçabilité Marketing

- Les formulaires et le CRM de SLAAC Voyages collectent les paramètres UTM (`utm_source`, `utm_medium`, `utm_campaign`, etc.) pour tracer la conversion.
- La balise `<link rel="canonical" href="https://slaacvoyages.com/page" />` ignore expressément ces paramètres de requête.
- Ainsi, une visite via une publicité `https://slaacvoyages.com/transport?utm_source=facebook` est reconnue par Google comme étant exactement la page canonique `https://slaacvoyages.com/transport`, sans risque de fragmentation de l'index.
