import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ title, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}
      {...props}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">{title}</h2>
      ) : null}
      {children}
    </div>
  );
}
