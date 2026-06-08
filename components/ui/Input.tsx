import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1 text-sm text-zinc-700">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        id={inputId}
        className={`rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-emerald-600 focus:ring-2 ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
