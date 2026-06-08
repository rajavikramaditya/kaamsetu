import { LIMITS } from "@/lib/constants/limits";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function isAllowedImageMimeType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function isValidFileSize(bytes: number): boolean {
  return bytes > 0 && bytes <= LIMITS.maxFileSizeBytes;
}

export function validateUploadFile(file: {
  mimeType: string;
  sizeBytes: number;
}): string | null {
  if (!isAllowedImageMimeType(file.mimeType)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (!isValidFileSize(file.sizeBytes)) {
    return `File size must be at most ${LIMITS.maxFileSizeBytes / (1024 * 1024)}MB`;
  }
  return null;
}
