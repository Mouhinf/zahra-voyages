# Référencement International, Balises Hreflang et Canonical
## SLAAC Voyages | Google Search Console & Directives Internationales

### 1. Principes du Référencement International Google
Pour éviter les pénalités de contenu dupliqué et garantir que Google affiche l'URL appropriée aux internautes selon leur langue et géolocalisation :
- Chaque page doit pointer vers son URL canonique absolue.
- Chaque URL bilingue doit déclarer des annotations `hreflang` réciproques complètes (self-referential hreflang).
- Une directive `x-default` doit être définie pour les utilisateurs dont la langue n'est ni le français ni l'anglais.

### 2. Implémentation des Alternates Next.js sur les 10 Routes Paires
Dans chaque `page.tsx` ou `layout.tsx`, l'objet `metadata.alternates` est rigoureusement renseigné :

```typescript
// Exemple sur la page transport (/en/transport)
export const metadata: Metadata = {
  title: 'AIBD Airport Transfers & Private Chauffeur in Dakar | SLAAC Voyages',
  alternates: {
    canonical: '/en/transport',
    languages: {
      fr: 'https://slaacvoyages.com/transport',
      en: 'https://slaacvoyages.com/en/transport',
      'x-default': 'https://slaacvoyages.com/transport',
    },
  },
};

// Et réciproquement sur la page française (/transport)
export const metadata: Metadata = {
  title: 'Transfert Aéroport AIBD Dakar & VTC Privé | SLAAC Voyages',
  alternates: {
    canonical: '/transport',
    languages: {
      fr: 'https://slaacvoyages.com/transport',
      en: 'https://slaacvoyages.com/en/transport',
      'x-default': 'https://slaacvoyages.com/transport',
    },
  },
};
```

### 3. Matrice des 10 Couples d'URLs Réciproques
1. `/` $\leftrightarrow$ `/en` (Racines FR/EN)
2. `/transport` $\leftrightarrow$ `/en/transport`
3. `/hebergement` $\leftrightarrow$ `/en/hebergement`
4. `/excursions` $\leftrightarrow$ `/en/excursions`
5. `/tourisme-affaires` $\leftrightarrow$ `/en/tourisme-affaires`
6. `/assistance-voyage` $\leftrightarrow$ `/en/assistance-voyage`
7. `/destinations` $\leftrightarrow$ `/en/destinations`
8. `/about` $\leftrightarrow$ `/en/about`
9. `/contact` $\leftrightarrow$ `/en/contact`
10. `/dakar-2026` $\leftrightarrow$ `/en/dakar-2026`

### 4. Règle `x-default`
Dans toutes les configurations, `x-default` pointe vers la version française d'origine (`https://slaacvoyages.com/...`), affirmant l'ancrage sénégalais de l'agence tout en ouvrant l'indexation internationale.
