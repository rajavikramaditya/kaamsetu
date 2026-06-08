import "server-only";

/** Worker job lifecycle operations. Implemented in Sprint 6. */
export const workerJobsService = {
  async listJobs(_workerUserId: string) {
    throw new Error("workerJobsService.listJobs is not implemented yet");
  },
  async getJob(_workerUserId: string, _jobId: string) {
    throw new Error("workerJobsService.getJob is not implemented yet");
  },
  async updateStatus(
    _workerUserId: string,
    _jobId: string,
    _status: string,
  ) {
    throw new Error("workerJobsService.updateStatus is not implemented yet");
  },
};
