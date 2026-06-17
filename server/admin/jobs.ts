import type { SupabaseClient } from "@supabase/supabase-js";

import { createSignedMediaUrl } from "@/server/admin/media-urls";

export async function listAdminJobs(
  admin: SupabaseClient,
  options: { status?: string; limit?: number },
) {
  let query = admin
    .from("jobs")
    .select(
      "id, job_ref, booking_status, dispatch_status, payment_status, description, address_text, requested_at, created_at, service_category_id, locality_id, customer_profile_id",
    )
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (options.status) {
    query = query.eq("booking_status", options.status);
  }

  const { data: jobs, error } = await query;
  if (error) throw error;
  if (!jobs?.length) return [];

  const categoryIds = [...new Set(jobs.map((j) => j.service_category_id))];
  const localityIds = [...new Set(jobs.map((j) => j.locality_id))];
  const customerIds = [...new Set(jobs.map((j) => j.customer_profile_id))];

  const [{ data: categories }, { data: localities }, { data: customers }] =
    await Promise.all([
      admin.from("service_categories").select("id, name_en").in("id", categoryIds),
      admin.from("localities").select("id, name").in("id", localityIds),
      admin
        .from("customer_profiles")
        .select("id, full_name, phone, alternate_phone")
        .in("id", customerIds),
    ]);

  const categoryMap = new Map(categories?.map((c) => [c.id, c.name_en]) ?? []);
  const localityMap = new Map(localities?.map((l) => [l.id, l.name]) ?? []);
  const customerMap = new Map(customers?.map((c) => [c.id, c]) ?? []);

  return jobs.map((job) => {
    const customer = customerMap.get(job.customer_profile_id);
    return {
      id: job.id,
      job_ref: job.job_ref,
      booking_status: job.booking_status,
      dispatch_status: job.dispatch_status,
      payment_status: job.payment_status,
      description: job.description,
      address_text: job.address_text,
      service_category: categoryMap.get(job.service_category_id) ?? null,
      locality: localityMap.get(job.locality_id) ?? null,
      customer_name: customer?.full_name ?? null,
      customer_phone: customer?.phone ?? null,
      requested_at: job.requested_at,
      created_at: job.created_at,
    };
  });
}

export async function getAdminJobDetail(admin: SupabaseClient, jobId: string) {
  const { data: job, error } = await admin
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error) throw error;
  if (!job) return null;

  const [
    { data: customer },
    { data: category },
    { data: locality },
    { data: media },
  ] = await Promise.all([
    admin
      .from("customer_profiles")
      .select("id, full_name, phone, alternate_phone, default_address_text, landmark")
      .eq("id", job.customer_profile_id)
      .maybeSingle(),
    admin
      .from("service_categories")
      .select("id, name_en, slug")
      .eq("id", job.service_category_id)
      .maybeSingle(),
    admin.from("localities").select("id, name, city").eq("id", job.locality_id).maybeSingle(),
    admin
      .from("job_media")
      .select("id, media_kind, mime_type, storage_path, file_size_bytes, created_at")
      .eq("job_id", jobId)
      .order("created_at"),
  ]);

  const mediaWithUrls = await Promise.all(
    (media ?? []).map(async (item) => ({
      id: item.id,
      media_kind: item.media_kind,
      mime_type: item.mime_type,
      file_size_bytes: item.file_size_bytes,
      created_at: item.created_at,
      url: await createSignedMediaUrl(admin, "job-media", item.storage_path as string),
    })),
  );

  return {
    id: job.id,
    public_id: job.public_id,
    job_ref: job.job_ref,
    booking_status: job.booking_status,
    dispatch_status: job.dispatch_status,
    payment_status: job.payment_status,
    complaint_status: job.complaint_status,
    request_source: job.request_source,
    pricing_type: job.pricing_type,
    description: job.description,
    address_text: job.address_text,
    landmark: job.landmark,
    preferred_date: job.preferred_date,
    preferred_time_slot: job.preferred_time_slot,
    workers_needed: job.workers_needed,
    shift_type: job.shift_type,
    customer_payment_preference: job.customer_payment_preference,
    admin_notes: job.admin_notes,
    requested_at: job.requested_at,
    created_at: job.created_at,
    service_category: category?.name_en ?? null,
    locality: locality?.name ?? null,
    customer: customer
      ? {
          full_name: customer.full_name,
          phone: customer.phone,
          alternate_phone: customer.alternate_phone,
          default_address_text: customer.default_address_text,
          landmark: customer.landmark,
        }
      : null,
    media: mediaWithUrls,
  };
}
