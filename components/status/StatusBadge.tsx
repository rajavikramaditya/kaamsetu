import { Badge } from "@/components/ui/Badge";
import type { BookingStatus } from "@/types/enums";
import { formatBookingStatus } from "@/lib/formatting/status-labels";

type StatusBadgeProps = {
  status: BookingStatus;
};

function getTone(status: BookingStatus): "neutral" | "success" | "warning" | "danger" {
  switch (status) {
    case "completed":
    case "closed":
      return "success";
    case "cancelled":
    case "disputed":
      return "danger";
    case "in_progress":
    case "dispatching":
      return "warning";
    default:
      return "neutral";
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={getTone(status)}>{formatBookingStatus(status)}</Badge>;
}
