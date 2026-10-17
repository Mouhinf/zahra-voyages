/**
 * Façade de service haut niveau pour l'envoi et la gestion des notifications transactionnelles.
 * Appelé directement par les routes API (/api/quotes, /api/contact, /api/newsletter, /api/admin/leads/retry-email).
 */

import { getEmailConfig } from './config';
import {
  generateContactAgencyEmail,
  generateContactCustomerEmail,
  generateNewsletterWelcomeEmail,
  generateQuoteAgencyEmail,
  generateQuoteCustomerEmail,
  generateQuoteManagerEmail,
} from './templates';
import {
  dispatchOutboxEmail,
  getOutboxForLead,
  queueOutboxEmail,
} from './outbox';
import {
  ContactEmailData,
  DispatchResult,
  LeadKind,
  QuoteEmailData,
  SupportedLanguage,
} from './types';

export interface LeadNotificationResults {
  customer?: DispatchResult;
  agency?: DispatchResult;
  manager?: DispatchResult;
}

/**
 * Traite les notifications pour une nouvelle demande de devis :
 * 1. Accusé de réception client (avec charte luxe et mentions légales obligatoires).
 * 2. Notification complète à l'agence (contact@slaacvoyages.com).
 * 3. Alerte au responsable (mdslaacvoyages@gmail.com).
 */
export async function sendQuoteNotifications(
  quoteId: string,
  data: QuoteEmailData,
): Promise<LeadNotificationResults> {
  const config = getEmailConfig();
  const results: LeadNotificationResults = {};

  try {
    const queuePromises: Array<Promise<{ type: 'customer' | 'agency' | 'manager'; outboxId: string }>> = [];

    // 1. Accusé de réception client (si email valide fourni)
    if (data.email && data.email.includes('@')) {
      const customerEmail = generateQuoteCustomerEmail(data);
      queuePromises.push(
        queueOutboxEmail({
          leadCollection: 'quotes',
          leadId: quoteId,
          recipientType: 'customer',
          options: {
            to: data.email,
            subject: customerEmail.subject,
            html: customerEmail.html,
            text: customerEmail.text,
            replyTo: config.agencyEmail,
          },
        }).then((rec) => ({ type: 'customer', outboxId: rec.id })),
      );
    }

    // 2. Notification Agence
    const agencyEmail = generateQuoteAgencyEmail(data);
    queuePromises.push(
      queueOutboxEmail({
        leadCollection: 'quotes',
        leadId: quoteId,
        recipientType: 'agency',
        options: {
          to: config.agencyEmail,
          subject: agencyEmail.subject,
          html: agencyEmail.html,
          text: agencyEmail.text,
          replyTo: data.email || undefined,
        },
      }).then((rec) => ({ type: 'agency', outboxId: rec.id })),
    );

    // 3. Notification Direction / Responsable
    if (config.managerEmail && config.managerEmail !== config.agencyEmail) {
      const managerEmail = generateQuoteManagerEmail(data);
      queuePromises.push(
        queueOutboxEmail({
          leadCollection: 'quotes',
          leadId: quoteId,
          recipientType: 'manager',
          options: {
            to: config.managerEmail,
            subject: managerEmail.subject,
            html: managerEmail.html,
            text: managerEmail.text,
            replyTo: data.email || undefined,
          },
        }).then((rec) => ({ type: 'manager', outboxId: rec.id })),
      );
    }

    const queued = await Promise.all(queuePromises);

    // Exécution immédiate des envois
    const dispatchPromises = queued.map(async (item) => {
      const res = await dispatchOutboxEmail(item.outboxId);
      results[item.type] = res;
    });

    await Promise.allSettled(dispatchPromises);
  } catch (error) {
    console.error(`Erreur globale lors de sendQuoteNotifications pour quote ${quoteId}:`, error);
  }

  return results;
}

/**
 * Traite les notifications pour un message de contact :
 * 1. Accusé de réception client.
 * 2. Notification agence.
 * 3. Notification responsable.
 */
export async function sendContactNotifications(
  contactId: string,
  data: ContactEmailData,
): Promise<LeadNotificationResults> {
  const config = getEmailConfig();
  const results: LeadNotificationResults = {};

  try {
    const queuePromises: Array<Promise<{ type: 'customer' | 'agency' | 'manager'; outboxId: string }>> = [];

    // 1. Client
    if (data.email && data.email.includes('@')) {
      const customerEmail = generateContactCustomerEmail(data);
      queuePromises.push(
        queueOutboxEmail({
          leadCollection: 'contacts',
          leadId: contactId,
          recipientType: 'customer',
          options: {
            to: data.email,
            subject: customerEmail.subject,
            html: customerEmail.html,
            text: customerEmail.text,
            replyTo: config.agencyEmail,
          },
        }).then((rec) => ({ type: 'customer', outboxId: rec.id })),
      );
    }

    // 2. Agence
    const agencyEmail = generateContactAgencyEmail(data);
    queuePromises.push(
      queueOutboxEmail({
        leadCollection: 'contacts',
        leadId: contactId,
        recipientType: 'agency',
        options: {
          to: config.agencyEmail,
          subject: agencyEmail.subject,
          html: agencyEmail.html,
          text: agencyEmail.text,
          replyTo: data.email,
        },
      }).then((rec) => ({ type: 'agency', outboxId: rec.id })),
    );

    // 3. Responsable
    if (config.managerEmail && config.managerEmail !== config.agencyEmail) {
      queuePromises.push(
        queueOutboxEmail({
          leadCollection: 'contacts',
          leadId: contactId,
          recipientType: 'manager',
          options: {
            to: config.managerEmail,
            subject: `[DIRECTION] Message de contact — ${data.name}`,
            html: agencyEmail.html,
            text: agencyEmail.text,
            replyTo: data.email,
          },
        }).then((rec) => ({ type: 'manager', outboxId: rec.id })),
      );
    }

    const queued = await Promise.all(queuePromises);

    const dispatchPromises = queued.map(async (item) => {
      const res = await dispatchOutboxEmail(item.outboxId);
      results[item.type] = res;
    });

    await Promise.allSettled(dispatchPromises);
  } catch (error) {
    console.error(`Erreur globale lors de sendContactNotifications pour contact ${contactId}:`, error);
  }

  return results;
}

/**
 * Traite les notifications d'inscription à la newsletter :
 * 1. Email de bienvenue à l'abonné.
 * 2. Notification simple à l'agence.
 */
export async function sendNewsletterNotifications(
  email: string,
  lang: SupportedLanguage = 'fr',
): Promise<{ customerSent: boolean; error?: string }> {
  const config = getEmailConfig();

  try {
    const welcome = generateNewsletterWelcomeEmail(email, lang);
    const customerOutbox = await queueOutboxEmail({
      leadCollection: 'newsletter',
      leadId: email,
      recipientType: 'customer',
      options: {
        to: email,
        subject: welcome.subject,
        html: welcome.html,
        text: welcome.text,
      },
    });

    const dispatchRes = await dispatchOutboxEmail(customerOutbox.id);

    // Notification informative agence
    if (config.agencyEmail) {
      const agencyOutbox = await queueOutboxEmail({
        leadCollection: 'newsletter',
        leadId: email,
        recipientType: 'agency',
        options: {
          to: config.agencyEmail,
          subject: `Nouvel abonné Newsletter — ${email}`,
          html: `<p>Un nouvel utilisateur s'est inscrit à la newsletter : <strong>${email}</strong>.</p>`,
          text: `Nouvel abonné newsletter : ${email}`,
        },
      });
      await dispatchOutboxEmail(agencyOutbox.id).catch(() => {});
    }

    return { customerSent: dispatchRes.success, error: dispatchRes.error };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Erreur sendNewsletterNotifications pour ${email}:`, msg);
    return { customerSent: false, error: msg };
  }
}

/**
 * Rejoue manuellement ou par tâche planifiée les notifications d'un lead.
 */
export async function retryLeadNotifications(
  collectionName: LeadKind,
  leadId: string,
): Promise<{ total: number; retried: number; successes: number; results: DispatchResult[] }> {
  const records = await getOutboxForLead(collectionName, leadId);
  const results: DispatchResult[] = [];
  let successes = 0;

  for (const record of records) {
    // Forçage de l'expédition
    const res = await dispatchOutboxEmail(record.id, true);
    results.push(res);
    if (res.success) successes++;
  }

  return {
    total: records.length,
    retried: results.length,
    successes,
    results,
  };
}
