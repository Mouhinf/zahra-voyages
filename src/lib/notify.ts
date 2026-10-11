/**
 * Notification email à l'agence (SendGrid) — partagé par /api/quotes et
 * /api/contact.
 *
 * Contrat :
 * - Ne JAMAIS faire échouer une demande enregistrée parce que l'email
 *   n'est pas parti : la fonction renvoie { sent: boolean } au lieu de
 *   lever, et l'appelant consigne le statut dans le document.
 * - Si aucun service email n'est configuré, renvoie { sent: false,
 *   reason: 'not-configured' } sans erreur.
 */

export type NotifyResult = { sent: boolean; reason?: string };

const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  'no-reply@' + (process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') || 'slaac-voyages');

export function emailConfigured(): boolean {
  return !!(process.env.SENDGRID_API_KEY && process.env.NOTIFY_EMAIL);
}

export async function sendAgencyEmail(subject: string, lines: Array<[string, unknown]>): Promise<NotifyResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return { sent: false, reason: 'not-configured' };

  const content = lines.map(([k, v]) => `- ${k}: ${String(v ?? '')}`).join('\n');
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: FROM_EMAIL },
    subject,
    content: [{ type: 'text/plain', value: content }],
  };

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // Timeout : l'envoi d'email ne doit pas retenir la réponse HTTP
      // au-delà de quelques secondes.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`SendGrid HTTP ${res.status} pour "${subject}"`);
      return { sent: false, reason: `http-${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    console.error('SendGrid error:', e);
    return { sent: false, reason: 'network' };
  }
}
