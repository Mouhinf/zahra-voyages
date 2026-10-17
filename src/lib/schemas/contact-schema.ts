import { z } from 'zod';
import { phoneRegex } from './quote-schema';

// ============================================================================
// SLAAC VOYAGES — SCHÉMA DE VALIDATION DU FORMULAIRE DE CONTACT (CLIENT & SERVEUR)
// ============================================================================

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères.')
    .max(100, 'Nom trop long (maximum 100 caractères).'),
  email: z
    .string()
    .trim()
    .email('Veuillez entrer une adresse email valide.')
    .max(150, 'Adresse email trop longue.'),
  phone: z
    .string()
    .trim()
    .max(30, 'Numéro de téléphone trop long.')
    .regex(phoneRegex, 'Format de téléphone invalide (ex: +221 77 312 90 90).')
    .refine((val) => val.replace(/\D/g, '').length >= 6, 'Le numéro doit comporter au moins 6 chiffres.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  message: z
    .string()
    .trim()
    .min(10, 'Le message doit comporter au moins 10 caractères.')
    .max(3000, 'Message trop long (maximum 3000 caractères).'),
  // Pot de miel anti-robots (doit rester vide)
  website: z.string().max(200).optional().or(z.literal('').transform(() => undefined)),
  // Traçabilité marketing
  utmSource: z.string().trim().max(100).optional(),
  utmMedium: z.string().trim().max(100).optional(),
  utmCampaign: z.string().trim().max(100).optional(),
  referrer: z.string().trim().max(250).optional(),
  landingPage: z.string().trim().max(250).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
