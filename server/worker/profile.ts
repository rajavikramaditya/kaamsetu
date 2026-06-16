import type { SupabaseClient } from "@supabase/supabase-js";

import { generateWorkerCode, normalizeIndianPhone } from "@/types/worker";
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
  phone: string,
): Promise<WorkerProfileRow> {
  const existing = await getWorkerProfileByAuthId(supabase, authUserId);
  if (existing) return existing;

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
