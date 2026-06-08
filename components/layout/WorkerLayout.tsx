import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const NAV_ITEMS = [
  { href: ROUTES.worker.dashboard, label: "Dashboard" },
  { href: ROUTES.worker.profile, label: "Profile" },
];

export function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="font-semibold text-emerald-800">Worker</span>
          <nav className="flex gap-4 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-600 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
