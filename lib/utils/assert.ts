export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${String(value)}`);
}

export function assertDefined<T>(
  value: T | null | undefined,
  message = "Expected value to be defined",
): T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
  return value;
}
