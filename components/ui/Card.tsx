import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
