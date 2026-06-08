# KaamSetu Supabase

SQL migrations for the KaamSetu MVP database (KS-012).

## Migration Order

Run files in `migrations/` numerically:

1. `001_extensions.sql` — PostgreSQL extensions
2. `002_enums.sql` — Enum types
3. `003_tables_core.sql` — Core tables
4. `004_tables_operations.sql` — Operational tables
5. `005_constraints_indexes.sql` — Indexes and constraints
6. `006_triggers.sql` — `updated_at` triggers
7. `007_storage_buckets.sql` — Private storage buckets
8. `008_rls_enable.sql` — Enable RLS (policies in KS-007)
9. `009_seed_data.sql` — Categories and localities
10. `010_sanity_checks.sql` — Verification queries

## Apply Migrations

Using Supabase CLI:

```bash
supabase db push
```

Or run each file in the Supabase SQL editor in order.

## Generate Types

After migrations:

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
```

## Security Rules

- Storage buckets are **private**
- RLS must be enabled on all tables
- Service role key is server-only
- Never store raw tracking codes
