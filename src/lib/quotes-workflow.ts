/**
 * Système de Devis Commerciaux et Workflow Documentaire — SLAAC Voyages.
 *
 * Cycle de vie d'un devis :
 * brouillon -> en_attente_validation -> valide -> envoye -> accepte (ou refuse / expire).
 */

import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { adminApp, type AdminSession } from './firebase-admin';
import { logAuditEvent } from './audit';
import { CONTACT } from './site';

function db(): Firestore {
  return getFirestore(adminApp);
}

const COLLECTION = 'commercial_proposals';

export * from './quotes-types';
import {
  PROPOSAL_STATUSES,
  PROPOSAL_STATUS_LABELS,
  type ProposalStatus,
  type ProposalLineItem,
  type CommercialProposal,
} from './quotes-types';

/**
 * Génère un numéro de proposition commerciale officiel : DV-PROP-YYYYMMDD-XXXX.
 */
export function generateProposalNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DV-PROP-${y}${m}${d}-${rand}`;
}

export const generateProposalReference = generateProposalNumber;

/**
 * Calcule avec exactitude les sous-totaux, taxes et net à payer en FCFA.
 */
export function calculateProposalTotals(
  items: Array<{ description: string; quantity: number; unitPriceFcfa: number }>,
  taxRatePct = 0,
  discountFcfa = 0
): {
  items: ProposalLineItem[];
  subtotalFcfa: number;
  taxAmountFcfa: number;
  discountFcfa: number;
  totalTtcFcfa: number;
  totalHT: number;
  totalTaxes: number;
  discountAmount: number;
  totalTTC: number;
} {
  const calculatedItems: ProposalLineItem[] = items.map((it) => {
    const qty = Math.max(1, it.quantity);
    const unit = Math.max(0, it.unitPriceFcfa);
    return {
      description: it.description,
      quantity: qty,
      unitPriceFcfa: unit,
      totalFcfa: Math.round(qty * unit),
    };
  });

  const subtotal = calculatedItems.reduce((acc, it) => acc + it.totalFcfa, 0);
  const discount = Math.min(subtotal, Math.max(0, discountFcfa));
  const taxable = subtotal - discount;
  const taxAmount = Math.round((taxable * Math.max(0, taxRatePct)) / 100);
  const totalTtc = taxable + taxAmount;

  return {
    items: calculatedItems,
    subtotalFcfa: subtotal,
    taxAmountFcfa: taxAmount,
    discountFcfa: discount,
    totalTtcFcfa: totalTtc,
    totalHT: subtotal,
    totalTaxes: taxAmount,
    discountAmount: discount,
    totalTTC: totalTtc,
  };
}

export async function listProposals(limit = 50, statusFilter?: ProposalStatus): Promise<CommercialProposal[]> {
  try {
    let query = db().collection(COLLECTION).orderBy('createdAt', 'desc');
    if (statusFilter) {
      query = query.where('status', '==', statusFilter);
    }
    const snapshot = await query.limit(Math.min(limit, 200)).get();
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CommercialProposal, 'id'>),
    }));
  } catch (err) {
    console.error('[QuotesWorkflow] Erreur listProposals:', err);
    return [];
  }
}

export async function createProposal(
  data: {
    leadId?: string;
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    service: string;
    destination?: string;
    items: Array<{ description: string; quantity: number; unitPriceFcfa: number }>;
    taxRatePct?: number;
    discountFcfa?: number;
    validDays?: number;
    termsAndConditions?: string;
  },
  actor: AdminSession
): Promise<{ ok: boolean; proposal?: CommercialProposal; error?: string }> {
  try {
    const totals = calculateProposalTotals(data.items, data.taxRatePct || 0, data.discountFcfa || 0);
    const now = new Date();
    const validUntilDate = new Date();
    validUntilDate.setDate(now.getDate() + (data.validDays || 15));

    const proposalNumber = generateProposalNumber();
    const newDocRef = db().collection(COLLECTION).doc();

    const proposal: CommercialProposal = {
      id: newDocRef.id,
      proposalNumber,
      leadId: data.leadId,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      service: data.service,
      destination: data.destination,
      items: totals.items,
      subtotalFcfa: totals.subtotalFcfa,
      taxRatePct: data.taxRatePct || 0,
      taxAmountFcfa: totals.taxAmountFcfa,
      discountFcfa: totals.discountFcfa,
      totalTtcFcfa: totals.totalTtcFcfa,
      currency: 'XOF',
      validUntil: validUntilDate.toISOString().slice(0, 10),
      status: 'brouillon',
      termsAndConditions: data.termsAndConditions || 'Devis valable 15 jours sous réserve de disponibilité des tarifs aériens et hôteliers au moment de la confirmation.',
      createdBy: actor.email,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await newDocRef.set(proposal);

    await logAuditEvent({
      actorId: actor.uid,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: 'QUOTE_CREATED',
      resource: 'quotes',
      resourceId: newDocRef.id,
      details: { proposalNumber, totalTtcFcfa: proposal.totalTtcFcfa, customerName: data.customerName },
    });

    return { ok: true, proposal };
  } catch (err: unknown) {
    console.error('[QuotesWorkflow] Erreur createProposal:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur interne' };
  }
}

/**
 * Génère le modèle HTML imprimable / exportable en PDF avec charte officielle SLAAC Voyages.
 */
export function generateProposalHtml(proposal: CommercialProposal): string {
  const formattedTotal = proposal.totalTtcFcfa.toLocaleString('fr-FR') + ' FCFA';
  const formattedSubtotal = proposal.subtotalFcfa.toLocaleString('fr-FR') + ' FCFA';
  const formattedTax = proposal.taxAmountFcfa.toLocaleString('fr-FR') + ' FCFA';

  const itemsRows = proposal.items
    .map(
      (it, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-size: 13px; color: #1e293b;">${idx + 1}. ${it.description}</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: center; color: #475569;">${it.quantity}</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; color: #475569;">${it.unitPriceFcfa.toLocaleString('fr-FR')} FCFA</td>
      <td style="padding: 10px 12px; font-size: 13px; text-align: right; font-weight: bold; color: #0f172a;">${it.totalFcfa.toLocaleString('fr-FR')} FCFA</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Devis SLAAC Voyages — ${proposal.proposalNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 30px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #b89047; padding-bottom: 15px; margin-bottom: 25px; }
    .company h1 { font-size: 22px; color: #0f172a; margin: 0 0 5px 0; }
    .company p { font-size: 11px; color: #64748b; margin: 2px 0; }
    .quote-badge { text-align: right; }
    .quote-badge h2 { font-size: 24px; color: #b89047; margin: 0 0 5px 0; }
    .quote-badge p { font-size: 12px; color: #475569; margin: 2px 0; }
    .client-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th { background: #0f172a; color: white; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    .totals { width: 300px; margin-left: auto; font-size: 13px; }
    .totals table { margin-bottom: 0; }
    .totals td { padding: 6px 10px; }
    .grand-total { background: #fefce8; border-top: 2px solid #b89047; font-size: 15px; font-weight: bold; color: #0f172a; }
    .terms { font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      <h1>SLAAC VOYAGES</h1>
      <p>Licence Touristique AAV • NINEA / RCCM SN-DKR</p>
      <p>Rue Mouhamed 5, Immeuble Djolof Chicken, 3e étage, Dakar Plateau</p>
      <p>Tél : ${CONTACT.phone} | Email : ${CONTACT.email}</p>
    </div>
    <div class="quote-badge">
      <h2>DEVIS OFFICIEL</h2>
      <p><strong>N° :</strong> ${proposal.proposalNumber}</p>
      <p><strong>Date :</strong> ${proposal.createdAt.slice(0, 10)}</p>
      <p><strong>Validité jusqu'au :</strong> ${proposal.validUntil}</p>
    </div>
  </div>

  <div class="client-box">
    <strong>DESTINATAIRE :</strong><br>
    <strong>${proposal.customerName}</strong><br>
    ${proposal.customerEmail ? `Email : ${proposal.customerEmail}<br>` : ''}
    ${proposal.customerPhone ? `Téléphone : ${proposal.customerPhone}<br>` : ''}
    Service demandé : <strong>${proposal.service}</strong>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 55%;">Désignation des Prestations</th>
        <th style="width: 10%; text-align: center;">Qté</th>
        <th style="width: 15%; text-align: right;">Prix Unitaire</th>
        <th style="width: 20%; text-align: right;">Total Net</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Sous-total HT :</td><td style="text-align: right;">${formattedSubtotal}</td></tr>
      ${proposal.discountFcfa > 0 ? `<tr><td>Remise commerciale :</td><td style="text-align: right; color: #dc2626;">-${proposal.discountFcfa.toLocaleString('fr-FR')} FCFA</td></tr>` : ''}
      ${proposal.taxRatePct > 0 ? `<tr><td>TVA (${proposal.taxRatePct}%) :</td><td style="text-align: right;">${formattedTax}</td></tr>` : ''}
      <tr class="grand-total"><td>NET À PAYER :</td><td style="text-align: right; color: #b89047;">${formattedTotal}</td></tr>
    </table>
  </div>

  <div class="terms">
    <strong>Conditions Générales & Modalités :</strong><br>
    ${proposal.termsAndConditions}
  </div>
</body>
</html>`;
}
