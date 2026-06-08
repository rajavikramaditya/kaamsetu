import "server-only";

/** Admin dispatch operations. Implemented in Sprint 5. */
export const adminDispatchService = {
  async createDispatchAttempt(
    _jobId: string,
    _workerId: string,
    _adminUserId: string,
  ) {
    throw new Error(
      "adminDispatchService.createDispatchAttempt is not implemented yet",
    );
  },
  async listDispatchAttempts(_jobId: string) {
    throw new Error(
      "adminDispatchService.listDispatchAttempts is not implemented yet",
    );
  },
};
