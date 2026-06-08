import type { BookingStatus } from "@/types/enums";

const ALLOWED_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  requested: ["validated", "cancelled"],
  validated: ["dispatching", "cancelled"],
  dispatching: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["completed", "disputed"],
  completed: ["closed", "disputed"],
  disputed: ["closed", "completed"],
  closed: [],
  cancelled: [],
};

export function canTransitionBooking(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertBookingTransition(
  from: BookingStatus,
  to: BookingStatus,
): void {
  if (!canTransitionBooking(from, to)) {
    throw new Error(`Invalid booking transition: ${from} → ${to}`);
  }
}
