type Props = { label: string };

export function AdminDispatchPlaceholder({ label }: Props) {
  return (
    <p className="text-sm text-zinc-600">{label} component placeholder.</p>
  );
}
