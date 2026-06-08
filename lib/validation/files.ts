import { LIMITS } from "@/lib/constants/limits";

export function validateFileSize(
  sizeBytes: number,
  maxBytes: number,
): string | null {
  if (sizeBytes <= 0) return "File is empty.";
  if (sizeBytes > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return `File must be ${maxMb} MB or smaller.`;
  }
  return null;
}

export function validateMimeType(
  mimeType: string,
  allowed: readonly string[],
): string | null {
  if (!allowed.includes(mimeType)) {
    return `File type ${mimeType} is not allowed.`;
  }
  return null;
}

export function validateJobMediaFile(
  mimeType: string,
  sizeBytes: number,
): string | null {
  const mimeError = validateMimeType(mimeType, LIMITS.jobMedia.allowedMimeTypes);
  if (mimeError) return mimeError;
  return validateFileSize(sizeBytes, LIMITS.jobMedia.maxFileSizeBytes);
}
