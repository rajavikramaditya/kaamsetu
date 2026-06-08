# KaamSetu Supabase

SQL migrations follow **KS-012 Supabase SQL Migration Pack v1.0**.

## Migration order

1. `001_extensions.sql`
2. `002_enums.sql`
3. `003_tables_core.sql`
4. `004_tables_operations.sql`
5. `005_constraints_indexes.sql`
6. `006_triggers.sql`
7. `007_storage_buckets.sql`
8. `008_rls_enable.sql`
9. `009_seed_data.sql`
10. `010_sanity_checks.sql`
11. `011_rls_policies.sql` (from KS-007)

## Apply migrations

Run against a Supabase project using the SQL editor or Supabase CLI:

```bash
supabase db push
```

## Generate TypeScript types

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.types.ts
```

## Security rules

- Storage buckets are private.
- Never store raw tracking codes.
- Apply RLS policies before beta.
