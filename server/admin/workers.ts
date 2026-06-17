import type { SupabaseClient } from "@supabase/supabase-js";

import { createSignedMediaUrl } from "@/server/admin/media-urls";
import { approvalStatusLabel } from "@/types/worker";
import type { WorkerApprovalStatus } from "@/types/worker";

const APPROVABLE: WorkerApprovalStatus[] = [
  "pending",
  "under_review",
  "draft",
  "rejected",
  "invited",
];

export async function listAdminWorkers(
  admin: SupabaseClient,
  options: { status?: string; limit?: number },
) {
  let query = admin
    .from("worker_profiles")
    .select(
      "id, worker_code, full_name, phone, whatsapp_number, approval_status, is_available, created_at, primary_category_id, locality_id",
    )
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 50);

  if (options.status) {
    query = query.eq("approval_status", options.status);
  }

  const { data: workers, error } = await query;
  if (error) throw error;
  if (!workers?.length) return [];

  const categoryIds = [
    ...new Set(workers.map((w) => w.primary_category_id).filter(Boolean)),
  ] as string[];
  const localityIds = [
    ...new Set(workers.map((w) => w.locality_id).filter(Boolean)),
  ] as string[];

  const [{ data: categories }, { data: localities }] = await Promise.all([
    categoryIds.length
      ? admin.from("service_categories").select("id, name_en").in("id", categoryIds)
      : Promise.resolve({ data: [] }),
    localityIds.length
      ? admin.from("localities").select("id, name").in("id", localityIds)
      : Promise.resolve({ data: [] }),
  ]);

  const categoryMap = new Map(categories?.map((c) => [c.id, c.name_en]) ?? []);
  const localityMap = new Map(localities?.map((l) => [l.id, l.name]) ?? []);

  return workers.map((worker) => ({
    id: worker.id,
    worker_code: worker.worker_code,
    full_name: worker.full_name,
    phone: worker.phone,
    whatsapp_number: worker.whatsapp_number,
    approval_status: worker.approval_status,
    approval_status_label: approvalStatusLabel(worker.approval_status as WorkerApprovalStatus),
    is_available: worker.is_available,
    primary_category: categoryMap.get(worker.primary_category_id) ?? null,
    locality: localityMap.get(worker.locality_id) ?? null,
    created_at: worker.created_at,
  }));
}

export async function getAdminWorkerDetail(admin: SupabaseClient, workerId: string) {
  const { data: worker, error } = await admin
    .from("worker_profiles")
    .select("*")
    .eq("id", workerId)
    .maybeSingle();

  if (error) throw error;
  if (!worker) return null;

  const [{ data: category }, { data: locality }, { data: documents }] =
    await Promise.all([
      admin
        .from("service_categories")
        .select("name_en")
        .eq("id", worker.primary_category_id)
        .maybeSingle(),
      admin.from("localities").select("name").eq("id", worker.locality_id).maybeSingle(),
      admin
        .from("worker_documents")
        .select("id, document_type, mime_type, storage_path, verification_status, created_at")
        .eq("worker_profile_id", workerId)
        .order("created_at", { ascending: false }),
    ]);

  const docsWithUrls = await Promise.all(
    (documents ?? []).map(async (doc) => ({
      id: doc.id,
      document_type: doc.document_type,
      mime_type: doc.mime_type,
      verification_status: doc.verification_status,
      created_at: doc.created_at,
      url: await createSignedMediaUrl(
        admin,
        "worker-documents",
        doc.storage_path as string,
      ),
    })),
  );

  return {
    id: worker.id,
    worker_code: worker.worker_code,
    full_name: worker.full_name,
    phone: worker.phone,
    whatsapp_number: worker.whatsapp_number,
    years_experience: worker.years_experience,
    address_text: worker.address_text,
    approval_status: worker.approval_status,
    approval_status_label: approvalStatusLabel(worker.approval_status as WorkerApprovalStatus),
    rejection_reason: worker.rejection_reason,
    is_available: worker.is_available,
    badge_status: worker.badge_status,
    approved_at: worker.approved_at,
    created_at: worker.created_at,
    primary_category: category?.name_en ?? null,
    locality: locality?.name ?? null,
    documents: docsWithUrls,
  };
}

export async function approveWorker(admin: SupabaseClient, workerId: string) {
  const { data: worker, error: fetchError } = await admin
    .from("worker_profiles")
    .select("id, approval_status")
    .eq("id", workerId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!worker) return null;
  if (!APPROVABLE.includes(worker.approval_status as WorkerApprovalStatus)) {
    throw new Error("INVALID_STATE");
  }

  const { data, error } = await admin
    .from("worker_profiles")
    .update({
      approval_status: "approved",
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", workerId)
    .select("id, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function rejectWorker(
  admin: SupabaseClient,
  workerId: string,
  rejectionReason?: string,
) {
  const { data: worker, error: fetchError } = await admin
    .from("worker_profiles")
    .select("id, approval_status")
    .eq("id", workerId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!worker) return null;

  const { data, error } = await admin
    .from("worker_profiles")
    .update({
      approval_status: "rejected",
      rejection_reason: rejectionReason ?? "Not approved at this time",
      is_available: false,
    })
    .eq("id", workerId)
    .select("id, approval_status, rejection_reason")
    .single();

  if (error) throw error;
  return data;
}

export async function suspendWorker(
  admin: SupabaseClient,
  workerId: string,
  reason?: string,
) {
  const { data: worker, error: fetchError } = await admin
    .from("worker_profiles")
    .select("id, approval_status")
    .eq("id", workerId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!worker) return null;

  const { data, error } = await admin
    .from("worker_profiles")
    .update({
      approval_status: "suspended",
      rejection_reason: reason ?? "Suspended by admin",
      is_available: false,
    })
    .eq("id", workerId)
    .select("id, approval_status, rejection_reason")
    .single();

  if (error) throw error;
  return data;
}
