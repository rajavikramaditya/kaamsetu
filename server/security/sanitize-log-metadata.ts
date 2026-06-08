const FORBIDDEN_KEYS = new Set([
  "tracking_code",
  "password",
  "service_role_key",
  "government_id",
  "government_id_number",
  "raw_body",
]);

export function sanitizeLogMetadata(
  metadata: Record<string, unknown>,
): Record<string, unknown> {
  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) continue;
    if (typeof value === "string" && value.length > 500) {
      safe[key] = `${value.slice(0, 500)}…`;
      continue;
    }
    safe[key] = value;
  }

  return safe;
}
