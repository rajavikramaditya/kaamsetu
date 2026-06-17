# Current Sprint — Sprint 3 (Customer Request Flow)

**Checkpoint ID:** `KS-S3-customer-flow`  
**Status:** 🟡 Live test passed — founder corrections deployed (run migration 015)

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
| 1 | **Required fields only:** name, mobile, service, locality | Address, description, media optional |
| 2 | Up to 5 compressed issue photos | Client compress → upload |
| 3 | One optional voice note, max 60s | Robust MediaRecorder MIME fallback |
| 4 | No customer login | localStorage saved requests |
| 5 | Same-device tracking | "View this request" + My Requests tap-to-load |
| 6 | Manual track fallback | `job_ref` + phone + `track_code` |

**Migrations:** `014` voice media kind · `015` optional address/description (founder must run 015)

## Sprint 3 exit criteria

Customer creates request → job record exists for admin queue (Sprint 4 UI).

**Pending:** Founder runs migration `015_sprint3_optional_job_fields.sql`. Re-test minimal submit + saved request tap + voice note.

## Not in Sprint 3

- Admin dashboard, dispatch, payments, notifications, maps
- Customer login / accounts
- Video upload
- Push notifications, WhatsApp API, AI transcription

## Founder action (parallel)

1. Run migration `supabase/migrations/014_sprint3_voice_media.sql` in Supabase SQL Editor
2. Re-test: 5 photos, voice note, My Requests tap-to-track, manual lookup fallback
3. Confirm `job_media` rows for photos and voice in Supabase
