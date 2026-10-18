# Rendu Dynamique SSR de `<html lang>`
## SLAAC Voyages | Conformité WCAG 2.2 et SEO International

### 1. Pourquoi le Rendu SSR de `<html lang>` est Crucial
La balise racine `<html>` doit porter l'attribut `lang` correspondant exactement au contenu textuel de la page (`lang="fr"` ou `lang="en"`).
- **Pour l'accessibilité (WCAG 2.2 Critère 3.1.1 - Niveau A)** : Les lecteurs d'écran (NVDA, JAWS, VoiceOver, TalkBack) se basent sur cet attribut pour appliquer la bonne table de prononciation et la synthèse vocale adaptée.
- **Pour les moteurs de recherche (Google, Bing, Yandex)** : L'analyseur linguistique du crawler valide la cohérence entre la langue déclarée dans le HTML brut et les balises `hreflang`. Un décalage génère des signaux contradictoires.

### 2. Solution Implémentée dans `src/app/layout.tsx`
Dans Next.js 15 App Router avec Server Components, `RootLayout` extrait l'en-tête `x-slaac-locale` fourni par le middleware :

```typescript
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const headerLocale = headersList.get('x-slaac-locale');
  const locale = (headerLocale === 'en' ? 'en' : 'fr') as 'fr' | 'en';

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

### 3. Validation par les Tests Automatisés
- Requête sur `/` ou `/transport` $\rightarrow$ Le HTML généré côté serveur démarre par `<html lang="fr" ...>`.
- Requête sur `/en` ou `/en/transport` $\rightarrow$ Le HTML généré côté serveur démarre par `<html lang="en" ...>`.
- Le test unitaire `tests/i18n-system.test.mjs` (Critère 3) vérifie la présence de cette lecture dynamique et son application stricte sans flash de contenu unilingue côté client.
