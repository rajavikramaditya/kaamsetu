import { describe, expect, it } from "vitest";
import { validatePhone, normalizePhone } from "@/lib/validation/phone";
import { validateAmount } from "@/lib/validation/amounts";
import { validateJobMediaFile } from "@/lib/validation/files";

describe("phone validation", () => {
  it("normalizes to 10 digits", () => {
    expect(normalizePhone("+91 98765 43210")).toBe("9876543210");
  });

  it("accepts valid Indian mobile", () => {
    expect(validatePhone("9876543210")).toBeNull();
  });

  it("rejects invalid numbers", () => {
    expect(validatePhone("12345")).not.toBeNull();
  });
});

describe("amount validation", () => {
  it("accepts non-negative amounts", () => {
    expect(validateAmount(100)).toBeNull();
    expect(validateAmount(0)).toBeNull();
  });

  it("rejects negative amounts", () => {
    expect(validateAmount(-1)).not.toBeNull();
  });
});

describe("file validation", () => {
  it("accepts valid job media", () => {
    expect(validateJobMediaFile("image/jpeg", 1024)).toBeNull();
  });

  it("rejects oversized files", () => {
    expect(validateJobMediaFile("image/jpeg", 6 * 1024 * 1024)).not.toBeNull();
  });
});
