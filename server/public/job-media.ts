import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_PHOTOS_PER_JOB = 3;

export async function uploadJobIssuePhoto(
  admin: SupabaseClient,
  jobId: string,
  file: File,
): Promise<string> {
  const { count, error: countError } = await admin
    .from("job_media")
    .select("*", { count: "exact", head: true })
    .eq("job_id", jobId)
    .eq("media_kind", "issue_photo");

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_PHOTOS_PER_JOB) {
    throw new Error("PHOTO_LIMIT");
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const storagePath = `${jobId}/issue-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("job-media")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data, error: insertError } = await admin
    .from("job_media")
    .insert({
      job_id: jobId,
      uploaded_by_role: "customer",
      media_kind: "issue_photo",
      storage_path: storagePath,
      mime_type: file.type,
      file_size_bytes: file.size,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return data.id as string;
}
