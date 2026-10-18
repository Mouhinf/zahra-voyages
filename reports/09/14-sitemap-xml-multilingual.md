# Sitemap XML Multilingue et Découvrabilité par les Moteurs
## SLAAC Voyages | `src/app/sitemap.ts` & Dynamic Sitemap Generation

### 1. Rôle du Sitemap Multilingue
Le fichier `sitemap.xml` est le contrat technique soumis aux robots d'exploration (Google Search Console, Bing Webmaster Tools). Il permet de :
- Garantir la découverte immédiate de toutes les nouvelles pages candidates anglaises.
- Indiquer explicitement les correspondances linguistiques via l'extension standard `xhtml:link rel="alternate" hreflang="..."`.
- Définir des priorités et fréquences d'actualisation adaptées à la saisonnalité touristique.

### 2. Intégration dans `src/app/sitemap.ts`
Chaque entrée statique bilingue intègre le bloc `alternates.languages` complet :
```typescript
{
  url: `${SITE_URL}/en/transport`,
  lastModified: STATIC_CONTENT_LASTMOD,
  changeFrequency: 'weekly',
  priority: 0.85,
  alternates: {
    languages: {
      fr: `${SITE_URL}/transport`,
      en: `${SITE_URL}/en/transport`,
      'x-default': `${SITE_URL}/transport`,
    },
  },
}
```

### 3. Hiérarchie des Priorités d'Indexation
- **1.0** : Accueil France (`/`).
- **0.95** : Accueil International Anglais (`/en`).
- **0.90** : Pôles majeurs FR (`/transport`, `/hebergement`).
- **0.85** : Pôles majeurs EN (`/en/transport`, `/en/hebergement`) + Excursions, Affaires, Dakar 2026, Omra, Guides.
- **0.80** : Tourisme d'affaires EN, Excursions EN, Voyages croisières, Assistance voyage.
- **0.75** : Assistance voyage EN.
- **0.70** : Contact FR/EN, Destinations FR/EN, Services.
- **0.60** : À propos FR/EN (`/about`, `/en/about`).
- **0.30** : Mentions légales et politique de confidentialité.

### 4. Robustesse et Repli Contrôlé
Le sitemap conserve son garde-fou de temporisation (timeout de 2,5s sur Firestore) avec repli instantané vers le catalogue certifié statique, garantissant une disponibilité permanente à 100% lors des passages de Googlebot.
