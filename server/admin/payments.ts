import "server-only";

/** Admin payment ledger. Implemented in Sprint 6. */
export const adminPaymentsService = {
  async listPayments() {
    throw new Error("adminPaymentsService.listPayments is not implemented yet");
  },
  async confirmPayment(_paymentId: string, _adminUserId: string) {
    throw new Error("adminPaymentsService.confirmPayment is not implemented yet");
  },
};
