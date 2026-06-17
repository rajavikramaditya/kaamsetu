import type { SupabaseClient } from "@supabase/supabase-js";

import { verifyTrackCode } from "@/lib/security/hash-track-code";

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

  const { data: customer } = await admin
    .from("customer_profiles")
    .select("phone, full_name")
    .eq("id", job.customer_profile_id)
    .maybeSingle();

  if (!customer || customer.phone !== phone) return null;
  if (!verifyTrackCode(trackCode, job.tracking_code_hash as string)) return null;

  const [{ data: category }, { data: locality }] = await Promise.all([
    admin
      .from("service_categories")
      .select("name_en")
      .eq("id", job.service_category_id)
      .maybeSingle(),
    admin.from("localities").select("name").eq("id", job.locality_id).maybeSingle(),
  ]);

  return {
    public_id: job.public_id as string,
    job_ref: job.job_ref as string,
    booking_status: job.booking_status as string,
    dispatch_status: job.dispatch_status as string,
    payment_status: job.payment_status as string,
    complaint_status: job.complaint_status as string,
    description: job.description as string,
    address_text: job.address_text as string,
    service_category: category?.name_en ?? null,
    locality: locality?.name ?? null,
    requested_at: job.requested_at as string,
    assigned_at: job.assigned_at as string | null,
    completed_at: job.completed_at as string | null,
  };
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

  const { data: customer } = await admin
    .from("customer_profiles")
    .select("phone")
    .eq("id", job.customer_profile_id)
    .maybeSingle();

  if (!customer || customer.phone !== phone) return null;
  if (!verifyTrackCode(trackCode, job.tracking_code_hash as string)) return null;

  return { job_id: job.id as string };
}
