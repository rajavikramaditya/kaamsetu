import "server-only";

/** Admin complaint resolution. Implemented in Sprint 6. */
export const adminComplaintsService = {
  async listComplaints() {
    throw new Error("adminComplaintsService.listComplaints is not implemented yet");
  },
  async resolveComplaint(_complaintId: string, _adminUserId: string) {
    throw new Error(
      "adminComplaintsService.resolveComplaint is not implemented yet",
    );
  },
  async dismissComplaint(_complaintId: string, _adminUserId: string) {
    throw new Error(
      "adminComplaintsService.dismissComplaint is not implemented yet",
    );
  },
};
