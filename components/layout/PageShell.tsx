import type { ReactNode } from "react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants/app";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export function PageShell({
  title,
  description,
  children,
  actions,
}: PageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            {APP_NAME}
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
          {description ? (
            <p className="mt-1 text-zinc-600">{description}</p>
          ) : (
            <p className="mt-1 text-zinc-500">{APP_TAGLINE}</p>
          )}
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}
