export function isValidAmount(amount: number | null | undefined): boolean {
  if (amount === null || amount === undefined) return true;
  return Number.isFinite(amount) && amount >= 0;
}

export function validateAmount(
  amount: number | null | undefined,
  label = "Amount",
): string | null {
  if (amount === null || amount === undefined) return null;
  if (!isValidAmount(amount)) {
    return `${label} must be a non-negative number.`;
  }
  return null;
}

export function parseAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
}
