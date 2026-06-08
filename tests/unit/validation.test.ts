import { describe, expect, it } from "vitest";
import { isValidPhone, normalizePhone } from "@/lib/validation/phone";
import { isValidAmount, parseAmount } from "@/lib/validation/amounts";
import { canTransitionBooking } from "@/server/state-machines/booking";

describe("phone validation", () => {
  it("normalizes digits", () => {
    expect(normalizePhone("+91 98765 43210")).toBe("9876543210");
  });

  it("accepts valid Indian mobile numbers", () => {
    expect(isValidPhone("9876543210")).toBe(true);
  });

  it("rejects invalid numbers", () => {
    expect(isValidPhone("12345")).toBe(false);
  });
});

describe("amount validation", () => {
  it("parses valid amounts", () => {
    expect(parseAmount("250")).toBe(250);
    expect(isValidAmount(0)).toBe(true);
  });

  it("rejects negative amounts", () => {
    expect(parseAmount("-1")).toBeNull();
  });
});

describe("booking state machine", () => {
  it("allows requested to validated", () => {
    expect(canTransitionBooking("requested", "validated")).toBe(true);
  });

  it("blocks closed to in_progress", () => {
    expect(canTransitionBooking("closed", "in_progress")).toBe(false);
  });
});
