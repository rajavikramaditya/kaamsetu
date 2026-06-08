import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return (
    <AdminLayout>
      <PageHeader title="Job Detail" description={`Job ${jobId}`} />
      <EmptyState title="Coming soon" description="Sprint 5 implementation." />
    </AdminLayout>
  );
}
