import type { DispatchOfferStatus } from "@/types/enums";

const ALLOWED_OFFER_TRANSITIONS: Record<
  DispatchOfferStatus,
  readonly DispatchOfferStatus[]
> = {
  sent: ["accepted", "declined", "expired", "withdrawn"],
  accepted: [],
  declined: [],
  expired: [],
  withdrawn: [],
  accepted_manual: [],
  declined_manual: [],
};

export function canTransitionDispatchOffer(
  from: DispatchOfferStatus,
  to: DispatchOfferStatus,
): boolean {
  return ALLOWED_OFFER_TRANSITIONS[from]?.includes(to) ?? false;
}
