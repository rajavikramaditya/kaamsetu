import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { href: ROUTES.admin.dashboard, label: "Dashboard" },
  { href: ROUTES.admin.workers, label: "Workers" },
  { href: ROUTES.admin.jobs, label: "Jobs" },
  { href: ROUTES.admin.dispatch, label: "Dispatch" },
  { href: ROUTES.admin.payments, label: "Payments" },
  { href: ROUTES.admin.complaints, label: "Complaints" },
  { href: ROUTES.admin.settings, label: "Settings" },
  { href: ROUTES.admin.activityLogs, label: "Activity" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full bg-zinc-100">
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-4">
        <p className="mb-6 text-sm font-semibold text-emerald-800">Admin</p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
