import { describe, expect, it } from "vitest";
import { canTransitionOffer } from "@/server/state-machines/dispatch";
import { canTransitionPayment } from "@/server/state-machines/payment";
import { canTransitionComplaint } from "@/server/state-machines/complaint";

describe("dispatch offer transitions", () => {
  it("allows sent to accepted", () => {
    expect(canTransitionOffer("sent", "accepted")).toBe(true);
  });
});

describe("payment transitions", () => {
  it("allows customer marked paid to admin confirmed", () => {
    expect(
      canTransitionPayment("customer_marked_paid", "admin_confirmed_paid"),
    ).toBe(true);
  });
});

describe("complaint transitions", () => {
  it("allows open to resolved", () => {
    expect(canTransitionComplaint("open", "resolved")).toBe(true);
  });
});
