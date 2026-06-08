/** Controlled enum constants — single source of truth (KS-006 / KS-012). */

export const BOOKING_STATUSES = [
  "requested",
  "validated",
  "dispatching",
  "assigned",
  "in_progress",
  "completed",
  "disputed",
  "closed",
  "cancelled",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const DISPATCH_STATUSES = [
  "not_started",
  "offer_pending",
  "assigned",
  "failed",
  "stopped",
] as const;
export type DispatchStatus = (typeof DISPATCH_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "not_due",
  "due",
  "payment_link_sent",
  "customer_marked_paid",
  "admin_confirmed_paid",
  "failed",
  "waived",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const COMPLAINT_STATUSES = [
  "open",
  "under_review",
  "resolved",
  "dismissed",
  "closed",
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const JOB_COMPLAINT_STATUSES = [
  "none",
  "open",
  "under_review",
  "resolved",
  "dismissed",
  "closed",
] as const;
export type JobComplaintStatus = (typeof JOB_COMPLAINT_STATUSES)[number];

export const APPROVAL_STATUSES = [
  "invited",
  "draft",
  "under_review",
  "approved",
  "rejected",
  "suspended",
] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const PRICING_TYPES = [
  "fixed_price",
  "quote_required",
  "daily_wage",
] as const;
export type PricingType = (typeof PRICING_TYPES)[number];

export const REQUEST_SOURCES = [
  "pwa",
  "whatsapp_assisted",
  "call_assisted",
  "admin_manual",
] as const;
export type RequestSource = (typeof REQUEST_SOURCES)[number];

export const PAYMENT_METHODS = [
  "cash",
  "upi",
  "razorpay_link",
  "bank_transfer",
  "waived",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const BADGE_STATUSES = [
  "pending",
  "probation",
  "verified",
  "paused",
] as const;
export type BadgeStatus = (typeof BADGE_STATUSES)[number];

export const DISPATCH_OFFER_STATUSES = [
  "sent",
  "accepted",
  "declined",
  "expired",
  "withdrawn",
  "accepted_manual",
  "declined_manual",
] as const;
export type DispatchOfferStatus = (typeof DISPATCH_OFFER_STATUSES)[number];

export const ACTOR_TYPES = ["customer", "worker", "admin", "system"] as const;
export type ActorType = (typeof ACTOR_TYPES)[number];

export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "UPLOAD_ERROR",
  "INVALID_STATE_TRANSITION",
  "INTERNAL_ERROR",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];
