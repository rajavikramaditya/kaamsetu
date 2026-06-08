import { WorkerLayout } from "@/components/layout/WorkerLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function WorkerDashboardPage() {
  return (
    <WorkerLayout>
      <PageHeader title="Worker Dashboard" />
      <EmptyState title="Coming soon" description="Sprint 3+ implementation." />
    </WorkerLayout>
  );
}
