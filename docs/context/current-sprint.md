# Current Sprint — Sprint 1 (Database & Security)

**Checkpoint ID:** `KS-S1-database-rls`  
**Status:** ✅ Complete — database live, bootstrap verified

## Sprint 1 decision (locked)

**Locality is display-only for MVP dispatch.** Future worker/admin offers must show job locality before accept/decline, but must **not** block cross-locality dispatch.

Orai = one practical service radius (~10 km). Worker registered in Indira Nagar may receive and accept a job in Civil Lines.

## Done

- [x] 11 migration SQL files applied on Supabase
- [x] `standard_visit_charge` on `service_categories`
- [x] Seed: 5 categories + 10 Orai localities
- [x] RLS policies (011_rls_policies.sql)
- [x] `GET /api/public/bootstrap` verified (5 categories, 10 localities)
- [x] Locality rule doc correction (informational metadata only)

## Next

**Sprint 2 (`KS-S2-worker-module`)** — Worker login, profile, KYC, dashboard
