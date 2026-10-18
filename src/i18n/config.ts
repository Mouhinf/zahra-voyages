export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export interface LocaleConfig {
  code: Locale;
  label: string;
  nativeLabel: string;
  htmlLang: string;
  ogLocale: string;
  currency: string;
  timezone: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
}

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  fr: {
    code: 'fr',
    label: 'Français',
    nativeLabel: 'Français',
    htmlLang: 'fr',
    ogLocale: 'fr_SN',
    currency: 'XOF',
    timezone: 'Africa/Dakar',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    htmlLang: 'en',
    ogLocale: 'en_US',
    currency: 'USD',
    timezone: 'Africa/Dakar',
    direction: 'ltr',
    dateFormat: 'yyyy-MM-dd',
  },
};

export function isSupportedLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
