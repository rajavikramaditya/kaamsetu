import type { ComplaintStatus } from "@/types/enums";

const COMPLAINT_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  open: ["under_review", "resolved", "dismissed"],
  under_review: ["resolved", "dismissed"],
  resolved: ["closed"],
  dismissed: ["closed"],
  closed: [],
};

export function canTransitionComplaint(
  from: ComplaintStatus,
  to: ComplaintStatus,
): boolean {
  return COMPLAINT_TRANSITIONS[from].includes(to);
}

export function assertComplaintTransition(
  from: ComplaintStatus,
  to: ComplaintStatus,
): void {
  if (!canTransitionComplaint(from, to)) {
    throw new Error(`Invalid complaint transition: ${from} → ${to}`);
  }
}
