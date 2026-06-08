function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabaseAnonKey(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getTrackCodePepper(): string {
  return requireEnv("TRACK_CODE_PEPPER");
}

export function getAppBaseUrl(): string {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

export function getAppEnv(): string {
  return process.env.APP_ENV ?? "development";
}
