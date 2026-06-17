import { createHash, randomInt } from "crypto";

const PEPPER = process.env.TRACK_CODE_PEPPER ?? "kaamsetu-beta-pepper";

export function generateTrackCode(): string {
  return String(randomInt(100000, 999999));
}

export function hashTrackCode(rawCode: string): string {
  return createHash("sha256").update(`${PEPPER}:${rawCode}`).digest("hex");
}

export function verifyTrackCode(rawCode: string, hash: string): boolean {
  return hashTrackCode(rawCode) === hash;
}
