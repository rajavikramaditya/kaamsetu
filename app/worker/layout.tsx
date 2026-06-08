import type { ReactNode } from "react";

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 text-sm font-medium text-emerald-800">
          Worker Portal
        </div>
      </div>
      {children}
    </div>
  );
}
