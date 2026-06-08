import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { getSessionUser, type SessionUser } from "@/server/auth/session";

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user || user.role !== "admin") {
    redirect(ROUTES.admin.login);
  }

  return user;
}

export async function requireAdminApi(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
