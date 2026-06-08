export function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount >= 0;
}

export function parseAmount(value: unknown): number | null {
  if (typeof value === "number") {
    return isValidAmount(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return isValidAmount(parsed) ? parsed : null;
  }
  return null;
}
