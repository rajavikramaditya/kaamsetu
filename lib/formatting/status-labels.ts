import type {
  ApprovalStatus,
  BookingStatus,
  DispatchStatus,
  PaymentStatus,
} from "@/types/enums";

const BOOKING_LABELS: Record<BookingStatus, string> = {
  requested: "Requested",
  validated: "Validated",
  dispatching: "Dispatching",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  disputed: "Disputed",
  closed: "Closed",
  cancelled: "Cancelled",
};

const DISPATCH_LABELS: Record<DispatchStatus, string> = {
  not_started: "Not Started",
  offer_pending: "Offer Pending",
  assigned: "Assigned",
  failed: "Failed",
  stopped: "Stopped",
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  not_due: "Not Due",
  due: "Due",
  payment_link_sent: "Payment Link Sent",
  customer_marked_paid: "Customer Marked Paid",
  admin_confirmed_paid: "Confirmed Paid",
  failed: "Failed",
  waived: "Waived",
};

const APPROVAL_LABELS: Record<ApprovalStatus, string> = {
  invited: "Invited",
  draft: "Draft",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

export function formatBookingStatus(status: BookingStatus): string {
  return BOOKING_LABELS[status] ?? status;
}

export function formatDispatchStatus(status: DispatchStatus): string {
  return DISPATCH_LABELS[status] ?? status;
}

export function formatPaymentStatus(status: PaymentStatus): string {
  return PAYMENT_LABELS[status] ?? status;
}

export function formatApprovalStatus(status: ApprovalStatus): string {
  return APPROVAL_LABELS[status] ?? status;
}
