# Current Sprint — Sprint 2 (Worker Module)

**Checkpoint ID:** `KS-S2-worker-module`  
**Status:** 🟡 Implementation complete — run migration 012 on Supabase

## Sprint 2 scope (delivered)

- Phone OTP login (Supabase Auth)
- Worker profile onboarding
- Aadhaar upload (required) + PAN (optional)
- Approval status flow (`pending` → founder approves → `approved`)
- Availability toggle (Available / Busy) for approved workers
- Worker Freedom Principle preserved (home locality display-only)

## Not in Sprint 2 (by design)

- Dispatch, offers, jobs, payments, notifications, automated KYC

## Founder action

Run `supabase/migrations/012_worker_sprint2.sql` on Supabase (after 001–011).

Enable **Phone** provider in Supabase Auth + SMS provider (Twilio/etc.) for production OTP.

## Next

Sprint 3 — Customer request flow
