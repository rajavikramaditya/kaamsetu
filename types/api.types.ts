/**
 * API request/response shapes aligned with KS-008 and KS-011 route map.
 * Extend per endpoint as features are implemented.
 */

import type { BookingStatus } from "./enums";

// ── Public ──────────────────────────────────────────────────────────────────

export interface PublicBootstrapData {
  categories: Array<{
    id: string;
    slug: string;
    name_en: string;
    name_hi: string | null;
    pricing_type_default: string;
  }>;
  localities: Array<{
    id: string;
    name: string;
    city: string;
    state: string;
  }>;
  beta_status: "open" | "closed" | "invite_only";
}

export interface InviteValidateRequest {
  invite_code: string;
}

export interface InviteValidateData {
  valid: boolean;
}

export interface CreateRequestBody {
  invite_code: string;
  full_name: string;
  phone: string;
  locality_id: string;
  category_id: string;
  description: string;
  address: string;
  landmark?: string;
  preferred_date?: string;
  preferred_time_slot: string;
}

export interface CreateRequestData {
  job_ref: string;
  tracking_code: string;
  public_id: string;
}

export interface TrackJobRequest {
  job_ref: string;
  phone: string;
  tracking_code: string;
}

export interface TrackJobData {
  booking_status: BookingStatus;
  dispatch_status: string;
  payment_status: string;
}

// ── Worker ──────────────────────────────────────────────────────────────────

export interface WorkerLoginRequest {
  phone: string;
  password: string;
}

export interface WorkerMeData {
  id: string;
  worker_code: string;
  full_name: string;
  approval_status: string;
}

// ── Admin ───────────────────────────────────────────────────────────────────

export interface AdminDashboardData {
  new_requests_count: number;
  pending_workers_count: number;
  open_complaints_count: number;
  pending_payments_count: number;
}
