/** Upload and rate-limit constants (KS-008 / PRD). */

export const LIMITS = {
  jobMedia: {
    maxFiles: 3,
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  },
  workerDocuments: {
    maxFileSizeBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  },
  duplicateRequestWindowMinutes: 30,
  trackingCodeLength: 6,
  inviteCodeMinLength: 4,
  inviteCodeMaxLength: 20,
  phoneLength: 10,
  descriptionMinLength: 20,
  descriptionMaxLength: 500,
  addressMinLength: 10,
  addressMaxLength: 250,
} as const;
