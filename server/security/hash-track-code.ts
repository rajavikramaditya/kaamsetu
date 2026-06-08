import { createHmac, timingSafeEqual } from "node:crypto";

function getPepper(): string {
  const pepper = process.env.TRACK_CODE_PEPPER;
  if (!pepper) {
    throw new Error("TRACK_CODE_PEPPER is not configured");
  }
  return pepper;
}

export function hashTrackingCode(rawCode: string): string {
  return createHmac("sha256", getPepper()).update(rawCode).digest("hex");
}

export function verifyTrackingCode(
  rawCode: string,
  storedHash: string,
): boolean {
  const computed = hashTrackingCode(rawCode);
  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(storedHash, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function generateTrackingCode(length = 6): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
