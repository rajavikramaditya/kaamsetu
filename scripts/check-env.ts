/** Validates required environment variables are set. */
const REQUIRED_PUBLIC = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const REQUIRED_SERVER = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "TRACK_CODE_PEPPER",
] as const;

let hasError = false;

for (const key of REQUIRED_PUBLIC) {
  if (!process.env[key]) {
    console.error(`Missing: ${key}`);
    hasError = true;
  }
}

for (const key of REQUIRED_SERVER) {
  if (!process.env[key]) {
    console.warn(`Missing (server): ${key}`);
  }
}

if (hasError) {
  process.exit(1);
}

console.log("Environment check passed.");
