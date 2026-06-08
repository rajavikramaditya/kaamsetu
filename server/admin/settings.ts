import "server-only";

/** Admin settings for categories, localities, invite codes. Implemented in Sprint 2. */
export const adminSettingsService = {
  async getSettings() {
    throw new Error("adminSettingsService.getSettings is not implemented yet");
  },
  async updateCategoryStatus(_categoryId: string, _isActive: boolean) {
    throw new Error(
      "adminSettingsService.updateCategoryStatus is not implemented yet",
    );
  },
  async updateLocalityStatus(_localityId: string, _isActive: boolean) {
    throw new Error(
      "adminSettingsService.updateLocalityStatus is not implemented yet",
    );
  },
  async createInviteCode(_input: Record<string, unknown>) {
    throw new Error("adminSettingsService.createInviteCode is not implemented yet");
  },
};
