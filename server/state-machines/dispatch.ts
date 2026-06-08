const OFFER_TRANSITIONS: Record<string, string[]> = {
  sent: ["accepted", "declined", "expired", "withdrawn"],
  accepted: [],
  declined: [],
  expired: [],
  withdrawn: [],
  accepted_manual: [],
  declined_manual: [],
};

export function canTransitionOffer(from: string, to: string): boolean {
  return (OFFER_TRANSITIONS[from] ?? []).includes(to);
}

export function assertOfferTransition(from: string, to: string): void {
  if (!canTransitionOffer(from, to)) {
    throw new Error(`Invalid offer transition: ${from} → ${to}`);
  }
}
