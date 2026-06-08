import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function RequestPage() {
  return (
    <div>
      <PageHeader
        title="Request a Worker"
        description="Invite-gated service request — Sprint 4 implementation."
      />
      <EmptyState
        title="Request form coming soon"
        description="This screen will collect service details, photos, and create a job."
      />
    </div>
  );
}
