import { redirect } from 'next/navigation';

// Ancienne route : remplacée par /admin/demandes/devis.
export default function LegacyQuotesPage() {
  redirect('/admin/demandes/devis');
}
