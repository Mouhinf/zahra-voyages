/**
 * Moteur de templates email responsives haut de gamme pour SLAAC Voyages.
 * Charte graphique : Bleu Nuit Profond (#0A192F), Or Satiné Luxe (#D4AF37), Ivoire (#F8F9FA).
 * Génère des versions HTML inline (compatibles Outlook, Gmail, Apple Mail) et Texte brut.
 * Supporte le français (FR) et l'anglais (EN).
 */

import { getEmailConfig } from './config';
import { QuoteEmailData, ContactEmailData, SupportedLanguage } from './types';

// Service labels en français
export const SERVICE_LABELS_FR: Record<string, string> = {
  hebergement: 'Hébergement & Résidences',
  transport: 'Transport & Billetterie',
  'voyages-croisieres': 'Voyages & Croisières',
  excursions: 'Circuits & Excursions',
  'tourisme-affaires': "Tourisme d'Affaires",
  'dakar-2026': 'Séjour Dakar 2026',
  autre: 'Demande sur-mesure',
};

export const SERVICE_LABELS_EN: Record<string, string> = {
  hebergement: 'Accommodation & Luxury Stays',
  transport: 'Transport & Flight Ticketing',
  'voyages-croisieres': 'Travel & Cruises',
  excursions: 'Tours & Excursions',
  'tourisme-affaires': 'Business Travel & Corporate',
  'dakar-2026': 'Dakar 2026 Experience',
  autre: 'Custom Tailored Travel',
};

function getServiceLabel(service: string, lang: SupportedLanguage): string {
  if (lang === 'en') {
    return SERVICE_LABELS_EN[service] || service;
  }
  return SERVICE_LABELS_FR[service] || service;
}

/**
 * Layout HTML principal avec CSS inline compatible avec tous les webmails.
 */
function renderBaseHtmlLayout({
  title,
  preheader,
  contentHtml,
  siteUrl,
  logoUrl,
  phone,
  address,
  lang = 'fr',
}: {
  title: string;
  preheader: string;
  contentHtml: string;
  siteUrl: string;
  logoUrl: string;
  phone: string;
  address: string;
  lang?: SupportedLanguage;
}): string {
  const currentYear = new Date().getFullYear();
  const footerText =
    lang === 'en'
      ? `This email was sent by SLAAC Voyages, specialist in bespoke journeys, flight ticketing, and luxury stays.`
      : `Cet email vous a été adressé par SLAAC Voyages, spécialiste des séjours sur-mesure, billetterie et hébergements d'exception.`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container-table { width: 100% !important; padding: 12px !important; }
      .content-padding { padding: 24px 16px !important; }
      .hide-mobile { display: none !important; }
      .stack-column { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; -webkit-font-smoothing: antialiased;">
  <!-- Préheader invisible -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #F8F9FA;">
    ${escapeHtml(preheader)} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8F9FA; padding: 24px 0;">
    <tr>
      <td align="center">
        <table class="container-table" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(10, 25, 47, 0.08); border: 1px solid #E2E8F0;">
          <!-- En-tête Header Premium Navy & Gold -->
          <tr>
            <td style="background-color: #0A192F; padding: 28px 32px; text-align: center; border-bottom: 3px solid #D4AF37;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="SLAAC Voyages" width="160" style="display: block; max-width: 160px; height: auto; margin: 0 auto; filter: brightness(1.05);" />
              </a>
              <div style="margin-top: 10px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #D4AF37; font-weight: 600;">
                SLAAC Voyages &bull; L'Art du Voyage d'Exception
              </div>
            </td>
          </tr>

          <!-- Contenu Principal -->
          <tr>
            <td class="content-padding" style="padding: 36px 32px; background-color: #FFFFFF;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Pied de page Footer -->
          <tr>
            <td style="background-color: #F1F5F9; padding: 24px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; line-height: 18px; color: #64748B;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #0A192F;">SLAAC Voyages</p>
              <p style="margin: 0 0 6px 0;">${escapeHtml(address)}</p>
              <p style="margin: 0 0 12px 0;">
                Téléphone : <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #0A192F; text-decoration: underline; font-weight: 500;">${phone}</a> &bull;
                Email : <a href="mailto:contact@slaacvoyages.com" style="color: #0A192F; text-decoration: underline;">contact@slaacvoyages.com</a>
              </p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #94A3B8;">${footerText}</p>
              <p style="margin: 0; font-size: 11px; color: #94A3B8;">&copy; ${currentYear} SLAAC Voyages. Tous droits réservés.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// 1. TEMPLATES DEVIS — ACCUSÉ DE RÉCEPTION CLIENT (FR & EN)
// ---------------------------------------------------------------------------

export function generateQuoteCustomerEmail(data: QuoteEmailData): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const lang = data.lang || 'fr';
  const serviceName = getServiceLabel(data.service, lang);

  const isFr = lang === 'fr';

  const subject = isFr
    ? `Accusé de réception de votre demande de devis — [${data.reference}] | SLAAC Voyages`
    : `Acknowledgment of your quote request — [${data.reference}] | SLAAC Voyages`;

  const preheader = isFr
    ? `Votre demande de devis [${data.reference}] a bien été enregistrée par nos conseillers.`
    : `Your quote request [${data.reference}] has been received by our dedicated advisors.`;

  const rows: Array<[string, string]> = [
    [isFr ? 'Numéro de dossier' : 'File Reference', data.reference],
    [isFr ? 'Prestation demandée' : 'Requested Service', serviceName],
  ];

  if (data.destination) rows.push([isFr ? 'Destination' : 'Destination', data.destination]);
  if (data.departureDate) rows.push([isFr ? 'Date de départ souhaitée' : 'Departure Date', data.departureDate]);
  if (data.returnDate) rows.push([isFr ? 'Date de retour souhaitée' : 'Return Date', data.returnDate]);
  if (data.adults || data.children || data.travelers) {
    const details = [
      data.adults ? `${data.adults} ${isFr ? 'adulte(s)' : 'adult(s)'}` : '',
      data.children ? `${data.children} ${isFr ? 'enfant(s)' : 'child(ren)'}` : '',
      !data.adults && !data.children && data.travelers ? `${data.travelers} ${isFr ? 'voyageur(s)' : 'traveler(s)'}` : '',
    ]
      .filter(Boolean)
      .join(', ');
    rows.push([isFr ? 'Voyageurs' : 'Travelers', details]);
  }
  if (data.budget) rows.push([isFr ? 'Budget estimatif' : 'Estimated Budget', data.budget]);
  if (data.accommodation) rows.push([isFr ? 'Hébergement' : 'Accommodation', data.accommodation]);
  if (data.transport) rows.push([isFr ? 'Transport / Billetterie' : 'Transport / Flights', data.transport]);
  if (data.notes) rows.push([isFr ? 'Précisions complémentaires' : 'Additional Notes', data.notes]);

  const tableRowsHtml = rows
    .map(
      ([label, value], idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8F9FA'};">
        <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #475569; width: 40%; border-bottom: 1px solid #E2E8F0;">
          ${escapeHtml(label)}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; color: #1E293B; border-bottom: 1px solid #E2E8F0;">
          ${escapeHtml(value)}
        </td>
      </tr>`,
    )
    .join('');

  const disclaimerText = isFr
    ? `Information importante : Le présent message constitue un accusé de réception confirmant la prise en charge de votre demande par nos conseillers spécialisés SLAAC Voyages. Il ne constitue en aucun cas une confirmation ferme de réservation ni une garantie d'obtention de visa ou de titre de transport. Nos équipes vous contacteront sous 24 à 48 heures ouvrées avec une proposition détaillée.`
    : `Important Notice: This email serves as an acknowledgment of receipt confirming that your request has been taken into account by SLAAC Voyages advisors. It does not constitute a confirmed booking or a guarantee of visa issuance or flight tickets. Our travel consultants will contact you within 24 to 48 business hours with a personalized offer.`;

  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0A192F; line-height: 28px;">
        ${isFr ? `Bonjour ${escapeHtml(data.name)},` : `Dear ${escapeHtml(data.name)},`}
      </h1>
      <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 22px; color: #334155;">
        ${
          isFr
            ? `Nous vous remercions de votre intérêt pour <strong>SLAAC Voyages</strong>. Nous avons bien reçu votre demande de devis personnalisée.`
            : `Thank you for choosing <strong>SLAAC Voyages</strong>. We have successfully received your custom quote request.`
        }
      </p>
      <div style="background-color: #0A192F; color: #FFFFFF; padding: 12px 18px; border-radius: 6px; display: inline-block; font-size: 14px; font-weight: 600; margin-bottom: 18px;">
        ${isFr ? 'Numéro de dossier :' : 'Reference Number:'} <span style="color: #D4AF37;">${escapeHtml(data.reference)}</span>
      </div>
    </div>

    <!-- Récapitulatif -->
    <div style="margin-bottom: 24px;">
      <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0A192F; text-transform: uppercase; letter-spacing: 0.5px;">
        ${isFr ? 'Récapitulatif de votre projet' : 'Summary of your travel project'}
      </h2>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
        ${tableRowsHtml}
      </table>
    </div>

    <!-- Encadré Légal / Disclaimer Obligatoire -->
    <div style="background-color: #FFFBEB; border-left: 4px solid #D4AF37; padding: 14px 16px; border-radius: 4px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 12px; line-height: 18px; color: #78350F;">
        <strong>${isFr ? 'Mention Légale' : 'Legal Disclaimer'} :</strong> ${disclaimerText}
      </p>
    </div>

    <!-- Boutons d'Action Rapide -->
    <div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569;">
        ${isFr ? 'Un conseiller est à votre disposition en direct :' : 'Need immediate assistance? Chat with us:'}
      </p>
      <a href="${config.whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; margin-right: 10px; margin-bottom: 8px;">
        ${isFr ? 'Contacter sur WhatsApp' : 'Chat on WhatsApp'}
      </a>
      <a href="tel:${config.phone.replace(/\s+/g, '')}" style="display: inline-block; background-color: #0A192F; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
        ${isFr ? `Appeler le ${config.phone}` : `Call ${config.phone}`}
      </a>
    </div>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang,
  });

  const textLines = [
    isFr ? `ACCUSÉ DE RÉCEPTION — DEVIS SLAAC VOYAGES` : `QUOTE REQUEST ACKNOWLEDGMENT — SLAAC VOYAGES`,
    `============================================================`,
    `${isFr ? 'Numéro de référence' : 'Reference'}: ${data.reference}`,
    `${isFr ? 'Client' : 'Customer'}: ${data.name}`,
    ``,
    isFr
      ? `Nous avons bien reçu votre demande de devis et vous en remercions.`
      : `We have received your quote request and thank you for your interest.`,
    ``,
    `${isFr ? 'RÉCAPITULATIF' : 'SUMMARY'}:`,
    ...rows.map(([k, v]) => `- ${k}: ${v}`),
    ``,
    `------------------------------------------------------------`,
    `${isFr ? 'MENTION LÉGALE' : 'DISCLAIMER'}:`,
    disclaimerText,
    `------------------------------------------------------------`,
    ``,
    `${isFr ? 'Contact direct' : 'Direct contact'}: ${config.phone} | WhatsApp: ${config.whatsappUrl}`,
    `${config.address}`,
  ];

  return { subject, html, text: textLines.join('\n') };
}

// ---------------------------------------------------------------------------
// 2. TEMPLATES DEVIS — NOTIFICATION AGENCE (contact@slaacvoyages.com)
// ---------------------------------------------------------------------------

export function generateQuoteAgencyEmail(data: QuoteEmailData): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const serviceName = getServiceLabel(data.service, 'fr');
  const subject = `NOUVEAU DEVIS [${data.reference}] — ${data.destination || serviceName} (${data.name})`;
  const preheader = `Nouvelle demande de devis reçue : ${data.name} pour ${data.destination || serviceName}.`;

  const crmLink = `${config.siteUrl}/admin/demandes/devis`;
  const cleanPhone = (data.phone || '').replace(/[^0-9+]/g, '');

  const rows: Array<[string, string]> = [
    ['Référence', data.reference],
    ['Nom complet', data.name],
    ['Email client', data.email || 'Non renseigné'],
    ['Téléphone', data.phone || 'Non renseigné'],
    ['Service', serviceName],
    ['Destination', data.destination || '—'],
    ['Départ', data.departureDate || '—'],
    ['Retour', data.returnDate || '—'],
    [
      'Voyageurs',
      data.adults || data.children
        ? `${data.adults || 0} adultes, ${data.children || 0} enfants`
        : String(data.travelers || '—'),
    ],
    ['Budget', data.budget || '—'],
    ['Hébergement', data.accommodation || '—'],
    ['Transport', data.transport || '—'],
    ['Commentaires', data.notes || '—'],
  ];

  const tableRowsHtml = rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding: 9px 12px; font-size: 13px; font-weight: 600; color: #475569; width: 35%; border-bottom: 1px solid #E2E8F0;">
          ${escapeHtml(k)}
        </td>
        <td style="padding: 9px 12px; font-size: 13px; color: #1E293B; border-bottom: 1px solid #E2E8F0;">
          ${escapeHtml(v)}
        </td>
      </tr>`,
    )
    .join('');

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="background-color: #DC2626; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">
        Action Requise &bull; Nouveau Lead
      </span>
      <h1 style="margin: 12px 0 6px 0; font-size: 20px; font-weight: 700; color: #0A192F;">
        Devis ${escapeHtml(data.reference)} &bull; ${escapeHtml(data.name)}
      </h1>
      <p style="margin: 0; font-size: 14px; color: #64748B;">
        Demande reçue le ${new Date().toLocaleString('fr-FR')} via le site internet.
      </p>
    </div>

    <!-- Actions directes -->
    <div style="margin-bottom: 24px; padding: 14px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px;">
      <div style="font-size: 13px; font-weight: 600; color: #0A192F; margin-bottom: 10px;">Actions directes :</div>
      ${cleanPhone ? `
        <a href="tel:${cleanPhone}" style="display: inline-block; background-color: #0A192F; color: #FFFFFF; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600; margin-right: 8px; margin-bottom: 6px;">
          📞 Appeler (${escapeHtml(data.phone || '')})
        </a>
      ` : ''}
      ${data.email ? `
        <a href="mailto:${data.email}?subject=Votre%20demande%20de%20devis%20SLAAC%20Voyages%20${encodeURIComponent(data.reference)}" style="display: inline-block; background-color: #D4AF37; color: #0A192F; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 700; margin-right: 8px; margin-bottom: 6px;">
          ✉️ Répondre au client
        </a>
      ` : ''}
      <a href="${crmLink}" style="display: inline-block; background-color: #FFFFFF; border: 1px solid #CBD5E1; color: #1E293B; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: 600; margin-bottom: 6px;">
        🔍 Ouvrir dans le CRM
      </a>
    </div>

    <!-- Tableau détaillé -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden;">
      ${tableRowsHtml}
    </table>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang: 'fr',
  });

  const text = [
    `NOUVEAU DEVIS REÇU — SLAAC VOYAGES`,
    `==================================`,
    `Référence: ${data.reference}`,
    `Client: ${data.name}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone || 'Non renseigné'}`,
    `Service: ${serviceName}`,
    `Destination: ${data.destination || '—'}`,
    `Dates: ${data.departureDate || '—'} au ${data.returnDate || '—'}`,
    `Budget: ${data.budget || '—'}`,
    `Notes: ${data.notes || '—'}`,
    ``,
    `Lien CRM: ${crmLink}`,
  ].join('\n');

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 3. TEMPLATES DEVIS — NOTIFICATION RESPONSABLE (mdslaacvoyages@gmail.com)
// ---------------------------------------------------------------------------

export function generateQuoteManagerEmail(data: QuoteEmailData): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const serviceName = getServiceLabel(data.service, 'fr');
  const subject = `[DIRECTION] Devis ${data.reference} — ${data.destination || serviceName} (${data.name})`;
  const preheader = `Alerte direction : Nouveau devis ${data.reference} (${data.name}).`;

  const crmLink = `${config.siteUrl}/admin/demandes/devis`;

  const contentHtml = `
    <div style="margin-bottom: 18px;">
      <span style="background-color: #0A192F; color: #D4AF37; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">
        Alerte Direction SLAAC Voyages
      </span>
      <h1 style="margin: 12px 0 6px 0; font-size: 18px; font-weight: 700; color: #0A192F;">
        Nouveau Devis : ${escapeHtml(data.name)} &bull; ${escapeHtml(data.reference)}
      </h1>
      <p style="margin: 0; font-size: 13px; color: #64748B;">
        Destination : <strong>${escapeHtml(data.destination || serviceName)}</strong> | Budget : <strong>${escapeHtml(data.budget || 'Non spécifié')}</strong>
      </p>
    </div>

    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 6px; font-size: 13px; line-height: 20px; color: #334155; margin-bottom: 20px;">
      <div><strong>Client :</strong> ${escapeHtml(data.name)}</div>
      <div><strong>Téléphone :</strong> <a href="tel:${(data.phone || '').replace(/[^0-9+]/g, '')}" style="color: #0A192F;">${escapeHtml(data.phone || 'Non renseigné')}</a></div>
      <div><strong>Email :</strong> ${data.email ? `<a href="mailto:${data.email}" style="color: #0A192F;">${escapeHtml(data.email)}</a>` : 'Non renseigné'}</div>
      <div><strong>Période :</strong> du ${escapeHtml(data.departureDate || '—')} au ${escapeHtml(data.returnDate || '—')}</div>
      ${data.notes ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #CBD5E1;"><em>"${escapeHtml(data.notes)}"</em></div>` : ''}
    </div>

    <div style="text-align: center;">
      <a href="${crmLink}" style="display: inline-block; background-color: #0A192F; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
        Consulter le dossier dans le CRM
      </a>
    </div>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang: 'fr',
  });

  const text = [
    `[ALERTE DIRECTION] NOUVEAU DEVIS ${data.reference}`,
    `Client: ${data.name}`,
    `Téléphone: ${data.phone || '—'} | Email: ${data.email}`,
    `Destination: ${data.destination || serviceName}`,
    `Budget: ${data.budget || '—'}`,
    `CRM: ${crmLink}`,
  ].join('\n');

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 4. TEMPLATES CONTACT — ACCUSÉ DE RÉCEPTION CLIENT & NOTIFICATION AGENCE
// ---------------------------------------------------------------------------

export function generateContactCustomerEmail(data: ContactEmailData): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const lang = data.lang || 'fr';
  const isFr = lang === 'fr';

  const subject = isFr
    ? `Votre message a bien été reçu — SLAAC Voyages`
    : `We have received your message — SLAAC Voyages`;

  const preheader = isFr
    ? `Merci pour votre message. Nos équipes vous répondront dans les plus brefs délais.`
    : `Thank you for reaching out. Our team will get back to you shortly.`;

  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0A192F;">
        ${isFr ? `Bonjour ${escapeHtml(data.name)},` : `Hello ${escapeHtml(data.name)},`}
      </h1>
      <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 22px; color: #334155;">
        ${
          isFr
            ? `Nous accusons bonne réception de votre message adressé à <strong>SLAAC Voyages</strong>. Un conseiller vous répondra sous 24 à 48 heures ouvrées.`
            : `We acknowledge receipt of your message sent to <strong>SLAAC Voyages</strong>. Our team will get back to you within 24 to 48 business hours.`
        }
      </p>
    </div>

    <!-- Récapitulatif du message envoyé -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748B; margin-bottom: 8px;">
        ${isFr ? 'Rappel de votre message :' : 'Summary of your message:'}
      </div>
      <div style="font-size: 14px; line-height: 20px; color: #1E293B; white-space: pre-wrap;">
        ${escapeHtml(data.message)}
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <a href="${config.whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
        ${isFr ? 'Échanger directement sur WhatsApp' : 'Chat with us on WhatsApp'}
      </a>
    </div>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang,
  });

  const text = [
    isFr ? `MESSAGE REÇU — SLAAC VOYAGES` : `MESSAGE RECEIVED — SLAAC VOYAGES`,
    `=============================`,
    `${isFr ? 'Bonjour' : 'Hello'} ${data.name},`,
    ``,
    isFr
      ? `Nous accusons réception de votre message et vous contacterons très prochainement.`
      : `We acknowledge receipt of your message and will contact you shortly.`,
    ``,
    `${isFr ? 'Votre message' : 'Your message'}:`,
    data.message,
    ``,
    `Contact direct: ${config.phone} | ${config.whatsappUrl}`,
  ].join('\n');

  return { subject, html, text };
}

export function generateContactAgencyEmail(data: ContactEmailData): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const subject = `NOUVEAU MESSAGE CONTACT — ${data.name}${data.subject ? ` (${data.subject})` : ''}`;
  const preheader = `Message reçu de ${data.name} via le formulaire de contact.`;
  const crmLink = `${config.siteUrl}/admin/demandes/contacts`;

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="background-color: #0A192F; color: #D4AF37; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">
        Contact Visiteur &bull; SLAAC Voyages
      </span>
      <h1 style="margin: 12px 0 6px 0; font-size: 20px; font-weight: 700; color: #0A192F;">
        Message de ${escapeHtml(data.name)}
      </h1>
      <p style="margin: 0; font-size: 13px; color: #64748B;">
        Reçu le ${new Date().toLocaleString('fr-FR')} &bull; Réf: ${escapeHtml(data.id)}
      </p>
    </div>

    <!-- Coordonnées -->
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 6px; font-size: 13px; line-height: 20px; color: #334155; margin-bottom: 20px;">
      <div><strong>Nom :</strong> ${escapeHtml(data.name)}</div>
      <div><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #0A192F;">${escapeHtml(data.email)}</a></div>
      <div><strong>Téléphone :</strong> <a href="tel:${(data.phone || '').replace(/[^0-9+]/g, '')}" style="color: #0A192F;">${escapeHtml(data.phone || 'Non renseigné')}</a></div>
      ${data.subject ? `<div><strong>Objet :</strong> ${escapeHtml(data.subject)}</div>` : ''}
    </div>

    <!-- Message -->
    <div style="margin-bottom: 24px;">
      <h3 style="font-size: 14px; font-weight: 600; color: #0A192F; margin: 0 0 8px 0;">Contenu du message :</h3>
      <div style="background-color: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; padding: 16px; font-size: 14px; line-height: 22px; color: #1E293B; white-space: pre-wrap;">
        ${escapeHtml(data.message)}
      </div>
    </div>

    <!-- Actions -->
    <div style="text-align: center;">
      <a href="mailto:${data.email}?subject=Suite%20%C3%A0%20votre%20message%20%E2%80%94%20SLAAC%20Voyages" style="display: inline-block; background-color: #D4AF37; color: #0A192F; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 700; margin-right: 10px;">
        ✉️ Répondre au visiteur
      </a>
      <a href="${crmLink}" style="display: inline-block; background-color: #0A192F; color: #FFFFFF; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600;">
        Voir dans le CRM
      </a>
    </div>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang: 'fr',
  });

  const text = [
    `NOUVEAU MESSAGE DE CONTACT — SLAAC VOYAGES`,
    `==========================================`,
    `De: ${data.name}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone || '—'}`,
    `Objet: ${data.subject || '—'}`,
    ``,
    `Message:`,
    data.message,
    ``,
    `CRM: ${crmLink}`,
  ].join('\n');

  return { subject, html, text };
}

// ---------------------------------------------------------------------------
// 5. TEMPLATES NEWSLETTER — BIENVENUE ABONNÉ
// ---------------------------------------------------------------------------

export function generateNewsletterWelcomeEmail(email: string, lang: SupportedLanguage = 'fr'): { subject: string; html: string; text: string } {
  const config = getEmailConfig();
  const isFr = lang === 'fr';

  const subject = isFr
    ? `Bienvenue dans l'univers d'exception SLAAC Voyages`
    : `Welcome to SLAAC Voyages — Luxury Journeys`;

  const preheader = isFr
    ? `Merci de rejoindre notre cercle privilégié de voyageurs.`
    : `Thank you for joining our exclusive circle of travelers.`;

  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #0A192F;">
        ${isFr ? 'Bienvenue chez SLAAC Voyages' : 'Welcome to SLAAC Voyages'}
      </h1>
      <p style="margin: 0 0 14px 0; font-size: 15px; line-height: 22px; color: #334155;">
        ${
          isFr
            ? `Nous sommes ravis de vous compter parmi nos abonnés. Vous recevrez en avant-première nos offres exclusives de séjours, nos carnets de voyage et nos sélections d'expériences uniques à Dakar et à travers le monde.`
            : `We are delighted to welcome you to our community. You will receive first-hand access to our exclusive travel itineraries, private stay offers, and unique experiences in Dakar and worldwide.`
        }
      </p>
    </div>

    <div style="background-color: #0A192F; color: #FFFFFF; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 10px 0; color: #D4AF37; font-size: 16px;">
        ${isFr ? 'Nos services sur-mesure :' : 'Our bespoke services:'}
      </h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 22px; color: #E2E8F0;">
        <li>${isFr ? 'Billetterie aérienne toutes destinations & tarifs négociés' : 'Worldwide flight ticketing & negotiated fares'}</li>
        <li>${isFr ? 'Hébergements et résidences d’exception' : 'Luxury villas, hotels & bespoke residences'}</li>
        <li>${isFr ? 'Séjours sur-mesure & circuits découverte' : 'Custom travel packages & discovery tours'}</li>
        <li>${isFr ? 'Assistance personnalisée 7j/7' : 'Personal travel assistance 7/7'}</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${config.siteUrl}" style="display: inline-block; background-color: #D4AF37; color: #0A192F; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 700;">
        ${isFr ? 'Découvrir nos offres en ligne' : 'Explore our journeys'}
      </a>
    </div>
  `;

  const html = renderBaseHtmlLayout({
    title: subject,
    preheader,
    contentHtml,
    siteUrl: config.siteUrl,
    logoUrl: config.logoUrl,
    phone: config.phone,
    address: config.address,
    lang,
  });

  const text = [
    isFr ? `BIENVENUE CHEZ SLAAC VOYAGES` : `WELCOME TO SLAAC VOYAGES`,
    `=============================`,
    isFr
      ? `Merci de rejoindre notre cercle d'abonnés !`
      : `Thank you for subscribing to SLAAC Voyages!`,
    ``,
    `${config.siteUrl}`,
    `${config.phone}`,
  ].join('\n');

  return { subject, html, text };
}
