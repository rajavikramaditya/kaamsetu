import { z } from "zod";

export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 10 || (v.length === 12 && v.startsWith("91")), {
    message: "Phone must be a valid 10-digit Indian mobile number",
  })
  .transform((v) => (v.length === 12 ? v.slice(2) : v));

export const workerProfileUpdateSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  whatsapp_number: phoneSchema,
  primary_category_id: z.string().uuid(),
  locality_id: z.string().uuid(),
  years_experience: z.number().int().min(0).max(40),
  submit_for_review: z.boolean().optional().default(false),
});

export const workerAvailabilitySchema = z.object({
  is_available: z.boolean(),
});

export const workerDocumentTypeSchema = z.enum(["aadhaar_image", "pan_image"]);

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateDocumentFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("INVALID_MIME");
  }
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    throw new Error("INVALID_SIZE");
  }
}
