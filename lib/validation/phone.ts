import { LIMITS } from "@/lib/constants/limits";

const PHONE_REGEX = /^[6-9]\d{9}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-LIMITS.phoneDigits);
}

export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return normalized.length === LIMITS.phoneDigits && PHONE_REGEX.test(normalized);
}
