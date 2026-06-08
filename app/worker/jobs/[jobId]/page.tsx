import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default async function WorkerJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return (
    <WorkerLayout>
      <PageHeader title="Job Detail" description={`Job ${jobId}`} />
      <EmptyState title="Coming soon" description="Sprint 6 implementation." />
    </WorkerLayout>
  );
}
