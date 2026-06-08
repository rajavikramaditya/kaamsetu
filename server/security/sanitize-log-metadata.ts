const SENSITIVE_KEYS = new Set([
  "password",
  "tracking_code",
  "trackingCode",
  "service_role_key",
  "government_id",
  "government_id_number",
  "raw_document",
]);

export function sanitizeLogMetadata(
  metadata: Record<string, unknown>,
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (SENSITIVE_KEYS.has(key)) {
      sanitized[key] = "[REDACTED]";
      continue;
    }
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogMetadata(value as Record<string, unknown>);
      continue;
    }
    sanitized[key] = value;
  }

  return sanitized;
}
