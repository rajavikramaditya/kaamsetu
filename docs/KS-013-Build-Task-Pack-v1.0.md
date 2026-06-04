# KS-013 Build Task Pack v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** AI-Agent Build Execution Pack  
**Version:** 1.0  
**Status:** Final Pre-Code Planning Document  
**Depends On:**  
- KS-005 PRD v1.0  
- KS-006 Database Schema v1.0  
- KS-007 Supabase RLS Policies v1.0  
- KS-008 API Contracts v1.0  
- KS-010 Architecture Audit & Gap Analysis v1.0  
- KS-011 Repository Structure & Engineering Standards v1.0  
- KS-012 Supabase SQL Migration Pack v1.0  

---

## 1. Purpose

This document converts KaamSetu planning into build-ready execution tasks.

After this document, no more planning documents should be created before initial coding.

The next phase is:

```text
Repository Setup
↓
Supabase Setup
↓
Sprint 0 Coding
↓
Sprint 1 Coding
```

---

## 2. Build Philosophy

KaamSetu will be built in small, testable slices.

Rules:

1. One sprint = one working layer.
2. No feature outside PRD.
3. No random AI-generated features.
4. Every task must map to KS-005 to KS-012.
5. Every sprint must end with a runnable checkpoint.
6. If something breaks architecture, stop and audit before continuing.

---

## 3. AI Agent Operating Model

Founder = Vikram  
Team = AI Agents

Recommended role split:

| Agent | Role |
|---|---|
| ChatGPT / CTO | Architecture, review, task breakdown |
| Copilot | Code completion inside VS Code |
| Gemini / Claude | Code audit and bug review |
| Founder | Final decision maker and tester |

AI agents should not receive all documents every time.

Use context packs:

```text
docs/context/core.md
docs/context/schema.md
docs/context/api.md
docs/context/current-sprint.md
```

---

## 4. Global Build Rules

Allowed:

- Next.js
- TypeScript
- Supabase
- Supabase Storage
- Vercel
- PWA
- Manual WhatsApp Business
- Manual Razorpay Payment Links later

Forbidden before beta:

- Wallet
- Chat
- Maps
- Live tracking
- Ads
- Referrals
- Coupons
- Subscriptions
- Native Android app
- Native iOS app
- AI matching
- WhatsApp API automation
- IVR automation

---

# 5. Sprint 0 — Repository Foundation

## Goal

Create clean project foundation.

## Tasks

### Task 0.1 — Create Next.js App

Command target:

```text
Next.js + TypeScript + App Router
```

Acceptance:

- App runs locally.
- Root page loads.
- TypeScript works.

---

### Task 0.2 — Create Folder Structure

Create:

```text
app/
components/
features/
lib/
server/
supabase/
scripts/
tests/
docs/
types/
public/
```

Acceptance:

- Folder structure matches KS-011.

---

### Task 0.3 — Add Environment Template

Create:

```text
.env.example
```

Required variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TRACK_CODE_PEPPER=
APP_ENV=development
APP_BASE_URL=http://localhost:3000
ADMIN_BOOTSTRAP_EMAIL=
```

Acceptance:

- `.env.example` committed.
- `.env.local` ignored.

---

### Task 0.4 — Add Engineering Standards

Create:

```text
README.md
docs/context/core.md
docs/context/current-sprint.md
```

Acceptance:

- AI coding rules visible.
- Forbidden features listed.

---

# 6. Sprint 1 — Supabase Schema

## Goal

Implement KS-012 migration pack.

## Tasks

### Task 1.1 — Create Migration Files

Create:

```text
supabase/migrations/001_extensions.sql
supabase/migrations/002_enums.sql
supabase/migrations/003_tables_core.sql
supabase/migrations/004_tables_operations.sql
supabase/migrations/005_constraints_indexes.sql
supabase/migrations/006_triggers.sql
supabase/migrations/007_storage_buckets.sql
supabase/migrations/008_rls_enable.sql
supabase/migrations/009_seed_data.sql
supabase/migrations/010_sanity_checks.sql
```

Acceptance:

- Files exist.
- SQL copied from KS-012 and adjusted only if required.

---

### Task 1.2 — Run Migrations

Acceptance:

- All tables created.
- Seed categories inserted.
- Seed localities inserted.
- RLS enabled.

---

### Task 1.3 — Generate Database Types

Create:

```text
types/database.types.ts
```

Acceptance:

- TypeScript can import database types.

---

# 7. Sprint 2 — Minimal Admin Shell

## Goal

Admin can operate core setup.

## Screens

- /admin/login
- /admin/dashboard
- /admin/settings
- /admin/workers

## Tasks

### Task 2.1 — Admin Auth Guard

Create:

```text
server/auth/require-admin.ts
```

Acceptance:

- Non-admin blocked from admin pages.

---

### Task 2.2 — Admin Dashboard

Show:

- new requests count
- pending workers count
- open complaints count
- pending payments count

Acceptance:

- Dashboard loads with real database counts.

---

### Task 2.3 — Settings Screen

Manage:

- service categories active/inactive
- localities serviceable/active
- invite codes

Acceptance:

- Admin can create invite code.
- Admin can toggle locality/category.

---

### Task 2.4 — Worker Approval Screen

Acceptance:

- Admin can view pending workers.
- Admin can approve/reject worker.

---

# 8. Sprint 3 — Worker Module

## Goal

Worker can login, complete profile, upload docs, and view dashboard.

## Screens

- /worker/login
- /worker/profile
- /worker/dashboard

## Tasks

### Task 3.1 — Worker Login

Acceptance:

- Worker can login with mobile + password UI.
- Backend uses Supabase password auth.

---

### Task 3.2 — Worker Profile Form

Fields:

- full_name
- whatsapp_number
- primary_category_id
- locality_id
- address_text
- years_experience
- has_own_tools
- supported_job_modes
- government_id_type
- government_id_last4

Acceptance:

- Worker can save profile.
- Validation works.

---

### Task 3.3 — Worker Document Upload

Upload:

- profile_photo
- government_id_front
- government_id_back optional

Acceptance:

- Files stored in private bucket.
- Metadata saved.

---

### Task 3.4 — Worker Dashboard

Show:

- approval status
- pending offers
- active job
- earnings summary

Acceptance:

- Worker sees correct state.

---

# 9. Sprint 4 — Customer Request Flow

## Goal

Customer can submit request without account.

## Screens

- Landing page
- Invite gate
- New request form
- Photo upload
- Request submitted
- Track job

## Tasks

### Task 4.1 — Public Bootstrap API

Return:

- active categories
- active localities
- beta status

Acceptance:

- Landing page loads service data.

---

### Task 4.2 — Invite Validation

Acceptance:

- Valid invite passes.
- Invalid/expired invite fails.

---

### Task 4.3 — Create Request

Acceptance:

- Customer submits request.
- customer_profiles row created/upserted.
- jobs row created.
- job_ref and tracking code shown.

---

### Task 4.4 — Photo Upload

Acceptance:

- Max 3 photos.
- Max 5MB each.
- Stored in private bucket.

---

### Task 4.5 — Track Job

Acceptance:

- Customer can track using job_ref + phone + track_code.
- Wrong code fails.

---

# 10. Sprint 5 — Dispatch System

## Goal

Founder can dispatch one job to one worker at a time.

## Screens

- /admin/jobs
- /admin/jobs/[jobId]
- /admin/dispatch
- Worker offer detail

## Tasks

### Task 5.1 — Job Queue

Acceptance:

- Admin sees requested/validated jobs.

---

### Task 5.2 — Job Triage

Acceptance:

- Admin can set pricing type.
- Admin can set estimated/final amount.
- Admin can validate job.

---

### Task 5.3 — Create Dispatch Attempt

Acceptance:

- Admin can send offer to worker.
- Only one active sent offer per job.

---

### Task 5.4 — Worker Accept/Decline

Acceptance:

- Worker can accept.
- Worker can decline.
- Accepted offer assigns job.

---

### Task 5.5 — Assignment

Acceptance:

- Job becomes assigned.
- dispatch_status becomes assigned.
- assigned_worker_id set.

---

# 11. Sprint 6 — Job Lifecycle, Payment, Rating, Complaint

## Goal

End-to-end job completion.

## Tasks

### Task 6.1 — Worker Start Job

State:

```text
assigned → in_progress
```

Acceptance:

- Only assigned worker can start.

---

### Task 6.2 — Worker Complete Job

State:

```text
in_progress → completed
```

Acceptance:

- Completion note or amount recorded.
- Payment state updated.

---

### Task 6.3 — Admin Payment Confirmation

Acceptance:

- Admin confirms payment.
- Job can be closed.

---

### Task 6.4 — Customer Rating

Acceptance:

- Customer can rate closed job once.

---

### Task 6.5 — Customer Complaint

Acceptance:

- Customer can create one complaint per job.
- Admin can resolve/dismiss.

---

# 12. Sprint 7 — Beta Hardening

## Goal

Prepare for first 20 worker / 20 job closed beta.

## Tasks

- Mobile testing on Android Chrome
- Security testing
- Worker isolation testing
- Admin flow testing
- Activity logs audit
- Storage access testing
- Error message cleanup
- Backup test
- Seed data finalization

Acceptance:

- Founder can operate platform alone.
- No critical security issue.
- First 20 workers can be onboarded.
- First 20 jobs can be executed.

---

# 13. Required Tests

## Unit Tests

- phone validation
- amount validation
- state transitions
- tracking code hash verification
- invite code validation

## E2E Tests

- customer creates request
- admin validates job
- admin dispatches worker
- worker accepts job
- worker completes job
- admin confirms payment
- customer rates job

---

# 14. Build Stop Conditions

Stop build if:

- Service role appears in client code
- Public user can query tables directly
- Worker can view another worker job
- Job can have two active offers
- Job closes without payment confirmed/waived
- Activity logs not written
- Raw tracking code stored
- Storage bucket is public

---

# 15. Founder Testing Checklist

Before closed beta, founder must test:

- create invite code
- create worker
- approve worker
- create customer request
- upload job photo
- dispatch worker
- worker accept
- worker start
- worker complete
- admin confirm payment
- customer rating
- customer complaint
- admin complaint resolution

---

# 16. Context Packs for AI Agents

## core.md

Must include:

- stack
- MVP exclusions
- build rules
- role boundaries

## schema.md

For each task, include only relevant tables.

## api.md

For each task, include only relevant endpoints.

## current-sprint.md

Must include:

- sprint goal
- tasks
- allowed files
- forbidden changes
- acceptance criteria

---

# 17. Final Planning Boundary

After KS-013:

```text
No more planning documents before coding.
```

Allowed documents after coding starts:

- bug reports
- sprint review notes
- change requests
- release checklist

Not allowed:

- new founder blueprint
- new research document
- new product strategy
- new feature expansion

---

# 18. Final Build Decision

Status:

```text
GO for Repository Setup
GO for Supabase Setup
GO for Sprint 0
NO-GO for feature expansion
```

Next step:

```text
Create KaamSetu repository
Implement Sprint 0
```

---

# Final Verdict

KS-013 is the final pre-code planning document.

KaamSetu now enters Build Mode.
