import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default async function WorkerOfferPage({
  params,
}: {
  params: Promise<{ dispatchId: string }>;
}) {
  const { dispatchId } = await params;
  return (
    <WorkerLayout>
      <PageHeader title="Dispatch Offer" description={`Offer ${dispatchId}`} />
      <EmptyState title="Coming soon" description="Sprint 5 implementation." />
    </WorkerLayout>
  );
}
