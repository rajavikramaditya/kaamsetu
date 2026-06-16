# Supabase migrations — KaamSetu

Sprint 1 creates the full MVP schema per KS-012 + KS-007.

## Files (run in order)

```text
001_extensions.sql
002_enums.sql
003_tables_core.sql
004_tables_operations.sql
005_constraints_indexes.sql
006_triggers.sql
007_storage_buckets.sql
008_rls_enable.sql
009_seed_data.sql
010_sanity_checks.sql
011_rls_policies.sql
```

## Option A — Supabase Dashboard (recommended first time)

1. Open https://supabase.com/dashboard → your project → **SQL Editor**
2. Run each file above **one by one** in order (copy-paste full file → Run)
3. If a file fails because objects already exist, skip or fix — do not re-run 002 enums on existing types

## Option B — Script (needs database password)

1. Supabase → **Project Settings** → **Database** → copy **Connection string** (URI)
2. Add to `.env.local`:

```env
SUPABASE_DB_URL=postgresql://postgres.[ref]:[YOUR-PASSWORD]@...
```

3. Run:

```bash
npm run db:migrate
```

## Verify

After migrations:

- `GET /api/public/bootstrap` → 5 categories + 10 localities
- `GET /api/health` → supabase connected

## Admin user

Set admin role in Supabase Auth → Users → user → **App metadata**:

```json
{ "role": "admin" }
```
