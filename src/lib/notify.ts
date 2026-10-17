/**
 * Rétrocompatibilité pour la notification email d'agence.
 * Délègue désormais vers le moteur unifié de SLAAC Voyages (@/lib/email).
 */

import { getEmailConfig, isEmailConfigured } from './email/config';
import { getEmailProvider } from './email/providers';

export type NotifyResult = { sent: boolean; reason?: string };

export function emailConfigured(): boolean {
  return isEmailConfigured();
}

export async function sendAgencyEmail(subject: string, lines: Array<[string, unknown]>): Promise<NotifyResult> {
  const config = getEmailConfig();
  if (config.provider === 'mock' && !process.env.SENDGRID_API_KEY && !process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
    return { sent: false, reason: 'not-configured' };
  }

  const content = lines.map(([k, v]) => `- ${k}: ${String(v ?? '')}`).join('\n');
  const provider = getEmailProvider();

  try {
    const result = await provider.send({
      to: config.agencyEmail,
      from: config.fromEmail,
      subject,
      text: content,
      html: `<pre style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">${content}</pre>`,
    });

    if (result.success) {
      return { sent: true };
    }
    return { sent: false, reason: result.error || 'delivery-failed' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('sendAgencyEmail fallback error:', msg);
    return { sent: false, reason: 'network' };
  }
}
