import "server-only";

/** Admin job queue and triage. Implemented in Sprint 5. */
export const adminJobsService = {
  async listJobs() {
    throw new Error("adminJobsService.listJobs is not implemented yet");
  },
  async getJob(_jobId: string) {
    throw new Error("adminJobsService.getJob is not implemented yet");
  },
  async validateJob(_jobId: string, _adminUserId: string) {
    throw new Error("adminJobsService.validateJob is not implemented yet");
  },
  async assignJob(_jobId: string, _workerId: string, _adminUserId: string) {
    throw new Error("adminJobsService.assignJob is not implemented yet");
  },
};
