import "server-only";

import { createHmac, randomBytes } from "crypto";
import { getTrackCodePepper } from "@/server/db/env";

const TRACK_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TRACK_CODE_LENGTH = 6;

export function generateTrackingCode(): string {
  const bytes = randomBytes(TRACK_CODE_LENGTH);
  let code = "";
  for (let i = 0; i < TRACK_CODE_LENGTH; i += 1) {
    code += TRACK_CODE_ALPHABET[bytes[i]! % TRACK_CODE_ALPHABET.length];
  }
  return code;
}

export function hashTrackingCode(trackingCode: string): string {
  return createHmac("sha256", getTrackCodePepper())
    .update(trackingCode.trim().toUpperCase())
    .digest("hex");
}

export function verifyTrackingCode(
  trackingCode: string,
  trackingCodeHash: string,
): boolean {
  const computed = hashTrackingCode(trackingCode);
  return computed === trackingCodeHash;
}
