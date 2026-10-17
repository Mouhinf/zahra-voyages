/**
 * Types et interfaces pour le système d'email transactionnel de SLAAC Voyages.
 */

export type RecipientType = 'customer' | 'agency' | 'manager';

export type LeadKind = 'quotes' | 'contacts' | 'newsletter';

export type OutboxStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'permanently_failed';

export type SupportedLanguage = 'fr' | 'en';

export interface EmailOptions {
  to: string;
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export interface EmailProviderResult {
  success: boolean;
  messageId?: string;
  provider: 'sendgrid' | 'resend' | 'smtp' | 'mock';
  error?: string;
  rawResponse?: unknown;
}

export interface DispatchResult {
  outboxId: string;
  success: boolean;
  status: OutboxStatus;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  readonly name: 'sendgrid' | 'resend' | 'smtp' | 'mock';
  send(options: EmailOptions): Promise<EmailProviderResult>;
}

export interface EmailOutboxRecord {
  id: string; // Idempotency key: `${leadCollection}_${leadId}_${recipientType}`
  leadCollection: LeadKind;
  leadId: string;
  recipientType: RecipientType;
  to: string;
  from: string;
  replyTo?: string | null;
  subject: string;
  htmlBody: string;
  textBody: string;
  status: OutboxStatus;
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt?: string | null;
  lastAttemptAt?: string | null;
  sentAt?: string | null;
  lastError?: string | null;
  providerUsed?: string;
  providerMessageId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown> | null;
}

export interface RecipientDeliverySummary {
  to: string;
  status: OutboxStatus;
  sentAt?: string | null;
  lastAttemptAt?: string | null;
  attemptCount: number;
  lastError?: string | null;
  provider?: string;
}

export interface LeadEmailStatus {
  customer?: RecipientDeliverySummary;
  agency?: RecipientDeliverySummary;
  manager?: RecipientDeliverySummary;
  updatedAt: string;
}

export interface QuoteEmailData {
  reference: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  service: string;
  destination?: string | null;
  departureDate?: string | null;
  returnDate?: string | null;
  travelers?: number | string | null;
  adults?: number | string | null;
  children?: number | string | null;
  budget?: string | null;
  accommodation?: string | null;
  transport?: string | null;
  notes?: string | null;
  message?: string | null;
  lang?: SupportedLanguage;
}

export interface ContactEmailData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  lang?: SupportedLanguage;
}
