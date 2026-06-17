"use client";

import Link from "next/link";

type CustomerShellProps = {
  title: string;
  children: React.ReactNode;
  active?: "request" | "track";
};

export function CustomerShell({ title, children, active }: CustomerShellProps) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-stone-50">
      <header className="border-b border-teal-100 bg-white px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-teal-700">
              KaamSetu
            </p>
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
          </div>
          <nav className="flex shrink-0 flex-col items-end gap-1 text-sm">
            <Link
              href="/request"
              className={
                active === "request"
                  ? "font-medium text-teal-800"
                  : "text-teal-700 underline-offset-4 hover:underline"
              }
            >
              New Request
            </Link>
            <Link
              href="/track"
              className={
                active === "track"
                  ? "font-medium text-teal-800"
                  : "text-teal-700 underline-offset-4 hover:underline"
              }
            >
              My Requests
            </Link>
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
