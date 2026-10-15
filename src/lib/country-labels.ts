/**
 * Correspondance des codes pays ISO 3166-1 alpha-2 vers noms français et drapeaux.
 */

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES_MAP: Record<string, { name: string; flag: string }> = {
  SN: { name: 'Sénégal', flag: '🇸🇳' },
  FR: { name: 'France', flag: '🇫🇷' },
  US: { name: 'États-Unis', flag: '🇺🇸' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  BE: { name: 'Belgique', flag: '🇧🇪' },
  ES: { name: 'Espagne', flag: '🇪🇸' },
  IT: { name: 'Italie', flag: '🇮🇹' },
  GB: { name: 'Royaume-Uni', flag: '🇬🇧' },
  DE: { name: 'Allemagne', flag: '🇩🇪' },
  CH: { name: 'Suisse', flag: '🇨🇭' },
  MA: { name: 'Maroc', flag: '🇲🇦' },
  CI: { name: "Côte d'Ivoire", flag: '🇨🇮' },
  ML: { name: 'Mali', flag: '🇲🇱' },
  GN: { name: 'Guinée', flag: '🇬🇳' },
  GM: { name: 'Gambie', flag: '🇬🇲' },
  MR: { name: 'Mauritanie', flag: '🇲🇷' },
  AE: { name: 'Émirats Arabes Unis', flag: '🇦🇪' },
  SA: { name: 'Arabie Saoudite', flag: '🇸🇦' },
  UNKNOWN: { name: 'Autre / Non identifié', flag: '🌐' },
};

export function getCountryInfo(code: string): CountryInfo {
  const upper = (code || 'UNKNOWN').toUpperCase();
  const info = COUNTRIES_MAP[upper] || { name: upper, flag: '🌍' };
  return { code: upper, name: info.name, flag: info.flag };
}
