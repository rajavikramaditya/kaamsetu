# KS-S2 Worker Module — Architecture & Implementation

**Checkpoint:** `KS-S2-worker-module`  
**Date:** 2026-06-16

## Phase 1 — Architecture Review

### Auth
- Supabase Auth **Email OTP** (primary — closed beta, low cost)
- **Phone OTP** code path retained (`PhoneOtpLogin` component) for when SMS provider is configured
- Session cookies via `@supabase/ssr` middleware on `/worker/*` and `/api/worker/*`
- Worker profile auto-created on first `GET /api/worker/me` after OTP
- Worker identity: **profile phone + Aadhaar** (even when login is via email)

### Data flow
```
/worker/login → OTP → /api/worker/me → draft profile
/worker/profile → PUT profile + POST documents → approval_status = pending
Founder (Sprint 4) → approved → worker can toggle availability
```

### Worker Freedom Principle
- `locality_id` is display/metadata only — no dispatch restriction in Sprint 2

### Approval rule
- `canReceiveJobOffers()` returns true only when `approval_status === "approved"`
- Enforced in `types/worker.ts`; availability toggle requires approval

## Database impact (migration 012)

| Change | Purpose |
|---|---|
| `approval_status` + `pending`, `banned` | MVP status labels |
| `worker_profiles.locality_id` nullable | Onboarding before full profile |
| `worker_profiles.primary_category_id` nullable | Same |
| `worker_documents` check + `aadhaar_image`, `pan_image` | Identity uploads |
| RLS `worker_profiles_worker_insert` | Self-registration after OTP |

**Founder action:** Run `012_worker_sprint2.sql` on Supabase after 001–011.

## API list

| Method | Route | Auth | Purpose |
|---|---|---|---|
| GET | `/api/worker/me` | Worker session | Profile + document summary |
| GET | `/api/worker/profile` | Worker session | Raw profile row |
| PUT | `/api/worker/profile` | Worker session | Update profile; `submit_for_review` → `pending` |
| POST | `/api/worker/documents` | Worker session | Multipart upload (admin client → storage) |
| PATCH | `/api/worker/availability` | Approved worker | Toggle `is_available` |

Public (existing): `GET /api/public/bootstrap` — categories + localities for profile form.

## UI screens

| Route | Purpose |
|---|---|
| `/worker/login` | Email OTP (active) + Phone OTP (future) |
| `/worker/profile` | Onboarding form + Aadhaar/PAN upload + submit |
| `/worker/dashboard` | Status, availability toggle (approved), logout |

Home page links to `/worker/login`.

## RLS & storage

- Worker reads/updates own `worker_profiles` via `auth_user_id = auth.uid()`
- Worker inserts own profile (migration 012 policy)
- Document **DB rows** inserted via service-role admin client (bypasses RLS)
- Storage upload via admin client to `worker-documents/{worker_profile_id}/...`
- Existing storage RLS policies align with folder-per-profile layout

## Out of scope (Sprint 2)

Dispatch, offers, payments, notifications, automated KYC, admin approval UI (Sprint 4).
