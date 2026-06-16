export type WorkerApprovalStatus =
  | "invited"
  | "draft"
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "suspended"
  | "banned";

export type WorkerDocumentType =
  | "aadhaar_image"
  | "pan_image"
  | "profile_photo"
  | "government_id_front"
  | "government_id_back"
  | "other";

export type AvailabilityLabel = "available" | "busy";

export interface WorkerProfileRow {
  id: string;
  auth_user_id: string;
  worker_code: string;
  full_name: string;
  phone: string;
  whatsapp_number: string | null;
  locality_id: string | null;
  address_text: string | null;
  primary_category_id: string | null;
  years_experience: number | null;
  approval_status: WorkerApprovalStatus;
  rejection_reason: string | null;
  is_available: boolean;
  badge_status: string;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerDocumentRow {
  id: string;
  worker_profile_id: string;
  document_type: WorkerDocumentType;
  storage_path: string;
  mime_type: string;
  file_size_bytes: number;
  verification_status: string;
  created_at: string;
}

export function canReceiveJobOffers(status: WorkerApprovalStatus): boolean {
  return status === "approved";
}

export function availabilityLabel(isAvailable: boolean): AvailabilityLabel {
  return isAvailable ? "available" : "busy";
}

export function normalizeIndianPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  throw new Error("INVALID_PHONE");
}

export function toE164IndianPhone(phone10: string): string {
  return `+91${phone10}`;
}

export function generateWorkerCode(): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KS-${suffix}`;
}

/** UI-facing status label for founder/worker screens */
export function approvalStatusLabel(status: WorkerApprovalStatus): string {
  switch (status) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "suspended":
      return "Suspended";
    case "banned":
      return "Banned";
    case "pending":
    case "under_review":
    case "draft":
      return "Pending";
    case "invited":
      return "Invited";
    default:
      return status;
  }
}

export function isProfileComplete(profile: WorkerProfileRow): boolean {
  return Boolean(
    profile.full_name?.trim() &&
      profile.full_name !== "Pending Worker" &&
      profile.primary_category_id &&
      profile.locality_id &&
      profile.whatsapp_number,
  );
}
