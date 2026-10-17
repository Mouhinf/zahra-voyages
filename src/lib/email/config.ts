/**
 * Configuration du système d'emails transactionnels SLAAC Voyages.
 * Gestion sécurisée des variables d'environnement et détection du provider actif.
 */

export interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'smtp' | 'mock';
  agencyEmail: string;
  managerEmail: string;
  fromEmail: string;
  fromName: string;
  siteUrl: string;
  logoUrl: string;
  phone: string;
  whatsappUrl: string;
  address: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  sendgridApiKey?: string;
  resendApiKey?: string;
}

export function getEmailConfig(): EmailConfig {
  const env = process.env;

  const siteUrl = (env.NEXT_PUBLIC_BASE_URL || 'https://slaacvoyages.com').replace(/\/$/, '');
  const agencyEmail = env.AGENCY_EMAIL || env.NOTIFY_EMAIL || 'contact@slaacvoyages.com';
  const managerEmail = env.MANAGER_EMAIL || 'mdslaacvoyages@gmail.com';
  const fromName = 'SLAAC Voyages';
  const fromEmail = env.FROM_EMAIL || `contact@${siteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')}`;

  // Détection du provider
  let provider: 'sendgrid' | 'resend' | 'smtp' | 'mock' = 'mock';

  if (env.EMAIL_PROVIDER === 'sendgrid' || env.EMAIL_PROVIDER === 'resend' || env.EMAIL_PROVIDER === 'smtp' || env.EMAIL_PROVIDER === 'mock') {
    provider = env.EMAIL_PROVIDER;
  } else if (env.SENDGRID_API_KEY) {
    provider = 'sendgrid';
  } else if (env.RESEND_API_KEY) {
    provider = 'resend';
  } else if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    provider = 'smtp';
  }

  const smtpPort = env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 465;
  const smtpSecure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : smtpPort === 465;

  return {
    provider,
    agencyEmail,
    managerEmail,
    fromEmail,
    fromName,
    siteUrl,
    logoUrl: `${siteUrl}/slaaclogo.png`,
    phone: '+221 77 312 90 90',
    whatsappUrl: 'https://wa.me/221773129090',
    address: 'Dakar Plateau, rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage',
    smtp: env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS ? {
      host: env.SMTP_HOST,
      port: smtpPort,
      secure: smtpSecure,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    } : undefined,
    sendgridApiKey: env.SENDGRID_API_KEY,
    resendApiKey: env.RESEND_API_KEY,
  };
}

export function isEmailConfigured(): boolean {
  const config = getEmailConfig();
  return config.provider !== 'mock';
}
