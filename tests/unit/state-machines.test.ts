import { describe, expect, it } from "vitest";
import { canTransitionBooking } from "@/server/state-machines/booking";
import { canTransitionPayment } from "@/server/state-machines/payment";
import { canTransitionDispatchOffer } from "@/server/state-machines/dispatch";

describe("booking state machine", () => {
  it("allows requested → validated", () => {
    expect(canTransitionBooking("requested", "validated")).toBe(true);
  });

  it("blocks closed → requested", () => {
    expect(canTransitionBooking("closed", "requested")).toBe(false);
  });
});

describe("payment state machine", () => {
  it("allows customer_marked_paid → admin_confirmed_paid", () => {
    expect(
      canTransitionPayment("customer_marked_paid", "admin_confirmed_paid"),
    ).toBe(true);
  });
});

describe("dispatch offer state machine", () => {
  it("allows sent → accepted", () => {
    expect(canTransitionDispatchOffer("sent", "accepted")).toBe(true);
  });

  it("blocks accepted → sent", () => {
    expect(canTransitionDispatchOffer("accepted", "sent")).toBe(false);
  });
});
