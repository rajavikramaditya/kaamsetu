import type { SupabaseClient } from "@supabase/supabase-js";

import type { z } from "zod";

import { generateTrackCode, hashTrackCode } from "@/lib/security/hash-track-code";
import type { createRequestSchema } from "@/lib/validation/customer";
import { incrementInviteUsage, validateInviteCode } from "@/server/public/invite";

type CreateRequestInput = z.infer<typeof createRequestSchema>;

export async function createCustomerRequest(
  admin: SupabaseClient,
  input: CreateRequestInput,
) {
  const inviteResult = await validateInviteCode(admin, input.invite_code);
  if (!inviteResult.valid) {
    throw new Error(`INVITE_INVALID:${inviteResult.reason}`);
  }
  const invite = inviteResult.invite;

  const { data: category, error: categoryError } = await admin
    .from("service_categories")
    .select("id, pricing_type_default, requires_shift_fields, is_active")
    .eq("id", input.service_category_id)
    .maybeSingle();

  if (categoryError) throw categoryError;
  if (!category?.is_active) throw new Error("CATEGORY_INACTIVE");

  const { data: locality, error: localityError } = await admin
    .from("localities")
    .select("id, is_active, is_serviceable")
    .eq("id", input.locality_id)
    .maybeSingle();

  if (localityError) throw localityError;
  if (!locality?.is_active || !locality.is_serviceable) {
    throw new Error("LOCALITY_NOT_SERVICEABLE");
  }

  if (category.requires_shift_fields) {
    if (!input.workers_needed || !input.shift_type) {
      throw new Error("SHIFT_FIELDS_REQUIRED");
    }
  }

  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: existingCustomerEarly } = await admin
    .from("customer_profiles")
    .select("id")
    .eq("phone", input.phone)
    .maybeSingle();

  if (existingCustomerEarly) {
    const { data: dup } = await admin
      .from("jobs")
      .select("id")
      .eq("customer_profile_id", existingCustomerEarly.id)
      .eq("service_category_id", input.service_category_id)
      .eq("address_text", input.address_text)
      .gte("created_at", since)
      .limit(1);

    if (dup?.length) throw new Error("DUPLICATE_REQUEST");
  }

  let customerId: string;
  const { data: existingCustomer } = await admin
    .from("customer_profiles")
    .select("id")
    .eq("phone", input.phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
    const { error: updateCustomerError } = await admin
      .from("customer_profiles")
      .update({
        full_name: input.full_name,
        alternate_phone: input.alternate_phone ?? null,
        locality_id: input.locality_id,
        default_address_text: input.address_text,
        landmark: input.landmark ?? null,
        invite_code_id: invite.id,
      })
      .eq("id", customerId);

    if (updateCustomerError) throw updateCustomerError;
  } else {
    const { data: newCustomer, error: insertCustomerError } = await admin
      .from("customer_profiles")
      .insert({
        full_name: input.full_name,
        phone: input.phone,
        alternate_phone: input.alternate_phone ?? null,
        locality_id: input.locality_id,
        default_address_text: input.address_text,
        landmark: input.landmark ?? null,
        invite_code_id: invite.id,
        language_code: "hi",
      })
      .select("id")
      .single();

    if (insertCustomerError) throw insertCustomerError;
    customerId = newCustomer.id as string;
  }

  const jobRef = await generateJobRef(admin);
  const publicId = crypto.randomUUID();
  const trackCode = generateTrackCode();
  const trackingCodeHash = hashTrackCode(trackCode);

  const { data: job, error: jobError } = await admin
    .from("jobs")
    .insert({
      public_id: publicId,
      job_ref: jobRef,
      tracking_code_hash: trackingCodeHash,
      customer_profile_id: customerId,
      invite_code_id: invite.id,
      service_category_id: input.service_category_id,
      locality_id: input.locality_id,
      request_source: "pwa",
      pricing_type: category.pricing_type_default,
      description: input.description,
      address_text: input.address_text,
      landmark: input.landmark ?? null,
      preferred_date: input.preferred_date ?? null,
      preferred_time_slot: input.preferred_time_slot,
      workers_needed: input.workers_needed ?? null,
      shift_type: input.shift_type ?? null,
      customer_payment_preference: input.payment_preference,
      booking_status: "requested",
      dispatch_status: "not_started",
      payment_status: "not_due",
      complaint_status: "none",
    })
    .select("id, job_ref, booking_status")
    .single();

  if (jobError) throw jobError;

  await incrementInviteUsage(admin, invite.id, invite.used_count);

  return {
    job_id: job.id as string,
    public_id: publicId,
    job_ref: job.job_ref as string,
    track_code: trackCode,
    booking_status: job.booking_status as string,
  };
}

async function generateJobRef(admin: SupabaseClient): Promise<string> {
  const { count, error } = await admin
    .from("jobs")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  const next = (count ?? 0) + 1;
  return `KS-${String(next).padStart(6, "0")}`;
}
