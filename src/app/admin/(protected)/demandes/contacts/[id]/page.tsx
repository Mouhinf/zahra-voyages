import LeadDetail from '@/components/admin/lead-detail';

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LeadDetail kind="contacts" id={id} />;
}
