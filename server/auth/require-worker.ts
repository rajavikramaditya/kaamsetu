import "server-only";

import { getCurrentUser, isWorkerUser } from "./session";

export class WorkerAuthError extends Error {
  constructor(
    message: string,
    public readonly code: "UNAUTHORIZED" | "FORBIDDEN" = "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "WorkerAuthError";
  }
}

export async function requireWorker() {
  const user = await getCurrentUser();
  if (!user) {
    throw new WorkerAuthError("Worker authentication required", "UNAUTHORIZED");
  }
  if (!isWorkerUser(user)) {
    throw new WorkerAuthError("Worker access required", "FORBIDDEN");
  }
  return user;
}
