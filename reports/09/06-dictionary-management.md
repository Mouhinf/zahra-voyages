# Gestion des Dictionnaires et Typage TypeScript
## SLAAC Voyages | `src/i18n/dictionaries/` & Typed Dictionary Access

### 1. Organisation des Fichiers de Traduction
Les chaînes de caractères de l'interface sont organisées dans des fichiers JSON structurés par domaines fonctionnels sous `src/i18n/dictionaries/` :
- `fr.json` : Dictionnaire de référence en français.
- `en.json` : Dictionnaire anglais correspondant rigoureusement à la même structure.

### 2. Arborescence des Clés et Domaines
Les dictionnaires couvrent l'intégralité des briques globales du site :
1. `nav` : Navigation principale (`home`, `flights`, `stays`, `transfers`, `tours`, `business`, `assistance`, `dakar2026`, `about`, `contact`, `guides`, `omra`).
2. `hero` : Titres d'accroche, sous-titres, promesses de valeur et libellés des boutons d'action.
3. `services` : Noms des 6 services phares et descriptions courtes.
4. `quotes` : Textes du formulaire de devis (titres d'étapes, labels des champs, placeholders, boutons d'envoi, mentions d'engagement sous 24h).
5. `contact` : Titres de la page contact, labels, messages de validation et informations horaires.
6. `footer` : Titres des colonnes de liens, texte de newsletter, promesses et copyright légal.
7. `common` : Mots-clés transverses (`readMore`, `requestQuote`, `callUs`, `whatsapp`, `send`, `loading`, `success`, `error`).

### 3. Contrôle de Parité Stricte par Test Automatisé
Le Critère 01 de notre suite de tests `tests/i18n-system.test.mjs` vérifie à chaque exécution la parité récursive absolue des clés entre `fr.json` et `en.json` :
- Toute clé ajoutée en français sans équivalent anglais fait immédiatement échouer le test.
- Toute clé orpheline en anglais est détectée.
- Résultat actuel : **100% de parité validée sur l'ensemble de l'arborescence**.

### 4. Accesseur Typé (`getDictionary`)
Le module `src/i18n/get-dictionary.ts` fournit un accesseur asynchrone sécurisé en TypeScript :
```typescript
import type { Locale } from './config';
import type { Dictionary } from './types';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import('./dictionaries/fr.json').then((module) => module.default as Dictionary),
  en: () => import('./dictionaries/en.json').then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
```
Ce découpage permet le code-splitting automatique : les navigateurs francophones ne téléchargent jamais le dictionnaire anglais inutilement.
