/**
 * Registre et factory des fournisseurs d'email.
 */

import { EmailProvider } from '../types';
import { getEmailConfig } from '../config';
import { SendGridProvider } from './sendgrid';
import { ResendProvider } from './resend';
import { SmtpProvider } from './smtp';
import { MockEmailProvider } from './mock';

export * from './sendgrid';
export * from './resend';
export * from './smtp';
export * from './mock';

export function getEmailProvider(overrideProvider?: 'sendgrid' | 'resend' | 'smtp' | 'mock'): EmailProvider {
  const config = getEmailConfig();
  const providerName = overrideProvider || config.provider;

  switch (providerName) {
    case 'sendgrid':
      return new SendGridProvider();
    case 'resend':
      return new ResendProvider();
    case 'smtp':
      return new SmtpProvider();
    case 'mock':
    default:
      return new MockEmailProvider();
  }
}
