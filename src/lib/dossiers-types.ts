export const DOSSIER_STATUSES = [
  'devis_en_cours',
  'confirme',
  'en_preparation',
  'pret',
  'en_cours',
  'termine',
  'annule',
] as const;

export const DOSSIER_STATUS_FLOW = DOSSIER_STATUSES;

export type DossierStatus = (typeof DOSSIER_STATUSES)[number];

export const DOSSIER_STATUS_LABELS: Record<DossierStatus, string> = {
  devis_en_cours: 'Devis en cours',
  confirme: 'Réservation confirmée',
  en_preparation: 'En préparation logistique',
  pret: 'Prêt pour départ',
  en_cours: 'Voyage en cours',
  termine: 'Prestation terminée',
  annule: 'Annulé',
};

export interface TravelFile {
  id: string;
  reference: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  service: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  passengersCount: number;
  assignedTo?: string;
  status: DossierStatus;
  supplierReferences?: Array<{
    type: 'vol' | 'hotel' | 'transfert' | 'visa' | 'guide';
    nomFournisseur: string;
    reference: string;
    statut: 'en_attente' | 'confirme';
  }>;
  totalAmountFcfa: number;
  paidAmountFcfa: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
