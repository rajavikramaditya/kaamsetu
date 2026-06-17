import type { SupabaseClient } from "@supabase/supabase-js";

import { voiceFileContentType } from "@/lib/validation/customer";

export const MAX_ISSUE_PHOTOS = 5;
const MAX_VOICE_NOTES = 1;

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
  if ((count ?? 0) >= MAX_ISSUE_PHOTOS) {
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

export async function uploadJobVoiceNote(
  admin: SupabaseClient,
  jobId: string,
  file: File,
): Promise<string> {
  const { count, error: countError } = await admin
    .from("job_media")
    .select("*", { count: "exact", head: true })
    .eq("job_id", jobId)
    .eq("media_kind", "issue_voice_note");

  if (countError) throw countError;
  if ((count ?? 0) >= MAX_VOICE_NOTES) {
    throw new Error("VOICE_LIMIT");
  }

  const contentType = voiceFileContentType(file);
  const ext =
    contentType.includes("ogg")
      ? "ogg"
      : contentType.includes("mp4") || contentType.includes("aac")
        ? "m4a"
        : "webm";
  const storagePath = `${jobId}/voice-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("job-media")
    .upload(storagePath, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data, error: insertError } = await admin
    .from("job_media")
    .insert({
      job_id: jobId,
      uploaded_by_role: "customer",
      media_kind: "issue_voice_note",
      storage_path: storagePath,
      mime_type: contentType,
      file_size_bytes: file.size,
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return data.id as string;
}
