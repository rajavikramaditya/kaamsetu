# Current Sprint — Sprint 1 (Database & Security)

**Checkpoint ID:** `KS-S1-database-rls`  
**Goal:** KS-012 migrations + KS-007 RLS on Supabase  
**Previous:** ✅ `KS-S0-foundation` complete

## Launch config (from founder)

- **City:** Orai District, Jalaun, UP  
- **Categories + visit charges:** `docs/LAUNCH-CONFIG.md`  
- **Localities:** 10 locked  
- **Schema add:** `service_categories.standard_visit_charge` (admin-editable Sprint 4)

## Sprint 1 scope

- [ ] KS-012 migration files in `supabase/migrations/`
- [ ] Add `standard_visit_charge` column to `service_categories`
- [ ] Enums, tables, indexes
- [ ] Storage buckets
- [ ] RLS policies (KS-007)
- [ ] Seed from LAUNCH-CONFIG (5 categories + 10 localities)
- [ ] RLS smoke test

## Founder blockers

1. Helper half-day / full-day rates — optional until Sprint 4 admin Settings

## Do not start yet

- Worker screens (Sprint 2)
- Customer flow (Sprint 3)
