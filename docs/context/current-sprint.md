# Current Sprint — Sprint 3 (Customer Request Flow)

**Checkpoint ID:** `KS-S3-customer-flow`  
**Status:** 🟡 Build verified — pending founder live test + migration 013

## Sprint 2 — closed ✅

Live verified on production (2026-06-17):
- Worker Email OTP login
- Profile + Aadhaar upload
- Founder approval → Approved dashboard
- Available / Busy toggle
- Dashboard + Profile navigation

## Sprint 3 scope

| # | Deliverable | Status |
|---|---|---|
| 3.1 | Landing + invite code gate | ✅ Built |
| 3.2 | Customer request form + validation | ✅ Built |
| 3.3 | Job photo upload | ✅ Built |
| 3.4 | Track job (job_ref + phone + track_code) | ✅ Built |

## Sprint 3 exit criteria

Customer creates request → job record exists for admin queue (Sprint 4 UI).

**Pending:** Founder runs migration `013_sprint3_invite_seed.sql`, then live test with invite `ORAI2026`.

## Not in Sprint 3

- Admin dashboard, dispatch, payments, notifications, maps

## Founder action (parallel)

1. Run migration `supabase/migrations/013_sprint3_invite_seed.sql` in Supabase SQL Editor
2. Test flow: `/request` → invite `ORAI2026` → submit → save track code → `/track`
3. Confirm job row in Supabase `jobs` table
