/**
 * Fournisseur Resend HTTP REST API (https://api.resend.com/emails).
 */

import { EmailOptions, EmailProvider, EmailProviderResult } from '../types';
import { getEmailConfig } from '../config';

export class ResendProvider implements EmailProvider {
  readonly name = 'resend' as const;

  async send(options: EmailOptions): Promise<EmailProviderResult> {
    const config = getEmailConfig();
    const apiKey = config.resendApiKey;

    if (!apiKey) {
      return {
        success: false,
        provider: this.name,
        error: 'RESEND_API_KEY non configurée',
      };
    }

    const fromAddress = options.from || `${config.fromName} <${config.fromEmail}>`;
    const body = {
      from: fromAddress,
      to: [options.to],
      reply_to: options.replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
      headers: options.headers,
    };

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });

      const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };

      if (!res.ok) {
        return {
          success: false,
          provider: this.name,
          error: `Resend HTTP ${res.status}: ${data.message || 'Unknown error'}`,
        };
      }

      return {
        success: true,
        provider: this.name,
        messageId: data.id || `resend_${Date.now()}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        provider: this.name,
        error: `Erreur réseau Resend: ${msg}`,
      };
    }
  }
}
