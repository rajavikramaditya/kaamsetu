"use client";

import Link from "next/link";

export function WorkerShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-stone-50">
      <header className="border-b border-teal-100 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-teal-700">
              KaamSetu Worker
            </p>
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
          </div>
          <Link href="/" className="text-sm text-teal-700 underline-offset-4 hover:underline">
            Home
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
    </div>
  );
}
