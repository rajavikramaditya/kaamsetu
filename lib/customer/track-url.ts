export function buildTrackOpenUrl(jobRef: string, phone?: string): string {
  const params = new URLSearchParams();
  params.set("open", jobRef.trim().toUpperCase());
  if (phone) params.set("phone", phone.replace(/\D/g, "").slice(-10));
  return `/track?${params.toString()}`;
}

export function buildTrackFallbackUrl(jobRef?: string, phone?: string): string {
  const params = new URLSearchParams();
  if (jobRef) params.set("job_ref", jobRef.trim().toUpperCase());
  if (phone) params.set("phone", phone.replace(/\D/g, "").slice(-10));
  const qs = params.toString();
  return qs ? `/track?${qs}` : "/track";
}
