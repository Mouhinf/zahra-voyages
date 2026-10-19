# Phase C : Audit de la Metadata Next.js 15 & Déclarations HTML
**Projet :** SLAAC Voyages (https://slaacvoyages.com)  
**Date d'audit :** 19 octobre 2026  

---

## 1. Déclaration dans `src/app/layout.tsx`

La configuration Next.js 15 utilise l'API officielle `Metadata` avec déclaration explicite des icônes et de leurs attributs `sizes` et `type` :

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SLAAC Voyages - Votre Passeport pour le Monde',
    template: '%s | SLAAC Voyages',
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-SN': '/',
      'fr': '/',
      'en-US': '/en',
      'en': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: SITE_NAME, // 'SLAAC Voyages'
    url: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: '6ElmrLDCGkGe-Qrf27HeUxzhemAtFSQh6oGKl4nBusM',
  },
};
```

---

## 2. Balises HTML effectivement générées dans le `<head>`

L'inspection de la réponse HTML en direct sur `https://slaacvoyages.com` confirme la génération fidèle des balises attendues par Next.js :

```html
<link rel="canonical" href="https://slaacvoyages.com"/>
<link rel="alternate" hrefLang="fr" href="https://slaacvoyages.com"/>
<link rel="alternate" hrefLang="en" href="https://slaacvoyages.com/en"/>
<link rel="alternate" hrefLang="x-default" href="https://slaacvoyages.com"/>
<link rel="icon" href="/favicon.ico"/>
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png"/>
<link rel="icon" href="/favicon-96.png" sizes="96x96" type="image/png"/>
<link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png"/>
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"/>
<link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"/>
<meta name="google-site-verification" content="6ElmrLDCGkGe-Qrf27HeUxzhemAtFSQh6oGKl4nBusM"/>
```

---

## 3. Données Structurées Schema.org pour l'Identité de Marque

Pour consolider le nom du site et l'autorité de la marque auprès de Google Search, nous avons intégré le schéma `WebSite` préconisé par Google Search Central (`https://developers.google.com/search/docs/appearance/site-names`) :

### Schema `WebSite` :
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://slaacvoyages.com/#website",
  "name": "SLAAC Voyages",
  "alternateName": ["SLAAC"],
  "url": "https://slaacvoyages.com/"
}
```

### Schema `TravelAgency` :
```json
{
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "LocalBusiness"],
  "@id": "https://slaacvoyages.com/#travelagency",
  "name": "SLAAC Voyages",
  "legalName": "SLAAC Voyages SARL",
  "url": "https://slaacvoyages.com",
  "logo": "https://slaacvoyages.com/logo-slaac.png"
}
```

---

## 4. Cohérence FR et EN

* **Page FR (`/`) :** Hérite des favicons du RootLayout, déclare canonical `/` et alternates `fr`, `en`, `x-default`.
* **Page EN (`/en`) :** Hérite des mêmes icônes du RootLayout, déclare canonical `/en` et conserve le nom de marque `SLAAC Voyages`.

**Statut Phase C : CORRIGÉ DANS LE CODE & VALIDÉ**
