import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { getSessionUser } from "@/server/auth/session";
import type { SessionUser } from "@/server/auth/session";

export async function requireWorker(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user || user.role !== "worker") {
    redirect(ROUTES.worker.login);
  }

  return user;
}

export async function requireWorkerApi(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user || user.role !== "worker") return null;
  return user;
}
