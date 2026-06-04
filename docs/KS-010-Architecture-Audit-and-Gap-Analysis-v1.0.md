# KS-010 Architecture Audit & Gap Analysis v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** Architecture Audit Document  
**Version:** 1.0  
**Status:** Pre-Build Review  
**Depends On:**  
- KS-005 PRD v1.0  
- KS-006 Database Schema v1.0  
- KS-007 Supabase RLS Policies v1.0  
- KS-008 API Contracts v1.0  
- KS-009 Sprint Plan v1.0  

---

## Table of Contents

1. Executive Summary  
2. Audit Objective  
3. Audit Rules  
4. Source Documents Reviewed  
5. PRD vs Schema Audit  
6. Schema vs API Audit  
7. API vs RLS Audit  
8. Sprint Plan Audit  
9. Missing Components  
10. Security Risks  
11. Data Integrity Risks  
12. Operational Risks  
13. Build Blockers  
14. Recommended Corrections  
15. Updated Build Order  
16. Go / No-Go Decision  
17. Final CTO Verdict  

---

# 1. Executive Summary

This audit reviews KaamSetu’s current engineering document chain before coding begins.

The reviewed document chain is:

```text
KS-005 PRD
↓
KS-006 Database Schema
↓
KS-007 RLS Policies
↓
KS-008 API Contracts
↓
KS-009 Sprint Plan
```

The architecture direction is fundamentally correct:

- PWA-first
- Next.js + TypeScript
- Supabase PostgreSQL
- Supabase Storage
- Vercel
- Manual WhatsApp Business operations
- No native app in MVP
- No wallet
- No maps
- No chat
- No ads
- No AI matching
- Founder-controlled dispatch

However, the first-pass engineering documents require tightening before code generation.

The biggest concern is not strategy.  
The biggest concern is consistency between schema, API contracts, RLS policies, and sprint execution.

---

# 2. Audit Objective

The objective of KS-010 is to verify whether the system is ready for build.

This audit checks:

- PRD requirements are represented in schema
- Schema supports required APIs
- RLS supports required access patterns
- Sprint plan follows correct dependencies
- Security assumptions are clear
- Build blockers are identified before coding

This document does not add new product features.

---

# 3. Audit Rules

Audit rule:

```text
ADD NOTHING
REMOVE NOTHING
AUDIT EVERYTHING
```

Allowed:

- identify gaps
- correct contradictions
- tighten sequence
- mark blockers
- recommend document updates

Not allowed:

- new marketplace features
- new monetization
- new app surfaces
- new automation
- strategy redesign

---

# 4. Source Documents Reviewed

## KS-005 PRD

Defines:

- Customer PWA
- Worker PWA
- Admin Panel
- Data model
- APIs
- State machines
- Testing
- MVP freeze

## KS-006 Database Schema

Defines:

- Tables
- Columns
- Relationships
- Indexes
- Storage
- Migration order

## KS-007 RLS Policies

Defines:

- Access boundaries
- Table-level security
- Storage security
- Worker/admin/customer rules

## KS-008 API Contracts

Defines:

- Public APIs
- Worker APIs
- Admin APIs
- Error model
- State transitions

## KS-009 Sprint Plan

Defines:

- Build sequence
- sprint scope
- release criteria

---

# 5. PRD vs Schema Audit

## 5.1 Strong Alignment

The following PRD requirements are properly represented in schema:

| PRD Requirement | Schema Support | Status |
|---|---|---|
| Invite-gated customer request | invite_codes, jobs.invite_code_id | Aligned |
| Anonymous customer tracking | jobs.public_id, job_ref, tracking_code_hash | Aligned |
| Worker onboarding | worker_profiles, worker_documents | Aligned |
| Admin approval | worker_profiles.approval_status | Aligned |
| Service categories | service_categories | Aligned |
| Locality control | localities | Aligned |
| Job lifecycle | jobs.booking_status | Aligned |
| Dispatch workflow | dispatch_attempts, jobs.dispatch_status | Aligned |
| Payment recording | payments | Aligned |
| Ratings | ratings | Aligned |
| Complaints | complaints | Aligned |
| Audit trail | activity_logs | Aligned |

## 5.2 Gaps Found

### Gap 1: complaint_status inconsistency

PRD expects complaint state tracking.

Schema currently has:

```text
jobs.complaint_status text default 'none'
complaints.status complaint_status
```

Issue:

- `complaint_status` enum does not include `none`
- jobs.complaint_status uses text, while complaints.status uses enum

Recommendation:

Use controlled text or enum consistently.

Preferred MVP approach:

```text
jobs.complaint_status values:
none
open
under_review
resolved
dismissed
closed
```

Do not reuse complaint_status enum unless it includes `none`.

---

### Gap 2: worker availability delayed in PRD but required operationally

PRD delayed worker availability toggle until 100 jobs, but schema includes:

```text
worker_profiles.is_available
```

This is acceptable because dispatch needs operational availability from day one.

Decision:

Keep `is_available` in schema.

Do not build fancy availability scheduling UI.

Worker or admin can toggle simple availability only.

---

### Gap 3: worker badges require field clarity

MVP Scope mentions:

- Pending
- Probation
- Verified
- Paused

Schema includes:

```text
badge_status text
```

Recommendation:

Define allowed badge_status values clearly:

```text
pending
probation
verified
paused
```

---

### Gap 4: customer tracking credentials require hashing implementation

Schema includes:

```text
tracking_code_hash
```

PRD requires raw tracking code only shown once.

Missing detail:

- hash algorithm
- salt strategy
- lookup validation

Recommendation:

Use server-side hashing with a secret pepper from environment variable.

Raw track code must never be logged.

---

### Gap 5: activity_logs metadata safety must be enforced

PRD requires safe logs.

Schema allows:

```text
metadata jsonb
```

Risk:
AI agents may dump full request bodies into metadata.

Recommendation:

API layer must define log payload whitelist per action.

---

# 6. Schema vs API Audit

## 6.1 Strong Alignment

| API Need | Schema Support | Status |
|---|---|---|
| Validate invite | invite_codes | Aligned |
| Create request | customer_profiles, jobs | Aligned |
| Upload photos | job_media | Aligned |
| Track job | jobs + customer_profiles | Aligned |
| Worker login/profile | auth.users + worker_profiles | Aligned |
| Worker docs | worker_documents | Aligned |
| Worker offers | dispatch_attempts | Aligned |
| Admin jobs | jobs | Aligned |
| Payment ledger | payments | Aligned |
| Complaints | complaints | Aligned |
| Activity logs | activity_logs | Aligned |

## 6.2 Gaps Found

### Gap 1: KS-008 simplified endpoint names differ from PRD

PRD endpoint example:

```text
POST /api/public/jobs/{publicId}/payments/confirm
POST /api/worker/offers/{dispatchId}/accept
PATCH /api/admin/jobs/{jobId}/triage
```

KS-008 simplified some names:

```text
POST /api/public/payment-confirmation
POST /api/worker/jobs/{id}/start
POST /api/admin/jobs/{id}/validate
```

Risk:
Coding agents may implement inconsistent routes.

Recommendation:

KS-008 must be upgraded to match PRD endpoint structure exactly.

Status:

Build blocker before API implementation.

---

### Gap 2: upload endpoint underdefined

PRD defines job media upload.

KS-008 does not fully specify:

- multipart handling
- file count limit
- file type limit
- private bucket path
- credential validation

Recommendation:

Expand KS-008 before implementation or create KS-011 API Final Contracts.

---

### Gap 3: admin settings APIs are missing from KS-008

PRD includes:

- categories settings
- localities settings
- invite codes

KS-008 only lightly covers these.

Recommendation:

Add full admin settings endpoints before building admin panel.

---

### Gap 4: worker document APIs too light

PRD requires:

```text
POST /api/worker/documents
```

KS-008 mentions worker documents but not complete request/response details.

Recommendation:

Add final contract for worker document upload.

---

# 7. API vs RLS Audit

## 7.1 Strong Alignment

RLS design correctly supports:

- no direct anonymous table access
- public actions through route handlers
- workers seeing own profiles
- workers seeing own offers
- workers seeing assigned jobs
- admin full control
- private storage buckets
- service role server-only usage

## 7.2 Gaps Found

### Gap 1: Public APIs need service role usage clarity

KS-007 correctly says public customer actions use service role.

KS-008 does not clearly mark which APIs require service role.

Recommendation:

Each API contract should specify:

```text
Database access mode:
- anon client
- user session
- service role
```

Public APIs should use service role server-side.

---

### Gap 2: Worker status update must not bypass state machine

RLS allows worker assigned job read access, but updates must go through route handlers.

Recommendation:

Do not allow worker direct UPDATE on jobs.

Worker job status routes must use server validation.

---

### Gap 3: Admin broad access must not equal unsafe deletion

RLS allows admin full access conceptually.

But app must still prevent:

- deleting jobs
- deleting payments
- deleting complaints
- deleting activity_logs

Recommendation:

Admin UI should not expose delete actions for operational records.

---

# 8. Sprint Plan Audit

## 8.1 Strong Alignment

Sprint sequence is directionally correct:

```text
Foundation
↓
Database & Security
↓
Worker Module
↓
Customer Request Flow
↓
Admin Operations
↓
Dispatch
↓
Job Lifecycle
↓
Closed Beta
```

## 8.2 Dependency Issues

### Issue 1: Admin must exist earlier

Current sprint order builds Worker Module before Admin Operations.

But worker approval requires admin.

Recommendation:

Split Admin into two phases:

```text
Sprint 2A: Minimal Admin Shell + Worker Approval
Sprint 2B: Worker Module
```

or move admin approval before full worker module.

---

### Issue 2: API contracts should be finalized before sprint execution

KS-008 is not detailed enough compared with PRD.

Recommendation:

Before coding:

```text
KS-008A API Contracts Final Pass
```

or include it in KS-011 Build Pack.

---

### Issue 3: SQL migrations missing

Sprint 1 says implement schema, but no SQL migration pack exists yet.

Recommendation:

Create:

```text
KS-011 Supabase SQL Migration Pack v1.0
```

before coding Sprint 1.

---

# 9. Missing Components

## 9.1 Required Before Coding

| Missing Component | Importance | Action |
|---|---|---|
| Final SQL migrations | Critical | Create KS-011 |
| Final API route map | Critical | Upgrade KS-008 or create KS-012 |
| Repository structure | Critical | Create KS-013 |
| Environment variable list | High | Include in repo document |
| Supabase storage bucket policy details | High | Add in SQL/RLS implementation pack |
| Seed data SQL | High | Include in SQL migration pack |
| Test checklist by sprint | Medium | Add to sprint execution pack |

---

# 10. Security Risks

## Risk 1: Service role misuse

If AI agents use service role in client components, database is compromised.

Mitigation:
Repository standards must define:

```text
service role only in server-only files
```

## Risk 2: Public access accidentally enabled

Mitigation:
No direct Supabase browser calls for public customer operations.

## Risk 3: KYC documents exposed

Mitigation:
Private bucket only.

## Risk 4: Activity logs polluted with sensitive data

Mitigation:
Whitelist metadata.

## Risk 5: Worker sees wrong job

Mitigation:
Assigned worker check in both RLS and route handler.

---

# 11. Data Integrity Risks

## Risk 1: Multiple active dispatch offers

Mitigation:
Partial unique index:

```text
unique active sent offer per job
```

## Risk 2: Job closed without payment

Mitigation:
Status transition rule:

```text
completed → closed only if payment is admin_confirmed_paid or waived
```

## Risk 3: Duplicate customer request spam

Mitigation:
Server-side duplicate check:

```text
same phone + category + address within 30 minutes
```

## Risk 4: Duplicate rating

Mitigation:
Unique constraint on ratings.job_id.

## Risk 5: Duplicate complaint

Mitigation:
Unique constraint on complaints.job_id in MVP.

---

# 12. Operational Risks

## Risk 1: Too many admin screens in first build

Mitigation:
Build minimal admin first:

- login
- dashboard
- worker approval
- job queue
- job detail
- dispatch

Payment/complaint screens can be basic lists first.

## Risk 2: Worker onboarding before categories/localities seed

Mitigation:
Seed categories and localities before worker module.

## Risk 3: Customer flow before dispatch works

Mitigation:
Customer request can be built early, but real beta traffic starts only after dispatch is tested.

---

# 13. Build Blockers

The following must be resolved before coding begins:

## Blocker 1: Final SQL migration document missing

Required:
KS-011 Supabase SQL Migration Pack v1.0

## Blocker 2: API route naming inconsistency

Required:
API contracts must match PRD route names.

## Blocker 3: Repository standards missing

Required:
KS-012 Repository Structure & Engineering Standards v1.0

## Blocker 4: RLS implementation SQL missing

Required:
RLS SQL must be created after schema SQL.

## Blocker 5: Seed data not finalized

Required:
Founder must confirm first localities and five categories.

---

# 14. Recommended Corrections

## Correction 1: Upgrade API document

Replace simplified KS-008 routes with PRD-accurate route contracts.

## Correction 2: Create SQL implementation pack

Create SQL files:

```text
001_extensions.sql
002_enums.sql
003_tables.sql
004_indexes.sql
005_triggers.sql
006_storage.sql
007_rls.sql
008_seed.sql
```

## Correction 3: Create repository structure document

Define:

- folder structure
- server-only files
- Supabase clients
- route conventions
- validation structure
- error handling
- test placement

## Correction 4: Adjust sprint order

Updated sprint order:

```text
Sprint 0: Repo + Environment
Sprint 1: Schema + RLS + Seed
Sprint 2: Admin Minimal Shell
Sprint 3: Worker Onboarding
Sprint 4: Customer Request Flow
Sprint 5: Dispatch + Assignment
Sprint 6: Job Lifecycle + Payment + Rating + Complaint
Sprint 7: Beta Hardening
```

---

# 15. Updated Build Order

Recommended from this point:

```text
KS-010 Architecture Audit ✅
↓
KS-011 Repository Structure & Engineering Standards
↓
KS-012 Supabase SQL Migration Pack
↓
KS-013 API Contracts Final Pass
↓
KS-014 UI Route & Screen Spec
↓
KS-015 Build Task Pack
↓
Coding Sprint 0
```

Alternative:

If speed is needed, KS-011 and KS-012 may be created first, then API final pass.

But do not start coding before repository standards and SQL migrations exist.

---

# 16. Go / No-Go Decision

## Current Decision

```text
NO-GO for coding immediately.
GO for implementation preparation.
```

Reason:

The architecture direction is correct, but implementation artifacts are not yet final.

## Required to Move to Coding

- Final repository structure
- SQL migration pack
- final API route map
- RLS SQL implementation
- seed data
- environment variable plan

---

# 17. Final CTO Verdict

KaamSetu is architecturally ready in concept but not yet ready for direct coding.

The product scope is strong.  
The stack is correct.  
The MVP is well-contained.  
The security model is directionally correct.  

But the engineering documents need one final implementation-prep layer.

The next correct move is:

```text
KS-011 Repository Structure & Engineering Standards v1.0
```

After that:

```text
KS-012 Supabase SQL Migration Pack v1.0
```

Then:

```text
KS-013 API Contracts Final Pass v1.0
```

Only after these should AI coding agents begin implementation.

---

# Final Status

```text
Research Phase: Closed
Strategy Phase: Closed
Product Definition Phase: Closed
Architecture Audit: Complete
Build Preparation Phase: Started
```
