function requireEnv(name: string, value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function optionalEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** Publishable / anon key — supports both env var names. */
export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
}

export function getSupabaseUrl(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return optionalEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getAppBaseUrl(): string {
  return (
    optionalEnv(process.env.APP_BASE_URL) ??
    optionalEnv(process.env.NEXT_PUBLIC_APP_BASE_URL) ??
    "http://localhost:3000"
  );
}

export function isSupabaseConfigured(): boolean {
  try {
    getSupabaseUrl();
    getSupabaseAnonKey();
    return true;
  } catch {
    return false;
  }
}
