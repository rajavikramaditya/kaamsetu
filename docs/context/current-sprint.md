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

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 3.1 | Landing + invite code gate | ✅ | Live |
| 3.2 | Request form + validation | ✅ | Live |
| 3.3 | Photo upload (up to 5, compressed) + voice note | ✅ | Build |
| 3.4 | Track job + device saved requests | ✅ | Build |

## Sprint 3 locked decisions (founder-approved)

| # | Decision | Implementation |
|---|---|---|
| 1 | Up to 5 compressed issue photos | Client compress → upload; max 1280px, ~0.7 quality, WebP/JPEG |
| 2 | One optional voice note, max 60s | `MediaRecorder`; mic permission on record tap only |
| 3 | Video upload deferred | After 100 jobs — not in MVP |
| 4 | No customer login | Invite + track token + device saved requests only |
| 5 | Device saved requests | `localStorage` — "My Requests" on `/track` |
| 6 | Manual track fallback | `job_ref` + phone + `track_code` lookup form |
| 7 | PWA = installable app | Camera/mic when needed; low-friction mobile-first UX |

**Migration 014:** `issue_voice_note` media kind — founder must run in Supabase

## Sprint 3 exit criteria

Customer creates request → job record exists for admin queue (Sprint 4 UI).

**Pending:** Founder runs migration `014_sprint3_voice_media.sql`, re-test photos + voice + saved requests.

## Not in Sprint 3

- Admin dashboard, dispatch, payments, notifications, maps
- Customer login / accounts
- Video upload
- Push notifications, WhatsApp API, AI transcription

## Founder action (parallel)

1. Run migration `supabase/migrations/014_sprint3_voice_media.sql` in Supabase SQL Editor
2. Re-test: 5 photos, voice note, My Requests tap-to-track, manual lookup fallback
3. Confirm `job_media` rows for photos and voice in Supabase
