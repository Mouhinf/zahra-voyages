import { redirect } from 'next/navigation';

// Vue d'ensemble CRM à venir (lot 3) : en attendant, ouvre la liste des devis.
export default function DemandesPage() {
  redirect('/admin/demandes/devis');
}
