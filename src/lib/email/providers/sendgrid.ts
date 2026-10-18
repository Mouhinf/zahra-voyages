/**
 * Fournisseur SendGrid HTTP REST API (v3 /v3/mail/send).
 */

import { EmailOptions, EmailProvider, EmailProviderResult } from '../types';
import { getEmailConfig } from '../config';

export class SendGridProvider implements EmailProvider {
  readonly name = 'sendgrid' as const;

  async send(options: EmailOptions): Promise<EmailProviderResult> {
    const config = getEmailConfig();
    const apiKey = config.sendgridApiKey;

    if (!apiKey) {
      return {
        success: false,
        provider: this.name,
        error: 'SENDGRID_API_KEY non configurée',
      };
    }

    const fromAddress = options.from || config.fromEmail;
    const body = {
      personalizations: [{ to: [{ email: options.to }] }],
      from: { email: fromAddress, name: config.fromName },
      reply_to: options.replyTo ? { email: options.replyTo } : undefined,
      subject: options.subject,
      content: [
        { type: 'text/plain', value: options.text },
        { type: 'text/html', value: options.html },
      ],
      headers: options.headers,
    };

    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000), // Timeout 8s max
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        return {
          success: false,
          provider: this.name,
          error: `SendGrid HTTP ${res.status}: ${errorText.slice(0, 200)}`,
        };
      }

      const messageId = res.headers.get('x-message-id') || `sg_${Date.now()}`;
      return {
        success: true,
        provider: this.name,
        messageId,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: this.name,
        error: `Erreur réseau SendGrid: ${msg}`,
      };
    }
  }
}
