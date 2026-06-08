import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants/app";
import { ROUTES } from "@/lib/constants/routes";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href={ROUTES.public.home} className="font-semibold text-emerald-800">
            {APP_NAME}
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href={ROUTES.public.request} className="text-zinc-600 hover:text-zinc-900">
              Request
            </Link>
            <Link href={ROUTES.public.track} className="text-zinc-600 hover:text-zinc-900">
              Track
            </Link>
            <Link href={ROUTES.worker.login} className="text-zinc-600 hover:text-zinc-900">
              Worker
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
      <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-500">
        {APP_TAGLINE}
      </footer>
    </div>
  );
}
