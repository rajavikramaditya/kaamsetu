/** @module server/admin/workers — Sprint 2 implementation */
export async function listWorkers(): Promise<never> {
  throw new Error("listWorkers not implemented — Sprint 2");
}

export async function approveWorker(_workerId: string): Promise<never> {
  throw new Error("approveWorker not implemented — Sprint 2");
}

export async function rejectWorker(
  _workerId: string,
  _reason: string,
): Promise<never> {
  throw new Error("rejectWorker not implemented — Sprint 2");
}
