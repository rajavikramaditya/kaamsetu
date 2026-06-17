import type { SupabaseClient } from "@supabase/supabase-js";

export async function createSignedMediaUrl(
  admin: SupabaseClient,
  bucket: "job-media" | "worker-documents",
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
