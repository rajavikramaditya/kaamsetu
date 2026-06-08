export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}
