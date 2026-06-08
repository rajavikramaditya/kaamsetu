import type { PaymentStatus } from "@/types/enums";

const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  not_due: ["due", "waived"],
  due: ["payment_link_sent", "customer_marked_paid", "waived"],
  payment_link_sent: ["customer_marked_paid", "failed"],
  customer_marked_paid: ["admin_confirmed_paid", "failed"],
  admin_confirmed_paid: [],
  failed: ["due"],
  waived: [],
};

export function canTransitionPayment(
  from: PaymentStatus,
  to: PaymentStatus,
): boolean {
  return PAYMENT_TRANSITIONS[from].includes(to);
}

export function assertPaymentTransition(
  from: PaymentStatus,
  to: PaymentStatus,
): void {
  if (!canTransitionPayment(from, to)) {
    throw new Error(`Invalid payment transition: ${from} → ${to}`);
  }
}
