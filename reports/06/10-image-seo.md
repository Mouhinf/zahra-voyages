# 10 — Optimisation SEO des Images & Découvrabilité Visuelle
**Projet :** SLAAC Voyages (`https://slaacvoyages.com`)  
**Phase :** Prompt 06/12 — SEO Technique Avancé & Indexation Google  
**Statut :** Formats WebP/AVIF Cloudinary, attributs ALT descriptifs & Googlebot-Image autorisé

---

## 1. Contexte & Enjeux

Dans l'industrie du tourisme, Google Images et Google Lens représentent un levier majeur d'acquisition d'utilisateurs en phase d'inspiration. Auparavant :
- Certaines images utilisaient des textes alternatifs vagues ou vides.
- `robots.txt` ne précisait pas explicitement de directive dédiée pour `Googlebot-Image`.
- Des images étaient chargées sans dimensions explicites provoquant des sauts de mise en page (CLS).

---

## 2. Mesures Mises en Œuvre

### 2.1. Directive Spécifique dans `robots.txt`
```typescript
{
  userAgent: 'Googlebot-Image',
  allow: '/',
  disallow: [
    '/admin/',
    '/api/',
  ],
}
```
Cette règle garantit que le robot d'indexation d'images de Google dispose d'un accès prioritaire sans restriction sur tous les médias publics du catalogue.

### 2.2. Composant `next/image` et Dimensions Explicites
- Toutes les images du site passent par `next/image` avec `sizes` adaptés au responsive (`sizes="(max-width: 768px) 100vw, 33vw"`).
- Les images de hero au-dessus de la ligne de flottaison intègrent la propriété `priority` pour maximiser le LCP.
- Le paramètre `fill` avec un conteneur relatif garantit l'absence de Cumulative Layout Shift (CLS = 0).

### 2.3. Textes Alternatifs (ALT) Contextuels & Sémantiques
- Sur les fiches détaillées : `alt={item.titre}` avec contexte de lieu.
- Sur les vignettes de catalogue : `alt={`${item.titre} - SLAAC Voyages Sénégal`}`.
- Sur la page d'accueil : bannière OpenGraph optimisée (`alt: 'SLAAC Voyages Conciergerie Dakar'`).
- CDN Cloudinary configuré avec `f_auto,q_auto` pour servir automatiquement le format le plus performant (WebP ou AVIF).
