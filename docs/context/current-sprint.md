# Current Sprint — Sprint 4 IN PROGRESS 🟡

**Checkpoint ID:** `KS-S4-admin-operations`  
**Status:** 🟡 Built — pending founder live verification

## Sprint 4 — Admin Operations

Founder/admin control panel for customer requests and worker profiles.

| Deliverable | Status |
|---|---|
| Admin login + auth guard (`role=admin`) | ✅ Built |
| Auth callback routing (admin vs worker) | ✅ Fixed |
| Dashboard metrics | ✅ Built |
| Job/request queue | ✅ Built |
| Job detail (customer, photos, voice) | ✅ Built |
| Worker list + profile review | ✅ Built |
| Approve / reject / suspend workers | ✅ Built |
| Assisted booking entry | ⬜ Deferred |
| Dispatch | ⬜ Sprint 5 |

## Routes

| Path | Purpose |
|---|---|
| `/admin/login` | Email OTP (admin role required) |
| `/admin/dashboard` | Metrics + quick links |
| `/admin/jobs` | Customer request queue |
| `/admin/jobs/[id]` | Job detail + media |
| `/admin/workers` | Worker list |
| `/admin/workers/[id]` | Profile review + actions |

## Founder setup (required before testing)

1. In Supabase Dashboard → Authentication → Users → select your user
2. Edit **App Metadata**: `{ "role": "admin" }`
3. Visit `https://kaamsetu-green.vercel.app/admin/login`

## Previous sprint

**Sprint 3 — Customer Request Flow** ✅ COMPLETE / LIVE VERIFIED (`KS-S3-customer-flow`)

## Next sprint (not started)

**Sprint 5 — Dispatch System** (`KS-S5-dispatch`)

Wait for founder to say **"Start Sprint 5"** after Sprint 4 is live verified.
