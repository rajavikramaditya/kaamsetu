import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-teal-100 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-teal-800">
            KaamSetu
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            Closed Beta — Building
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-teal-700">
            Local Work. Trusted People.
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            Trusted local workers, one request away.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-stone-600">
            KaamSetu connects your neighbourhood with verified electricians,
            plumbers, helpers, and more — starting in one city cluster.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <span className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-medium text-white opacity-60">
            Start Request — Coming Soon
          </span>
          {user ? (
            <Link
              href="/worker/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full border border-teal-700 px-6 text-sm font-medium text-teal-800"
            >
              Worker Dashboard
            </Link>
          ) : (
            <Link
              href="/worker/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-teal-700 px-6 text-sm font-medium text-teal-800"
            >
              Worker Login
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
          <p className="font-medium text-stone-900">Sprint 0 foundation</p>
          <p className="mt-2">
            App scaffold, Supabase connection, and folder structure are in place.
            Customer booking and worker flows arrive in upcoming sprints.
          </p>
          <Link
            href="/api/health"
            className="mt-4 inline-block text-teal-700 underline-offset-4 hover:underline"
          >
            Check system health →
          </Link>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white px-6 py-6 text-center text-sm text-stone-500">
        Need help? WhatsApp support will appear here after launch setup.
      </footer>
    </div>
  );
}
