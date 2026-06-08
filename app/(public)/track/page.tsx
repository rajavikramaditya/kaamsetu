import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState";

export default function TrackPage() {
  return (
    <div>
      <PageHeader
        title="Track Your Job"
        description="Enter your job reference, phone, and tracking code."
      />
      <EmptyState
        title="Tracking form coming soon"
        description="Anonymous job tracking — Sprint 4 implementation."
      />
    </div>
  );
}
