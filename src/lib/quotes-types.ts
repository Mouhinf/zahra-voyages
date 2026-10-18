export const PROPOSAL_STATUSES = [
  'brouillon',
  'en_attente_validation',
  'valide',
  'envoye',
  'accepte',
  'refuse',
  'expire',
] as const;

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  brouillon: 'Brouillon',
  en_attente_validation: 'En attente de validation',
  valide: 'Validé en interne',
  envoye: 'Envoyé au client',
  accepte: 'Accepté / Signé',
  refuse: 'Refusé',
  expire: 'Expiré',
};

export interface ProposalLineItem {
  description: string;
  quantity: number;
  unitPriceFcfa: number;
  totalFcfa: number;
}

export interface CommercialProposal {
  id: string;
  proposalNumber: string;
  leadId?: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  service: string;
  destination?: string;
  items: ProposalLineItem[];
  subtotalFcfa: number;
  taxRatePct: number;
  taxAmountFcfa: number;
  discountFcfa: number;
  totalTtcFcfa: number;
  currency: 'XOF' | 'EUR' | 'USD';
  validUntil: string;
  status: ProposalStatus;
  termsAndConditions?: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}
