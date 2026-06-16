import type { SupabaseClient } from "@supabase/supabase-js";

import type { WorkerDocumentType } from "@/types/worker";

export async function uploadWorkerDocument(
  admin: SupabaseClient,
  workerProfileId: string,
  documentType: WorkerDocumentType,
  file: File,
): Promise<{ storage_path: string; document_id: string }> {
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const storagePath = `${workerProfileId}/${documentType}.${ext}`;

  const { data: existing } = await admin
    .from("worker_documents")
    .select("id, storage_path")
    .eq("worker_profile_id", workerProfileId)
    .eq("document_type", documentType);

  if (existing?.length) {
    const paths = existing.map((row) => row.storage_path);
    await admin.storage.from("worker-documents").remove(paths);
    await admin
      .from("worker_documents")
      .delete()
      .in(
        "id",
        existing.map((row) => row.id),
      );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await admin.storage
    .from("worker-documents")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data, error: insertError } = await admin
    .from("worker_documents")
    .insert({
      worker_profile_id: workerProfileId,
      document_type: documentType,
      storage_path: storagePath,
      mime_type: file.type,
      file_size_bytes: file.size,
      verification_status: "pending",
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  return { storage_path: storagePath, document_id: data.id as string };
}

export function hasRequiredDocuments(
  documents: { document_type: string }[],
): { aadhaar: boolean; pan: boolean } {
  return {
    aadhaar: documents.some((d) => d.document_type === "aadhaar_image"),
    pan: documents.some((d) => d.document_type === "pan_image"),
  };
}
