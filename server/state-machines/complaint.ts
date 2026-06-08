import type { ComplaintStatus } from "@/types/enums";

const ALLOWED_TRANSITIONS: Record<ComplaintStatus, readonly ComplaintStatus[]> =
  {
    open: ["under_review", "dismissed"],
    under_review: ["resolved", "dismissed", "closed"],
    resolved: ["closed"],
    dismissed: ["closed"],
    closed: [],
  };

export function canTransitionComplaint(
  from: ComplaintStatus,
  to: ComplaintStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
