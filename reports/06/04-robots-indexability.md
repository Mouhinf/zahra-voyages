# Rapport 04/20 : Directives Robots.txt, Protection de l'Espace Admin & Indexabilité

**Date :** 18 Octobre 2026  
**Fichiers Modifiés :**  
- [`src/app/robots.ts`](file:///home/mouhammad/zahra-voyages/src/app/robots.ts) (Endpoint `/robots.txt`)  
- [`src/app/admin/layout.tsx`](file:///home/mouhammad/zahra-voyages/src/app/admin/layout.tsx) (Layout serveur racine de l'espace administration)  

---

## 1. Principes Fondamentaux de Sécurité et d'Indexation

Deux erreurs fréquentes en matière de référencement ont été résolues :

1. **Confusion entre Sécurité et Robots.txt :**
   - Bloquer une URL via `robots.txt` n'est **en aucun cas une mesure de sécurité**. Un utilisateur malveillant ou un robot clandestin peut ignorer `robots.txt`.
   - La sécurité des données clients (devis, contacts, statistiques) de SLAAC Voyages repose exclusivement sur l'authentification serveur Firebase Admin SDK et les règles de sécurité Firestore auditées au Prompt 01 et 02.

2. **Le Piège du Disallow empêchant la lecture du Noindex :**
   - Lorsqu'une page est déclarée `Disallow: /admin/` dans `robots.txt`, les moteurs de recherche respectueux s'abstiennent de télécharger le contenu HTML.
   - En conséquence, le robot ne peut pas analyser la balise `<meta name="robots" content="noindex" />`. S'il découvre un lien externe pointant vers `/admin/login`, Google peut indexer l'URL nue sans description.

---

## 2. Architecture Implémentée

### A. Déclaration Dédiée dans `src/app/admin/layout.tsx`
Un layout serveur global enveloppant l'ensemble de l'espace administration (`/admin/login` et routes protégées CRM) a été créé :
```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};
```
- **Résultat :** Tout contenu situé sous `/admin` renvoie automatiquement l'en-tête et les balises d'exclusion les plus strictes.

### B. Configuration de `src/app/robots.ts`
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```
- **Ouverture totale :** Les robots d'exploration générale et `Googlebot-Image` ont un accès libre aux visuels Cloudinary et aux pages de services publiques.
- **Fermeture ciblée :** Les répertoires techniques internes (`/api/`, `/_next/`) et les interfaces d'administration sont formellement fermés aux crawls inutiles.
- **Liaison sitemap :** L'URL absolue `https://slaacvoyages.com/sitemap.xml` est transmise dès le premier contact avec les crawlers.
