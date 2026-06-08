import "server-only";

import { getCurrentUser, isAdminUser } from "./session";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "UNAUTHORIZED" | "FORBIDDEN" = "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Admin authentication required", "UNAUTHORIZED");
  }
  if (!isAdminUser(user)) {
    throw new AuthError("Admin access required", "FORBIDDEN");
  }
  return user;
}
