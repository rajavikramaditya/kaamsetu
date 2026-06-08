import "server-only";

/** Worker dispatch offer operations. Implemented in Sprint 5. */
export const workerOffersService = {
  async listOffers(_workerUserId: string) {
    throw new Error("workerOffersService.listOffers is not implemented yet");
  },
  async acceptOffer(_workerUserId: string, _dispatchId: string) {
    throw new Error("workerOffersService.acceptOffer is not implemented yet");
  },
  async declineOffer(_workerUserId: string, _dispatchId: string) {
    throw new Error("workerOffersService.declineOffer is not implemented yet");
  },
};
