import { z } from 'zod';

// ============================================================================
// SLAAC VOYAGES — SCHÉMAS DE VALIDATION DES DEVIS (CLIENT & SERVEUR)
// ============================================================================

export const SERVICE_VALUES = [
  'hebergement',
  'transport',
  'voyages-croisieres',
  'excursions',
  'tourisme-affaires',
  'reservation-express',
  'assistance-visa',
  'assurance-voyage',
  'preinscription-universitaire',
  'prise-de-rendez-vous',
] as const;

export type ServiceType = (typeof SERVICE_VALUES)[number];

export const SERVICE_LABELS_FR: Record<ServiceType, string> = {
  'hebergement': 'Hébergement',
  'transport': 'Transport & Transferts',
  'voyages-croisieres': 'Voyages & Croisières',
  'excursions': 'Excursions & Circuits',
  'tourisme-affaires': 'Tourisme d\'affaires & MICE',
  'reservation-express': 'Réservation Express',
  'assistance-visa': 'Assistance visa',
  'assurance-voyage': 'Assurance voyage',
  'preinscription-universitaire': 'Préinscription universitaire',
  'prise-de-rendez-vous': 'Prise de rendez-vous',
};

export const SERVICE_LABELS: Record<ServiceType, string> = SERVICE_LABELS_FR;

export const SERVICE_LABELS_EN: Record<ServiceType, string> = {
  'hebergement': 'Accommodation & Stays',
  'transport': 'Airport Transfers & Transport',
  'voyages-croisieres': 'Travel & Cruises',
  'excursions': 'Private Tours & Day Trips',
  'tourisme-affaires': 'Corporate Travel & MICE',
  'reservation-express': 'Flight Ticketing & Booking',
  'assistance-visa': 'Visa & Travel Assistance',
  'assurance-voyage': 'Travel Insurance',
  'preinscription-universitaire': 'University Pre-enrollment',
  'prise-de-rendez-vous': 'Embassy Appointment Booking',
};

export const SERVICE_OPTIONS = SERVICE_VALUES.map((val) => ({
  value: val,
  label: SERVICE_LABELS[val],
}));

export function getServiceOptions(locale: 'fr' | 'en' = 'fr') {
  const labels = locale === 'en' ? SERVICE_LABELS_EN : SERVICE_LABELS_FR;
  return SERVICE_VALUES.map((val) => ({
    value: val,
    label: labels[val] || val,
  }));
}


/**
 * Validation robuste du numéro de téléphone international :
 * - Accepte le préfixe '+' optionnel
 * - Chiffres, espaces, tirets, points, parenthèses
 * - Longueur minimale de 6 chiffres utiles, max 30 caractères au total
 * - Compatible formats Sénégal (+221 77 ..., 77 ..., 78 ...), France (+33), etc.
 */
export const phoneRegex = /^[+]?[0-9\s()./-]{6,30}$/;

/**
 * Nettoyeur récursif pour Firestore :
 * Supprime toute clé dont la valeur est `undefined` pour éviter les crashs Firestore
 * "Function DocumentReference.set() called with invalid data. Unsupported field value: undefined".
 */
export function cleanFirestoreData<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) {
      continue;
    }
    if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      cleaned[key] = cleanFirestoreData(val as Record<string, unknown>);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned as Partial<T>;
}

/**
 * Schéma de base commun aux formulaires de devis.
 */
export const baseQuoteSchema = z.object({
  service: z.enum(SERVICE_VALUES).default('reservation-express'),
  name: z
    .string()
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères.')
    .max(100, 'Nom trop long (maximum 100 caractères).'),
  phone: z
    .string()
    .trim()
    .min(6, 'Numéro de téléphone requis (au moins 6 caractères).')
    .max(30, 'Numéro de téléphone trop long.')
    .regex(phoneRegex, 'Format de téléphone invalide (ex: +221 77 312 90 90).')
    .refine((val) => val.replace(/\D/g, '').length >= 6, 'Le numéro doit comporter au moins 6 chiffres.'),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide.')
    .max(150, 'Adresse email trop longue.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  destination: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  departureCountry: z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined)),
  preferredCurrency: z.enum(['XOF', 'EUR', 'USD']).optional().or(z.literal('').transform(() => undefined)),
  travelers: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
  message: z.string().trim().max(2500, 'Message trop long (max 2500 caractères).').optional().or(z.literal('').transform(() => undefined)),
  locale: z.enum(['fr', 'en']).optional().default('fr'),

  // Champs conditionnels par service
  // Hébergement
  nights: z.coerce.number().int().min(1).max(365).optional(),
  roomType: z.enum(['standard', 'deluxe', 'suite']).optional().or(z.literal('').transform(() => undefined)),

  // Transport & Transfert
  transportClass: z.enum(['economy', 'business', 'first']).optional().or(z.literal('').transform(() => undefined)),
  roundTrip: z.boolean().optional(),
  departureDate: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
  returnDate: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),

  // Voyages & Croisières
  durationDays: z.coerce.number().int().min(1).max(365).optional(),
  cabinType: z.enum(['inside', 'oceanview', 'balcony', 'suite']).optional().or(z.literal('').transform(() => undefined)),

  // Excursions
  excursionDate: z.string().trim().max(30).optional().or(z.literal('').transform(() => undefined)),
  pickupLocation: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),

  // Tourisme d'affaires / MICE
  attendees: z.coerce.number().int().min(1).max(10000).optional(),
  eventType: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  companyName: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),

  // Assistance voyage & études
  studyCity: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  studyDegree: z.string().trim().max(120).optional().or(z.literal('').transform(() => undefined)),
  appointmentReason: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),

  // Traçabilité & attribution marketing (UTM & Click IDs)
  source: z.string().trim().max(100).optional(),
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
  utmContent: z.string().trim().max(100).optional(),
  utmTerm: z.string().trim().max(100).optional(),
  gclid: z.string().trim().max(128).optional(),
  gbraid: z.string().trim().max(128).optional(),
  wbraid: z.string().trim().max(128).optional(),
  fbclid: z.string().trim().max(128).optional(),
  ttclid: z.string().trim().max(128).optional(),
  referrer: z.string().trim().max(250).optional(),
  landingPage: z.string().trim().max(250).optional(),

  // Protection idempotence & anti-robots
  clientSubmissionId: z.string().trim().max(128).optional(),
  website: z.string().max(200).optional().or(z.literal('').transform(() => undefined)), // Pot de miel anti-spam
  captchaToken: z.string().max(2000).optional(),
});

/**
 * Schéma affiné avec validation de cohérence de dates (départ <= retour).
 */
export const quoteSchema = baseQuoteSchema.refine(
  (data) => {
    if (data.departureDate && data.returnDate && data.roundTrip) {
      const dep = new Date(data.departureDate).getTime();
      const ret = new Date(data.returnDate).getTime();
      if (!isNaN(dep) && !isNaN(ret) && ret < dep) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'La date de retour ne peut pas être antérieure à la date de départ.',
    path: ['returnDate'],
  }
);

export type QuoteInput = z.infer<typeof quoteSchema>;
