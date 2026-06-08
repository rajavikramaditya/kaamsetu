import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function AdminComplaintsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Complaints" />
      <EmptyState title="Coming soon" description="Sprint 2+ implementation." />
    </AdminLayout>
  );
}
