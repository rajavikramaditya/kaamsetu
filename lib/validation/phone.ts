import { LIMITS } from "@/lib/constants/limits";

const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-LIMITS.phoneLength);
}

export function isValidIndianMobile(phone: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizePhone(phone));
}

export function validatePhone(phone: string): string | null {
  const normalized = normalizePhone(phone);
  if (!isValidIndianMobile(normalized)) {
    return "Enter a valid 10-digit Indian mobile number.";
  }
  return null;
}
