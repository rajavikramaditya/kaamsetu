import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <PageHeader title="Dashboard" />
      <EmptyState title="Coming soon" description="Sprint 2+ implementation." />
    </AdminLayout>
  );
}
