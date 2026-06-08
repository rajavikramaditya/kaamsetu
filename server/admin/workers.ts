import "server-only";

/** Admin worker management. Implemented in Sprint 2. */
export const adminWorkersService = {
  async listWorkers() {
    throw new Error("adminWorkersService.listWorkers is not implemented yet");
  },
  async approveWorker(_workerId: string, _adminUserId: string) {
    throw new Error("adminWorkersService.approveWorker is not implemented yet");
  },
  async rejectWorker(_workerId: string, _adminUserId: string, _reason?: string) {
    throw new Error("adminWorkersService.rejectWorker is not implemented yet");
  },
};
