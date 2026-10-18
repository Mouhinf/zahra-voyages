# Architecture Technique du CMS et Modélisation Éditoriale
## SLAAC Voyages | Next.js 15, TypeScript & Données Firestore

---

### 1. Philosophie d'Architecture : Performance & Typage Rigoureux

Pour concilier vitesse de chargement instantanée (Core Web Vitals), sécurité des données et facilité de mise à jour par l'équipe marketing, la gestion éditoriale s'articule autour de deux modes complémentaires :
1. **Piliers statiques pré-générés (SSG / ISR) :** Définis dans `src/data/guides.ts` avec typage strict TypeScript `PracticalGuide`. Ils garantissent une vitesse d'affichage optimale sans latence de base de données à chaque requête.
2. **Extensions dynamiques Firestore :** Possibilité d'administrer des guides et actualités supplémentaires depuis le panneau d'administration `/admin`, avec validation de schéma Zod et synchronisation du cache Next.js via `revalidateTag` ou `revalidatePath`.

---

### 2. Modèle de Données TypeScript (`PracticalGuide`)

```typescript
export interface PracticalGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: 'Logistique AIBD' | 'Patrimoine & Culture' | 'Hébergement' | 'Pèlerinages' | 'Affaires B2B' | 'Formalités & Visas';
  readingTime: string;
  publishedAt: string;
  verifiedAt: string;
  heroImage: string;
  summary: string;
  author: {
    name: string;
    role: string;
    agency: string;
  };
  sections: {
    heading: string;
    content: string;
    subsections?: {
      subheading: string;
      body: string;
    }[];
  }[];
  practicalFaq: {
    question: string;
    answer: string;
  }[];
  officialSources: {
    title: string;
    note: string;
    verifiedDate: string;
  }[];
  relatedService: {
    label: string;
    serviceSlug: string;
    destination: string;
    ctaText: string;
    href: string;
  };
}
```

---

### 3. Workflow de Publication et Contrôle de Validité

1. **Phase de Rédaction :** Rédaction du contenu brut en markdown ou JSON structuré en respectant la charte éditoriale (longueur minimale 800 mots, présence de 3 H2 minimum, 1 FAQ pratique).
2. **Vérification Juridique et Consulaire :** Examen des mentions légales (absence de garanties de visa, vérification des sources officielles d'immigration et des tarifs réglementés).
3. **Validation Technique CI/CD :**
   - Contrôle des types via `npx tsc --noEmit`.
   - Exécution de la suite de tests automatisée `node tests/editorial-seo.test.mjs`.
   - Contrôle du sitemap dynamique pour garantir l'inclusion automatique de la nouvelle URL canonique.
4. **Déploiement en Production :** Compilation Next.js SSG avec régénération incrémentale ISR (`revalidate = 300`).
