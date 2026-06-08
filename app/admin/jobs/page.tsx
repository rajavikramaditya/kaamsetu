import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function AdminJobsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Jobs" description="Job queue and triage." />
      <EmptyState title="Coming soon" description="Sprint 5 implementation." />
    </AdminLayout>
  );
}
