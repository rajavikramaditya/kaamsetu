import "server-only";

/** Worker profile operations. Implemented in Sprint 3. */
export const workerProfileService = {
  async getProfile(_workerUserId: string) {
    throw new Error("workerProfileService.getProfile is not implemented yet");
  },
  async updateProfile(_workerUserId: string, _input: Record<string, unknown>) {
    throw new Error("workerProfileService.updateProfile is not implemented yet");
  },
};
