# 08 — Stratégie SEO International & Balises Hreflang
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Architecture bilingue (FR/EN) déclarée & découvrable

---

## 1. Contexte & Enjeux Internationaux

SLAAC Voyages opère sur un carrefour stratégique :
- Une clientèle locale et diaspora francophone (Sénégal, France, Belgique, Suisse, Canada).
- Une clientèle d'affaires internationale, diplomatique et touristique anglophone (USA, Royaume-Uni, délégations sportives pour Dakar 2026).

Auparavant, la route `/en` existait mais n'était liée par aucun commutateur de langue dans le Header ou le Footer, et les balises `alternate` dans le `layout.tsx` étaient incomplètes.

---

## 2. Implémentation Technique

### 2.1. Déclaration dans `src/app/layout.tsx`
Dans l'objet `Metadata`, nous avons configuré :
```typescript
alternates: {
  canonical: '/',
  languages: {
    'fr-SN': '/',
    'fr': '/',
    'en-US': '/en',
    'en': '/en',
    'x-default': '/',
  },
}
```
- `'fr-SN'` et `'fr'` ciblent l'Afrique francophone et la France comme langue par défaut.
- `'en-US'` et `'en'` orientent le trafic anglophone vers la landing `/en`.
- `'x-default'` oriente les robots de recherche et utilisateurs tiers vers la page principale en français.

### 2.2. Balises Hreflang dans le Sitemap XML (`src/app/sitemap.ts`)
Chaque entrée maîtresse du sitemap comporte désormais les balises `alternates` :
```typescript
alternates: {
  languages: {
    fr: `${SITE_URL}/`,
    en: `${SITE_URL}/en`,
    'x-default': `${SITE_URL}/`,
  },
}
```

### 2.3. Commutateur de Langue Crawlable (Header & Footer)
Un lien HTML statique `<Link href="/" hrefLang="fr" lang="fr">` et `<Link href="/en" hrefLang="en" lang="en">` a été inséré :
1. Dans la barre de navigation desktop (`src/components/layout/header.tsx`).
2. Dans le menu mobile (Sheet).
3. Dans la rangée de bas de page (`src/components/layout/footer.tsx`).

Cela garantit aux robots Googlebot l'exploration bidirectionnelle des deux versions linguistiques sans dépendre d'exécutions JavaScript complexes.
