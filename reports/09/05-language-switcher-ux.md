# Sélecteur de Langue UX, Accessibilité et Préservation de Contexte
## SLAAC Voyages | Composant LanguageSwitcher (`FR | EN`)

### 1. Objectifs UX et Exigences CRO
Un sélecteur de langue médiocre renvoie systématiquement l'utilisateur vers la page d'accueil lorsqu'il clique sur "EN" ou "FR", causant frustration et abandon de session.
Le composant `LanguageSwitcher` (`src/components/layout/language-switcher.tsx`) a été développé pour respecter 4 critères majeurs :
1. **Préservation stricte du contexte (In-Place Translation)** :
   - Sur `/transport` $\rightarrow$ clic sur "EN" bascule directement vers `/en/transport`.
   - Sur `/en/contact` $\rightarrow$ clic sur "FR" bascule directement vers `/contact`.
   - Sur `/en/dakar-2026` $\rightarrow$ clic sur "FR" bascule vers `/dakar-2026`.
2. **Accessibilité WCAG 2.2 et lecteurs d'écran** :
   - Balise sémantique `<nav aria-label="Sélecteur de langue / Language selector">`.
   - Attribut `aria-current="page"` appliqué sur la langue active.
   - Attributs `lang="fr"` et `lang="en"` ainsi que `hrefLang="fr"` et `hrefLang="en"` sur chaque lien pour informer les technologies d'assistance.
3. **Crawlabilité native par les robots** :
   - Utilisation de balises `<Link>` Next.js standards avec URLs réelles, sans masquage JavaScript ni dépendance à un état de session invisible aux moteurs de recherche.
4. **Ergonomie tactile et discrétion visuelle** :
   - Cibles tactiles calibrées ($\ge 44 \times 44$ px d'espacement effectif).
   - Intégration harmonieuse dans le bandeau supérieur (`Header`) et dans le pied de page (`Footer`).

### 2. Logique de Calcul d'URL (`getAlternatePath`)
Définie dans `src/i18n/routes.ts`, la fonction `getAlternatePath(currentPath, targetLocale)` résout automatiquement les correspondances :
```typescript
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  const normalized = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  if (targetLocale === 'en') {
    if (normalized === '/en' || normalized.startsWith('/en/')) return normalized;
    const match = ROUTE_PAIRS.find((p) => p.fr === normalized);
    if (match) return match.en;
    return '/en';
  } else {
    if (!normalized.startsWith('/en')) return normalized;
    const match = ROUTE_PAIRS.find((p) => p.en === normalized);
    if (match) return match.fr;
    return '/';
  }
}
```

### 3. Emplacement dans l'Interface
- **Header Desktop** : Visible en haut à droite, avant les boutons WhatsApp et Devis.
- **Header Mobile** : Présent dans le menu tiroir (`Sheet`) avec intitulé clair "Langue / Language".
- **Footer Universel** : Présent dans la barre inférieure de réassurance aux côtés des mentions légales et de la politique de confidentialité.
