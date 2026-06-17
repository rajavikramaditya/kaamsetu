import type { SupabaseClient } from "@supabase/supabase-js";

import { verifyTrackCode } from "@/lib/security/hash-track-code";

const PHONE_LOOKUP_MAX = 10;
const PHONE_LOOKUP_DAYS = 90;

export type CustomerJobSummary = {
  public_id: string;
  job_ref: string;
  booking_status: string;
  dispatch_status: string;
  payment_status: string;
  service_category: string | null;
  locality: string | null;
  requested_at: string;
  created_at: string;
};

export type CustomerJobDetail = CustomerJobSummary & {
  complaint_status: string;
  description: string;
  address_text: string;
  assigned_at: string | null;
  completed_at: string | null;
};

async function enrichJobRow(
  admin: SupabaseClient,
  job: {
    public_id: string;
    job_ref: string;
    booking_status: string;
    dispatch_status: string;
    payment_status: string;
    requested_at: string;
    created_at: string;
    service_category_id: string;
    locality_id: string;
    complaint_status?: string;
    description?: string;
    address_text?: string;
    assigned_at?: string | null;
    completed_at?: string | null;
  },
): Promise<CustomerJobSummary | CustomerJobDetail> {
  const [{ data: category }, { data: locality }] = await Promise.all([
    admin
      .from("service_categories")
      .select("name_en")
      .eq("id", job.service_category_id)
      .maybeSingle(),
    admin.from("localities").select("name").eq("id", job.locality_id).maybeSingle(),
  ]);

  const base = {
    public_id: job.public_id,
    job_ref: job.job_ref,
    booking_status: job.booking_status,
    dispatch_status: job.dispatch_status,
    payment_status: job.payment_status,
    service_category: category?.name_en ?? null,
    locality: locality?.name ?? null,
    requested_at: job.requested_at,
    created_at: job.created_at,
  };

  if (job.complaint_status !== undefined) {
    return {
      ...base,
      complaint_status: job.complaint_status,
      description: job.description ?? "",
      address_text: job.address_text ?? "",
      assigned_at: job.assigned_at ?? null,
      completed_at: job.completed_at ?? null,
    };
  }

  return base;
}

async function customerIdsForPhone(admin: SupabaseClient, phone: string) {
  const { data, error } = await admin
    .from("customer_profiles")
    .select("id")
    .eq("phone", phone);

  if (error) throw error;
  return (data ?? []).map((row) => row.id as string);
}

async function jobBelongsToPhone(
  admin: SupabaseClient,
  jobCustomerId: string,
  phone: string,
) {
  const { data, error } = await admin
    .from("customer_profiles")
    .select("phone")
    .eq("id", jobCustomerId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data && data.phone === phone);
}

export async function listJobsByPhone(admin: SupabaseClient, phone: string) {
  const customerIds = await customerIdsForPhone(admin, phone);
  if (customerIds.length === 0) return [];

  const since = new Date(Date.now() - PHONE_LOOKUP_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: jobs, error } = await admin
    .from("jobs")
    .select(
      "public_id, job_ref, booking_status, dispatch_status, payment_status, requested_at, created_at, service_category_id, locality_id",
    )
    .in("customer_profile_id", customerIds)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(PHONE_LOOKUP_MAX);

  if (error) throw error;
  if (!jobs?.length) return [];

  return Promise.all(jobs.map((job) => enrichJobRow(admin, job))) as Promise<
    CustomerJobSummary[]
  >;
}

export async function lookupJobByPhoneAndRef(
  admin: SupabaseClient,
  phone: string,
  jobRef: string,
): Promise<CustomerJobDetail | null> {
  const { data: job, error } = await admin
    .from("jobs")
    .select(
      "public_id, job_ref, booking_status, dispatch_status, payment_status, complaint_status, description, address_text, requested_at, assigned_at, completed_at, created_at, customer_profile_id, service_category_id, locality_id",
    )
    .eq("job_ref", jobRef)
    .maybeSingle();

  if (error) throw error;
  if (!job) return null;

  const ownsJob = await jobBelongsToPhone(admin, job.customer_profile_id as string, phone);
  if (!ownsJob) return null;

  return enrichJobRow(admin, job) as Promise<CustomerJobDetail>;
}

export async function lookupJobForCustomer(
  admin: SupabaseClient,
  jobRef: string,
  phone: string,
  trackCode: string,
) {
  const { data: job, error } = await admin
    .from("jobs")
    .select(
      "id, public_id, job_ref, tracking_code_hash, booking_status, dispatch_status, payment_status, complaint_status, description, address_text, requested_at, assigned_at, completed_at, customer_profile_id, service_category_id, locality_id",
    )
    .eq("job_ref", jobRef)
    .maybeSingle();

  if (error) throw error;
  if (!job) return null;

  const ownsJob = await jobBelongsToPhone(admin, job.customer_profile_id as string, phone);
  if (!ownsJob) return null;
  if (!verifyTrackCode(trackCode, job.tracking_code_hash as string)) return null;

  return lookupJobByPhoneAndRef(admin, phone, jobRef);
}

export async function verifyJobAccess(
  admin: SupabaseClient,
  publicId: string,
  jobRef: string,
  phone: string,
  trackCode: string,
) {
  const { data: job, error } = await admin
    .from("jobs")
    .select("id, job_ref, tracking_code_hash, customer_profile_id")
    .eq("public_id", publicId)
    .eq("job_ref", jobRef)
    .maybeSingle();

  if (error) throw error;
  if (!job) return null;

  const ownsJob = await jobBelongsToPhone(admin, job.customer_profile_id as string, phone);
  if (!ownsJob) return null;
  if (!verifyTrackCode(trackCode, job.tracking_code_hash as string)) return null;

  return { job_id: job.id as string };
}
