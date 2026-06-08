import { Badge } from "@/components/ui/Badge";
import type { BookingStatus } from "@/types/enums";
import { formatBookingStatus } from "@/lib/formatting/status-labels";

const STATUS_VARIANT: Record<
  BookingStatus,
  "default" | "success" | "warning" | "danger" | "info"
> = {
  requested: "info",
  validated: "info",
  dispatching: "warning",
  assigned: "warning",
  in_progress: "warning",
  completed: "success",
  disputed: "danger",
  closed: "default",
  cancelled: "danger",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "default"}>
      {formatBookingStatus(status)}
    </Badge>
  );
}
