import type { Locale } from './config';
import type { Dictionary } from './types';
import fr from './dictionaries/fr.json';
import en from './dictionaries/en.json';

const dictionaries: Record<Locale, Dictionary> = {
  fr: fr as Dictionary,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale = 'fr'): Dictionary {
  return dictionaries[locale] || dictionaries.fr;
}
