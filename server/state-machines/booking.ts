import type { BookingStatus } from "@/types/enums";

const BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  requested: ["validated", "cancelled"],
  validated: ["dispatching", "cancelled"],
  dispatching: ["assigned", "cancelled"],
  assigned: ["in_progress"],
  in_progress: ["completed"],
  completed: ["closed", "disputed"],
  disputed: ["closed"],
  closed: [],
  cancelled: [],
};

export function canTransitionBooking(
  from: BookingStatus,
  to: BookingStatus,
): boolean {
  return BOOKING_TRANSITIONS[from].includes(to);
}

export function assertBookingTransition(
  from: BookingStatus,
  to: BookingStatus,
): void {
  if (!canTransitionBooking(from, to)) {
    throw new Error(`Invalid booking transition: ${from} → ${to}`);
  }
}
