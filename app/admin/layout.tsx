import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 text-sm font-medium">
          KaamSetu Admin
        </div>
      </div>
      {children}
    </div>
  );
}
