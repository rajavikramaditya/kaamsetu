import type { PaymentStatus } from "@/types/enums";

const ALLOWED_TRANSITIONS: Record<PaymentStatus, readonly PaymentStatus[]> = {
  not_due: ["due"],
  due: ["payment_link_sent", "waived"],
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
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}
