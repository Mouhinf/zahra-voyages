// Libellés FR des services proposés dans le formulaire de devis
// (miroir de src/app/api/quotes — champ `service`).
export const SERVICE_LABELS: Record<string, string> = {
  hebergement: 'Hébergement',
  transport: 'Transport',
  'voyages-croisieres': 'Voyages & Croisières',
  excursions: 'Excursions',
  'tourisme-affaires': "Tourisme d'affaires",
  'reservation-express': 'Réservation Express',
  'assistance-visa': 'Assistance visa',
  'assurance-voyage': 'Assurance voyage',
  'preinscription-universitaire': 'Préinscription universitaire',
  'prise-de-rendez-vous': 'Prise de rendez-vous',
};

export function serviceLabel(key: string): string {
  return SERVICE_LABELS[key] ?? key;
}
