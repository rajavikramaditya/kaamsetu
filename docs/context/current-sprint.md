# Current Sprint — Sprint 1 (Database & Security)

**Checkpoint ID:** `KS-S1-database-rls`  
**Goal:** KS-012 migrations + KS-007 RLS on Supabase  
**Status:** 🟡 Migration files ready — **founder must run on Supabase**

## Done

- [x] 11 migration SQL files (`supabase/migrations/`)
- [x] `standard_visit_charge` on `service_categories`
- [x] Seed: 5 categories + 10 Orai localities (LAUNCH-CONFIG)
- [x] RLS policies (011_rls_policies.sql)
- [x] `GET /api/public/bootstrap`
- [x] `npm run db:migrate` script + `supabase/README.md`
- [x] `npm run build` passes

## Founder action required

Run migrations on Supabase (see `supabase/README.md` Option A — SQL Editor, 11 files in order).

Then verify: https://kaamsetu-green.vercel.app/api/public/bootstrap

## Next after migrations applied

- [ ] RLS smoke test
- [ ] Sprint 2 — Worker module
