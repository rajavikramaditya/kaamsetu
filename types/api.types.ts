import type { BookingStatus } from "./enums";

/** Public bootstrap payload */
export type BootstrapData = {
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
  beta_status: "open" | "closed";
};

/** Invite validation */
export type InviteValidateRequest = {
  invite_code: string;
};

export type InviteValidateResponse = {
  valid: boolean;
};

/** Customer request creation */
export type CreateRequestBody = {
  invite_code: string;
  full_name: string;
  phone: string;
  locality_id: string;
  category_id: string;
  description: string;
  address: string;
};

export type CreateRequestResponse = {
  job_ref: string;
  tracking_code: string;
  public_id: string;
};

/** Job tracking */
export type TrackJobRequest = {
  job_ref: string;
  phone: string;
  tracking_code: string;
};

export type TrackJobResponse = {
  status: BookingStatus;
  job_ref: string;
  public_id: string;
};

/** Admin dashboard metrics */
export type AdminDashboardMetrics = {
  new_requests_count: number;
  pending_workers_count: number;
  open_complaints_count: number;
  pending_payments_count: number;
};

/** Worker dashboard summary */
export type WorkerDashboardSummary = {
  approval_status: string;
  pending_offers_count: number;
  active_job_id: string | null;
  earnings_summary: {
    total_completed: number;
    total_earned: number;
  };
};
