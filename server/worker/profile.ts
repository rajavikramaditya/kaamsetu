import type { SupabaseClient } from "@supabase/supabase-js";

import {
  generateWorkerCode,
  normalizeIndianPhone,
  pendingPhonePlaceholder,
} from "@/types/worker";
import type { WorkerDocumentRow, WorkerProfileRow } from "@/types/worker";

export async function getAuthUserPhone(
  supabase: SupabaseClient,
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.phone) return null;
  try {
    return normalizeIndianPhone(user.phone);
  } catch {
    return null;
  }
}

export async function getWorkerProfileByAuthId(
  supabase: SupabaseClient,
  authUserId: string,
): Promise<WorkerProfileRow | null> {
  const { data, error } = await supabase
    .from("worker_profiles")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) throw error;
  return data as WorkerProfileRow | null;
}

export async function ensureWorkerProfile(
  supabase: SupabaseClient,
  authUserId: string,
  authPhone?: string | null,
): Promise<WorkerProfileRow> {
  const existing = await getWorkerProfileByAuthId(supabase, authUserId);
  if (existing) return existing;

  const phone = authPhone ?? pendingPhonePlaceholder(authUserId);

  const { data, error } = await supabase
    .from("worker_profiles")
    .insert({
      auth_user_id: authUserId,
      worker_code: generateWorkerCode(),
      full_name: "Pending Worker",
      phone,
      approval_status: "draft",
      is_available: false,
      supported_job_modes: ["fixed_price", "quote_required", "daily_wage"],
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as WorkerProfileRow;
}

export async function getWorkerDocuments(
  supabase: SupabaseClient,
  workerProfileId: string,
): Promise<WorkerDocumentRow[]> {
  const { data, error } = await supabase
    .from("worker_documents")
    .select("*")
    .eq("worker_profile_id", workerProfileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as WorkerDocumentRow[];
}

export async function getWorkerProfileLabels(
  supabase: SupabaseClient,
  profile: Pick<WorkerProfileRow, "primary_category_id" | "locality_id">,
): Promise<{ primary_category_name: string | null; locality_name: string | null }> {
  const [categoryRes, localityRes] = await Promise.all([
    profile.primary_category_id
      ? supabase
          .from("service_categories")
          .select("name_en")
          .eq("id", profile.primary_category_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    profile.locality_id
      ? supabase
          .from("localities")
          .select("name")
          .eq("id", profile.locality_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    primary_category_name: categoryRes.data?.name_en ?? null,
    locality_name: localityRes.data?.name ?? null,
  };
}

export function assertWorkerCanEdit(profile: WorkerProfileRow) {
  if (profile.approval_status === "suspended") {
    throw new Error("ACCOUNT_SUSPENDED");
  }
  if (profile.approval_status === "banned") {
    throw new Error("ACCOUNT_BANNED");
  }
}

export function assertWorkerCanToggleAvailability(profile: WorkerProfileRow) {
  if (profile.approval_status !== "approved") {
    throw new Error("NOT_APPROVED");
  }
}
