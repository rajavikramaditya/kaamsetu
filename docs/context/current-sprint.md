# Current Sprint — Sprint 2 (Worker Module)

**Checkpoint ID:** `KS-S2-worker-module`  
**Status:** ✅ Complete

## Worker login strategy (locked)

- **Email OTP** — permanent low-cost login for closed beta
- **Phone OTP** — code path ready; enabled when SMS provider is configured (no Twilio/MessageBird now)
- **Profile phone** — mandatory on worker profile (identity tied to phone + Aadhaar)
- UI wording: *"Login with Email OTP now. Phone OTP will be enabled later when SMS provider is configured."*

## Founder action

Enable **Email** provider in Supabase Auth (OTP emails are included).

## Next

Sprint 3 — Customer request flow
