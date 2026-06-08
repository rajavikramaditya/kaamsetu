import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function WorkerProfilePage() {
  return (
    <WorkerLayout>
      <PageHeader title="Worker Profile" />
      <EmptyState title="Coming soon" description="Sprint 3+ implementation." />
    </WorkerLayout>
  );
}
