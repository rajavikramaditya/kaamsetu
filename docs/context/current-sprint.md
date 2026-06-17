# Current Sprint — Sprint 3 (Customer Request Flow)

**Checkpoint ID:** `KS-S3-customer-flow`  
**Status:** 🟡 Live test passed — UX corrections deployed (pending migration 014 + re-test)

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
| 3.1 | Landing + invite code gate | ✅ | Live |
| 3.2 | Request form + validation | ✅ | Live |
| 3.3 | Photo upload (up to 5, compressed) + voice note | ✅ | Build |
| 3.4 | Track job + device saved requests | ✅ | Build |

## Sprint 3 UX corrections (founder-approved)

- Up to 5 issue photos with client-side compression (1280px, ~0.7 quality, WebP/JPEG)
- Optional 60s voice note via MediaRecorder → Supabase Storage
- Saved requests in localStorage — "My Requests" on `/track`
- Manual track form kept as fallback
- No customer login (deferred past 100 jobs)

**Migration 014:** `issue_voice_note` media kind — founder must run in Supabase

## Sprint 3 exit criteria

Customer creates request → job record exists for admin queue (Sprint 4 UI).

**Pending:** Founder runs migration `014_sprint3_voice_media.sql`, re-test photos + voice + saved requests.

## Not in Sprint 3

- Admin dashboard, dispatch, payments, notifications, maps

## Founder action (parallel)

1. Run migration `supabase/migrations/013_sprint3_invite_seed.sql` in Supabase SQL Editor
2. Test flow: `/request` → invite `ORAI2026` → submit → save track code → `/track`
3. Confirm job row in Supabase `jobs` table
