"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
  active?: "dashboard" | "jobs" | "workers";
};

export function AdminShell({ title, children, active }: AdminShellProps) {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col bg-stone-50">
      <header className="border-b border-amber-100 bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-800">
              KaamSetu Admin
            </p>
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
          </div>
          <nav className="flex shrink-0 flex-col items-end gap-1 text-sm">
            <Link
              href="/admin/dashboard"
              className={
                active === "dashboard"
                  ? "font-medium text-amber-900"
                  : "text-amber-800 underline-offset-4 hover:underline"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/admin/jobs"
              className={
                active === "jobs"
                  ? "font-medium text-amber-900"
                  : "text-amber-800 underline-offset-4 hover:underline"
              }
            >
              Requests
            </Link>
            <Link
              href="/admin/workers"
              className={
                active === "workers"
                  ? "font-medium text-amber-900"
                  : "text-amber-800 underline-offset-4 hover:underline"
              }
            >
              Workers
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-left text-stone-500 underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      <footer className="border-t border-stone-100 px-4 py-2 text-center text-[10px] text-stone-400">
        Build {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"}
      </footer>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.replace(/_/g, " ");
  return (
    <span className="inline-block rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium capitalize text-stone-800">
      {normalized}
    </span>
  );
}
