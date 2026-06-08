import { AdminLayout } from "@/components/layout/AdminLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function AdminActivitylogsPage() {
  return (
    <AdminLayout>
      <PageHeader title="Activity Logs" />
      <EmptyState title="Coming soon" description="Sprint 2+ implementation." />
    </AdminLayout>
  );
}
