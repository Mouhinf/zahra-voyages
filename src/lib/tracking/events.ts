/**
 * Taxonomie normalisée des événements de conversion et d'acquisition commerciale — SLAAC Voyages.
 *
 * Principes :
 * 1. Distinction stricte entre engagement (clic, affichage) et conversion commerciale (lead_created).
 * 2. Génération déterministe d'identifiants d'événements (`eventId`) pour garantir la déduplication
 *    entre le navigateur (Pixel) et le serveur (Conversions API).
 * 3. Aucune PII (données personnelles) en clair dans les charges utiles d'événements publics.
 */

export const CONVERSION_EVENT_NAMES = [
  'page_view',
  'service_view',
  'cta_click',
  'whatsapp_click',
  'quote_start',
  'quote_step_complete',
  'quote_submit_attempt',
  'lead_created',
  'lead_qualified',
  'quote_sent',
  'booking_confirmed',
  'customer_acquired',
] as const;

export type ConversionEventName = (typeof CONVERSION_EVENT_NAMES)[number];

export interface BaseEventPayload {
  eventId?: string;
  timestamp?: number;
  page?: string;
  locale?: 'fr' | 'en';
}

export interface PageViewPayload extends BaseEventPayload {
  title?: string;
  source?: string;
}

export interface ServiceViewPayload extends BaseEventPayload {
  serviceSlug: string;
  serviceCategory?: string;
}

export interface CtaClickPayload extends BaseEventPayload {
  ctaLabel: string;
  ctaTarget: string;
  ctaLocation: 'hero' | 'header' | 'footer' | 'sidebar' | 'content' | 'modal';
}

export interface WhatsAppClickPayload extends BaseEventPayload {
  prefilledContext?: string;
  serviceTarget?: string;
  clickLocation?: string;
}

export interface QuoteStartPayload extends BaseEventPayload {
  initialService?: string;
  sourceContext?: string;
}

export interface QuoteSubmitAttemptPayload extends BaseEventPayload {
  service: string;
  travelers?: string;
  clientSubmissionId: string;
}

export interface LeadCreatedPayload extends BaseEventPayload {
  reference: string;
  leadId: string;
  service: string;
  channel: 'quote' | 'contact' | 'whatsapp' | 'landing_page';
  currency?: 'XOF' | 'EUR' | 'USD' | string;
  value?: number;
  estimatedValue?: number;
  locale: 'fr' | 'en';
}

export type EventPayloadMap = {
  page_view: PageViewPayload;
  service_view: ServiceViewPayload;
  cta_click: CtaClickPayload;
  whatsapp_click: WhatsAppClickPayload;
  quote_start: QuoteStartPayload;
  quote_step_complete: BaseEventPayload & { step: number; service?: string };
  quote_submit_attempt: QuoteSubmitAttemptPayload;
  lead_created: LeadCreatedPayload;
  lead_qualified: BaseEventPayload & { reference: string; status: string };
  quote_sent: BaseEventPayload & { reference: string; amount?: number };
  booking_confirmed: BaseEventPayload & { reference: string; value: number };
  customer_acquired: BaseEventPayload & { reference: string };
};

/**
 * Génère un identifiant d'événement unique et déterministe pour la déduplication Pixel / CAPI.
 */
export function buildEventId(eventName: string, uniqueContext?: string): string {
  const prefix = eventName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const context = uniqueContext ? `_${uniqueContext}` : '';
  const rand = Math.random().toString(36).substring(2, 10);
  const time = Date.now().toString(36);
  return `evt_slaac_${prefix}${context}_${time}_${rand}`;
}

