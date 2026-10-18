# Spécification et Validation des Données Structurées TravelAgency & LocalBusiness
## SLAAC Voyages | Schéma Schema.org JSON-LD

---

### 1. Objectif Sémantique

Le balisage Schema.org permet aux robots d'indexation de Google de comprendre avec précision :
- La nature de l'entité : Agence de voyages et établissement local physique à Dakar.
- Sa localisation géographique exacte (adresse postale et coordonnées GPS).
- Ses points de contact (service client, billetterie, WhatsApp).
- Ses plages horaires d'ouverture au public.
- Son catalogue de prestations de services.

---

### 2. Implémentation du Schéma Racine

Le schéma généré par [`src/lib/seo-schema.ts`](file:///home/mouhammad/zahra-voyages/src/lib/seo-schema.ts) via `getTravelAgencySchema()` est directement injecté dans le `<head>` de toutes les pages :

```json
{
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "LocalBusiness"],
  "@id": "https://slaacvoyages.com/#travelagency",
  "name": "SLAAC Voyages",
  "legalName": "SLAAC Voyages SARL",
  "url": "https://slaacvoyages.com",
  "logo": "https://slaacvoyages.com/logo-slaac.png",
  "image": "https://res.cloudinary.com/dvnq5qwbd/image/upload/f_auto,q_auto/hero-section-voyages.png",
  "description": "Agence de voyages et conciergerie touristique à Dakar Plateau. Billetterie aérienne, transferts aéroport AIBD, hébergements vérifiés, excursions au Sénégal et visas d'affaires.",
  "telephone": "+221773129090",
  "email": "contact@slaacvoyages.com",
  "hasMap": "https://www.google.com/maps/dir/?api=1&destination=14.6686685,-17.4343981",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage",
    "addressLocality": "Dakar",
    "addressRegion": "Dakar Plateau",
    "postalCode": "10200",
    "addressCountry": "SN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 14.6687,
    "longitude": -17.4344
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+221773129090",
      "contactType": "customer service",
      "areaServed": "SN",
      "availableLanguage": ["French", "English", "Wolof"]
    },
    {
      "@type": "ContactPoint",
      "telephone": "+221776245858",
      "contactType": "sales",
      "areaServed": "SN",
      "availableLanguage": ["French", "English"]
    }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:30",
      "closes": "18:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday"],
      "opens": "09:00",
      "closes": "15:00"
    }
  ],
  "priceRange": "$$",
  "currenciesAccepted": "XOF, EUR, USD",
  "paymentAccepted": "Cash, Credit Card, Bank Transfer, Wave, Orange Money",
  "sameAs": [
    "https://wa.me/221773129090",
    "https://www.google.com/maps/dir/?api=1&destination=14.6686685,-17.4343981"
  ]
}
```

---

### 3. Engagements Déontologiques Respectés

1. **Aucun `AggregateRating` inventé :** En conformité stricte avec les *Google Search Central Guidelines*, aucun faux avis ni note artificielle de 4,9/5 n'est injectée dans le code. Les avis affichés dans Google proviendront exclusivement de véritables évaluations laissées par des clients sur Google Business Profile.
2. **Identifiant `@id` pérenne :** L'URI stable `https://slaacvoyages.com/#travelagency` permet aux moteurs de relier toutes les mentions de l'agence à travers le web à cette entité unique.
3. **Précision GPS vérifiée :** La latitude `14.6687` et longitude `-17.4344` pointent sur le toit de l'immeuble situé Rue Mohamed V à Dakar Plateau.
