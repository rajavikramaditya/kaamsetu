import type { ReactNode } from "react";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      {title ? <h3 className="text-base font-semibold text-zinc-900">{title}</h3> : null}
      {children}
    </section>
  );
}
