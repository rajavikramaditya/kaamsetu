# KS-006 Database Schema v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** Engineering Architecture Document  
**Version:** 1.0  
**Status:** MVP Scope Locked  
**Owner:** Founder / CTO  
**Stack:** Next.js + TypeScript + Supabase PostgreSQL + Supabase Storage + Vercel  
**Last Updated:** 2026-06-04  

---

## Table of Contents

1. Document Purpose  
2. Scope Boundary  
3. Database Architecture Overview  
4. Naming Conventions  
5. Schema Principles  
6. PostgreSQL Extensions  
7. Enum Definitions  
8. Core Entity Map  
9. Table Specifications  
10. Relationships and Foreign Keys  
11. Constraints  
12. Index Strategy  
13. Audit Strategy  
14. Soft Delete Strategy  
15. Storage Architecture  
16. Supabase Considerations  
17. Data Retention Policy  
18. Migration Order  
19. Seed Data Requirements  
20. Deferred Tables  
21. Future Expansion Notes  
22. Schema Freeze Checklist  

---

# 1. Document Purpose

This document defines the official database schema specification for **KaamSetu MVP v1.0**.

It is intended for:

- AI coding agents
- Supabase implementation
- SQL migration generation
- RLS policy generation
- API contract generation
- Sprint planning
- Future technical audits

This document does **not** define business strategy, market research, UI design, or monetization theory.

---

# 2. Scope Boundary

## Included in MVP

KaamSetu v1.0 database supports:

- Invite-gated customer request creation
- Anonymous customer job tracking
- Worker onboarding
- Worker document upload metadata
- Admin-controlled worker approval
- Service categories
- Localities
- Job creation
- Dispatch attempts
- Worker assignment
- Job status lifecycle
- Payment recording
- Customer ratings
- Complaints
- Activity logging

## Explicitly Excluded from MVP

The following database areas must **not** be created in MVP:

- Wallets
- Escrow
- Subscription billing
- Referral system
- Coupon system
- Ads
- Chat messages
- Live location tracking
- Route tracking
- Push notification outbox
- IVR records
- WhatsApp automation tables
- AI recommendation tables
- Full analytics warehouse
- Native app device registry

These are postponed until after 100 jobs or 1000 jobs depending on product need.

---

# 3. Database Architecture Overview

KaamSetu v1.0 uses a single Supabase PostgreSQL database.

The architecture is:

```text
Customer PWA
Worker PWA
Admin Panel
        ↓
Next.js Route Handlers
        ↓
Supabase PostgreSQL
        ↓
Supabase Storage
```

Important rule:

> Public clients should not directly mutate sensitive tables. All business mutations should pass through Next.js route handlers.

Supabase Row Level Security will be used as the security boundary, but application-level validation will still live in route handlers.

---

# 4. Naming Conventions

## Table Names

Use plural snake_case names:

- worker_profiles
- customer_profiles
- dispatch_attempts
- activity_logs

## Column Names

Use snake_case:

- created_at
- updated_at
- assigned_worker_id
- payment_status

## Primary Keys

Every application table uses:

```sql
id uuid primary key
```

## Timestamps

Use:

```sql
timestamptz
```

not plain timestamp.

## Money Fields

Use:

```sql
numeric(10,2)
```

for amount values.

## Text Enums

For MVP speed, controlled state fields may use PostgreSQL enums or constrained text. PostgreSQL enums are recommended for lifecycle states.

---

# 5. Schema Principles

## 5.1 Jobs Are the Center of Gravity

The `jobs` table is the central operational table. Most tables either belong to a job or support job execution.

## 5.2 One Job = One Active Worker Assignment

In MVP, a job can only have one assigned worker.

## 5.3 Serial Dispatch Only

At any time, one job can have only one active dispatch offer.

No parallel bidding.  
No open marketplace bidding.  
No public worker selection.

## 5.4 Customer Account Not Required

Customers do not need Supabase Auth in MVP.

Customer access is based on:

- job_ref / public_id
- phone
- track_code

The raw track code must never be stored.

## 5.5 Worker and Admin Auth Required

Workers and admins use Supabase Auth.

Worker UI may show phone + password, but internally this can map to a deterministic auth email alias.

## 5.6 Audit Everything Important

Every important mutation must create an `activity_logs` row.

If the system cannot prove what happened, it did not happen.

---

# 6. PostgreSQL Extensions

Recommended extensions:

| Extension | Purpose |
|---|---|
| pgcrypto | UUID generation and hashing utilities |
| uuid-ossp | Optional UUID support if preferred |
| citext | Case-insensitive fields such as invite codes |
| pg_trgm | Optional future fuzzy search |

MVP minimum:

```sql
pgcrypto
```

---

# 7. Enum Definitions

## 7.1 booking_status

| Value | Meaning |
|---|---|
| requested | Customer request created |
| validated | Admin reviewed and request is dispatch-ready |
| dispatching | Worker dispatch has started |
| assigned | Worker assigned but work not started |
| in_progress | Worker started job |
| completed | Work completed but not fully closed |
| disputed | Job has active complaint or dispute |
| closed | Final successful terminal state |
| cancelled | Terminal non-completion state |

---

## 7.2 dispatch_status

| Value | Meaning |
|---|---|
| not_started | No dispatch started |
| offer_pending | One worker offer is currently active |
| assigned | Worker assignment completed |
| failed | No suitable worker found |
| stopped | Dispatch paused or cancelled |

---

## 7.3 payment_status

| Value | Meaning |
|---|---|
| not_due | Payment not yet payable |
| due | Payment expected after completion |
| payment_link_sent | Manual payment link shared |
| customer_marked_paid | Customer or worker reported payment |
| admin_confirmed_paid | Founder confirmed payment |
| failed | Payment failed or disputed |
| waived | Payment intentionally waived |

---

## 7.4 complaint_status

| Value | Meaning |
|---|---|
| open | Complaint newly created |
| under_review | Admin investigating |
| resolved | Complaint accepted and resolved |
| dismissed | Complaint rejected or no action needed |
| closed | Terminal complaint state |

---

## 7.5 approval_status

| Value | Meaning |
|---|---|
| invited | Worker record created by admin |
| draft | Worker profile started |
| under_review | Worker submitted profile/docs |
| approved | Worker can receive jobs |
| rejected | Worker rejected |
| suspended | Worker blocked from work |

---

## 7.6 pricing_type

| Value | Meaning |
|---|---|
| fixed_price | Simple fixed-price task |
| quote_required | Variable-scope job requiring quote |
| daily_wage | Labour/shift-based work |

---

## 7.7 request_source

| Value | Meaning |
|---|---|
| pwa | Customer submitted through PWA |
| whatsapp_assisted | Founder entered request from WhatsApp |
| call_assisted | Founder entered request from phone call |
| admin_manual | Founder manually created request |

---

## 7.8 payment_method

| Value | Meaning |
|---|---|
| cash | Customer paid worker directly in cash |
| upi | Customer paid via UPI |
| razorpay_link | Customer paid through manual Razorpay link |
| bank_transfer | Customer paid by bank transfer |
| waived | Payment waived |

---

# 8. Core Entity Map

```text
auth.users
   ↓
worker_profiles
   ↓
worker_documents

customer_profiles
   ↓
jobs
   ↓
job_media
   ↓
dispatch_attempts
   ↓
payments
   ↓
ratings
   ↓
complaints

service_categories → jobs
localities → jobs
invite_codes → jobs

activity_logs → all important entities
```

---

# 9. Table Specifications

---

## 9.1 auth.users

Supabase-managed authentication table.

KaamSetu does not manually create this table.

### Used For

- Admin login
- Worker login

### Referenced By

- worker_profiles.auth_user_id
- activity_logs.actor_user_id
- worker_documents.verified_by
- payments.confirmed_by
- complaints.resolved_by

---

## 9.2 customer_profiles

Stores customer identity for request tracking without requiring customer login.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| auth_user_id | uuid | Yes | null | Reserved for future customer accounts |
| full_name | text | No | none | 2–80 chars |
| phone | text | No | none | Indian 10-digit mobile |
| alternate_phone | text | Yes | null | Optional |
| language_code | text | No | 'hi' | MVP default Hindi |
| locality_id | uuid | No | none | FK to localities |
| default_address_text | text | Yes | null | Customer address |
| landmark | text | Yes | null | Optional |
| invite_code_id | uuid | Yes | null | Last used invite code |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- phone must be normalized before saving.
- full_name length between 2 and 80.
- language_code should be `hi` or `en` in MVP.

### Relationships

- localities.id → customer_profiles.locality_id
- invite_codes.id → customer_profiles.invite_code_id

### Notes

Customer duplicates are allowed cautiously in MVP because customers do not log in. Application logic should upsert by normalized phone where appropriate.

---

## 9.3 worker_profiles

Stores worker identity, service metadata, verification status, and operational availability.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| auth_user_id | uuid | No | none | FK to auth.users |
| worker_code | text | No | generated | Human-readable worker code |
| full_name | text | No | none | Worker name |
| phone | text | No | none | Unique mobile |
| whatsapp_number | text | Yes | null | Optional but recommended |
| locality_id | uuid | No | none | Primary locality |
| address_text | text | Yes | null | Worker address |
| primary_category_id | uuid | No | none | FK to service_categories |
| secondary_category_ids | uuid[] | Yes | null | Max 2 categories |
| supported_job_modes | text[] | No | default array | fixed, quote, daily_wage |
| years_experience | integer | Yes | 0 | 0–40 |
| has_own_tools | boolean | No | false | Worker tool availability |
| government_id_type | text | Yes | null | Aadhaar/Voter/Other |
| government_id_last4 | text | Yes | null | Last 4 only |
| approval_status | approval_status | No | invited | Lifecycle |
| rejection_reason | text | Yes | null | Required when rejected |
| is_available | boolean | No | true | Manual availability |
| badge_status | text | No | 'pending' | pending/probation/verified/paused |
| approved_at | timestamptz | Yes | null | Admin approval time |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- phone unique.
- worker_code unique.
- auth_user_id unique.
- years_experience between 0 and 40.
- secondary_category_ids max length 2 enforced in application or DB check.
- government_id_last4 must be 4 digits if present.

### Relationships

- auth.users.id → worker_profiles.auth_user_id
- localities.id → worker_profiles.locality_id
- service_categories.id → worker_profiles.primary_category_id

### Notes

`is_available` is included from day one because dispatch requires knowing whether the worker can currently take jobs.

---

## 9.4 worker_documents

Stores private Storage metadata for worker KYC documents.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| worker_profile_id | uuid | No | none | FK to worker_profiles |
| document_type | text | No | none | profile_photo, government_id_front, government_id_back |
| storage_path | text | No | none | Supabase private bucket path |
| mime_type | text | No | none | File MIME |
| file_size_bytes | integer | No | none | File size |
| verification_status | text | No | 'pending' | pending/approved/rejected |
| verified_by | uuid | Yes | null | Admin auth user |
| verified_at | timestamptz | Yes | null | Verification time |
| rejection_reason | text | Yes | null | If rejected |
| created_at | timestamptz | No | now() | Audit |

### Constraints

- file_size_bytes <= 5MB in server validation.
- allowed MIME types: image/jpeg, image/png, image/webp, application/pdf.
- document_type must be controlled.

### Relationships

- worker_profiles.id → worker_documents.worker_profile_id
- auth.users.id → worker_documents.verified_by

---

## 9.5 service_categories

Seeded list of service types supported in beta.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| slug | text | No | none | Unique stable key |
| name_en | text | No | none | English label |
| name_hi | text | Yes | null | Hindi label |
| pricing_type_default | pricing_type | No | fixed_price | Default pricing |
| requires_shift_fields | boolean | No | false | For labour category |
| is_active | boolean | No | true | Admin control |
| sort_order | integer | No | 100 | UI order |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Initial Seed Categories

- electrician
- plumber
- carpenter
- ac_appliance_repair
- helper_labour

No more than five categories should be active in beta.

---

## 9.6 localities

Serviceable locality list for one launch cluster.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| city | text | No | 'Orai' | Launch city |
| state | text | No | 'Uttar Pradesh' | State |
| name | text | No | none | Locality name |
| pincode | text | Yes | null | Optional |
| is_serviceable | boolean | No | true | Can accept new requests |
| is_active | boolean | No | true | Visible in UI |
| sort_order | integer | No | 100 | UI order |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Notes

Existing jobs remain valid if a locality is later deactivated.

---

## 9.7 invite_codes

Controls closed-beta access.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| code | text/citext | No | generated | Unique invite code |
| code_type | text | No | customer | customer/worker/internal |
| locality_id | uuid | Yes | null | Optional locality-bound code |
| max_uses | integer | No | 1 | Usage limit |
| used_count | integer | No | 0 | Current use count |
| expires_at | timestamptz | Yes | null | Optional expiry |
| is_active | boolean | No | true | Gate control |
| created_by | uuid | Yes | null | Admin auth user |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- code unique.
- used_count <= max_uses.
- max_uses > 0.

### Relationships

- localities.id → invite_codes.locality_id
- auth.users.id → invite_codes.created_by

---

## 9.8 jobs

Master operational table for every customer request.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| public_id | text | No | generated | Customer-facing public ID |
| job_ref | text | No | generated | Human readable, e.g. KS-000123 |
| tracking_code_hash | text | No | none | Hash only, never raw code |
| customer_profile_id | uuid | No | none | FK |
| invite_code_id | uuid | Yes | null | FK |
| service_category_id | uuid | No | none | FK |
| locality_id | uuid | No | none | FK |
| request_source | request_source | No | pwa | Source channel |
| pricing_type | pricing_type | No | fixed_price | Pricing mode |
| description | text | No | none | 20–500 chars |
| address_text | text | No | none | 10–250 chars |
| landmark | text | Yes | null | Optional |
| preferred_date | date | Yes | null | Today to +30 days |
| preferred_time_slot | text | No | none | controlled text |
| workers_needed | integer | Yes | null | Required for daily wage |
| shift_type | text | Yes | null | half_day/full_day |
| booking_status | booking_status | No | requested | Lifecycle |
| dispatch_status | dispatch_status | No | not_started | Lifecycle |
| payment_status | payment_status | No | not_due | Lifecycle |
| complaint_status | text | No | 'none' | none/open/resolved etc. |
| assigned_worker_id | uuid | Yes | null | Worker FK |
| assigned_dispatch_attempt_id | uuid | Yes | null | Dispatch FK |
| estimated_amount | numeric(10,2) | Yes | null | Admin triage |
| final_amount | numeric(10,2) | Yes | null | Final amount |
| worker_payable_amount | numeric(10,2) | Yes | null | Optional |
| estimated_duration_hours | integer | Yes | null | MVP-added operational field |
| customer_payment_preference | text | No | either | cash/upi/either |
| admin_notes | text | Yes | null | Internal |
| status_reason | text | Yes | null | Cancellation/dispute reason |
| requested_at | timestamptz | No | now() | Request time |
| assigned_at | timestamptz | Yes | null | Assignment time |
| started_at | timestamptz | Yes | null | Work start |
| completed_at | timestamptz | Yes | null | Work completion |
| closed_at | timestamptz | Yes | null | Final closure |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- public_id unique.
- job_ref unique.
- description length between 20 and 500.
- final_amount >= 0 if present.
- estimated_amount >= 0 if present.
- estimated_duration_hours > 0 if present.
- workers_needed between 1 and 20 if present.
- assigned_worker_id must be approved worker by application validation.

### Relationships

- customer_profiles.id → jobs.customer_profile_id
- invite_codes.id → jobs.invite_code_id
- service_categories.id → jobs.service_category_id
- localities.id → jobs.locality_id
- worker_profiles.id → jobs.assigned_worker_id
- dispatch_attempts.id → jobs.assigned_dispatch_attempt_id

### Notes

This is the most important table in KaamSetu v1.0.

---

## 9.9 job_media

Stores metadata for job issue photos and completion evidence.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| job_id | uuid | No | none | FK |
| uploaded_by_role | text | No | none | customer/worker/admin |
| uploaded_by_user_id | uuid | Yes | null | Auth user if available |
| media_kind | text | No | issue_photo | issue_photo/completion_photo |
| storage_path | text | No | none | Private bucket path |
| mime_type | text | No | none | File type |
| file_size_bytes | integer | No | none | Size |
| created_at | timestamptz | No | now() | Audit |

### Constraints

- Max 3 issue photos per job in application logic.
- Max 5 MB per file.
- Allowed image types only for public uploads.

### Relationships

- jobs.id → job_media.job_id
- auth.users.id → job_media.uploaded_by_user_id

---

## 9.10 dispatch_attempts

Tracks every worker offer sent for a job.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| job_id | uuid | No | none | FK |
| worker_profile_id | uuid | No | none | FK |
| offer_status | text | No | sent | sent/accepted/declined/expired/withdrawn |
| contact_method | text | No | whatsapp_manual | whatsapp_manual/call/manual |
| offered_amount | numeric(10,2) | Yes | null | Optional |
| offer_expires_at | timestamptz | Yes | null | Optional |
| response_note | text | Yes | null | Worker/admin note |
| sent_at | timestamptz | No | now() | Sent time |
| responded_at | timestamptz | Yes | null | Response time |
| created_by_admin_id | uuid | No | none | Admin auth user |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- Only one active `sent` offer per job should exist.
- worker_profile_id must reference an approved worker by application validation.

### Relationships

- jobs.id → dispatch_attempts.job_id
- worker_profiles.id → dispatch_attempts.worker_profile_id
- auth.users.id → dispatch_attempts.created_by_admin_id

### Critical Rule

Serial dispatch is mandatory in MVP.

---

## 9.11 payments

Single current payment record per job.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| job_id | uuid | No | none | Unique FK |
| amount | numeric(10,2) | No | 0 | Final amount |
| payment_method | payment_method | Yes | null | cash/upi/link |
| status | payment_status | No | not_due | Lifecycle |
| link_url | text | Yes | null | Manual Razorpay link |
| external_reference | text | Yes | null | UPI ref etc. |
| reported_by_role | text | Yes | null | customer/worker/admin |
| reported_by_user_id | uuid | Yes | null | If auth user |
| reported_at | timestamptz | Yes | null | Report time |
| confirmed_by | uuid | Yes | null | Admin |
| confirmed_at | timestamptz | Yes | null | Confirmation time |
| note | text | Yes | null | Admin note |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- One payment per job in MVP.
- amount >= 0.
- external_reference required for some non-cash methods by application validation.

### Relationships

- jobs.id → payments.job_id
- auth.users.id → payments.confirmed_by
- auth.users.id → payments.reported_by_user_id

---

## 9.12 ratings

Customer-to-worker rating after job closure.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| job_id | uuid | No | none | Unique FK |
| customer_profile_id | uuid | No | none | FK |
| worker_profile_id | uuid | No | none | FK |
| overall_rating | smallint | No | none | 1–5 |
| punctuality_rating | smallint | Yes | null | 1–5 |
| behavior_rating | smallint | Yes | null | 1–5 |
| quality_rating | smallint | Yes | null | 1–5 |
| review_text | text | Yes | null | Max 300 |
| created_at | timestamptz | No | now() | Audit |

### Constraints

- One rating per job.
- All ratings must be between 1 and 5.

### Relationships

- jobs.id → ratings.job_id
- customer_profiles.id → ratings.customer_profile_id
- worker_profiles.id → ratings.worker_profile_id

---

## 9.13 complaints

Single complaint record per job in MVP.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| complaint_ref | text | No | generated | Unique reference |
| job_id | uuid | No | none | Unique FK |
| customer_profile_id | uuid | Yes | null | FK |
| worker_profile_id | uuid | Yes | null | FK |
| complaint_type | text | No | none | controlled text |
| description | text | No | none | 20–500 chars |
| status | complaint_status | No | open | Lifecycle |
| resolution_note | text | Yes | null | Required on resolution |
| resolved_by | uuid | Yes | null | Admin |
| resolved_at | timestamptz | Yes | null | Resolution time |
| created_at | timestamptz | No | now() | Audit |
| updated_at | timestamptz | No | now() | Audit |

### Constraints

- One complaint per job in MVP.
- description length between 20 and 500.

### Relationships

- jobs.id → complaints.job_id
- customer_profiles.id → complaints.customer_profile_id
- worker_profiles.id → complaints.worker_profile_id
- auth.users.id → complaints.resolved_by

---

## 9.14 activity_logs

Immutable audit trail for all important actions.

### Columns

| Column | Type | Nullable | Default | Notes |
|---|---:|---:|---:|---|
| id | uuid | No | gen_random_uuid() | Primary key |
| actor_type | text | No | none | customer/worker/admin/system |
| actor_user_id | uuid | Yes | null | Auth user if available |
| actor_label | text | Yes | null | Safe display label |
| entity_type | text | No | none | jobs/workers/payments/etc. |
| entity_id | uuid | Yes | null | Related entity ID |
| action | text | No | none | action name |
| source | text | No | web | web/worker/admin/system |
| metadata | jsonb | No | '{}' | Safe metadata only |
| ip_hash | text | Yes | null | Hashed IP if needed |
| user_agent | text | Yes | null | Optional |
| created_at | timestamptz | No | now() | Audit |

### Rules

- Never store raw passwords.
- Never store full government ID.
- Never store raw tracking code.
- Do not allow updates or deletes through app roles.

### Critical Actions to Log

- Invite validation failures after threshold
- Request creation
- Worker profile update
- Worker document upload
- Worker approval/rejection
- Dispatch attempt creation
- Dispatch response
- Job assignment
- Job status change
- Payment status change
- Complaint creation
- Complaint resolution
- Settings changes

---

# 10. Relationships and Foreign Keys

## Primary Relationships

| From Table | Column | To Table |
|---|---|---|
| customer_profiles | locality_id | localities.id |
| customer_profiles | invite_code_id | invite_codes.id |
| worker_profiles | auth_user_id | auth.users.id |
| worker_profiles | locality_id | localities.id |
| worker_profiles | primary_category_id | service_categories.id |
| worker_documents | worker_profile_id | worker_profiles.id |
| jobs | customer_profile_id | customer_profiles.id |
| jobs | invite_code_id | invite_codes.id |
| jobs | service_category_id | service_categories.id |
| jobs | locality_id | localities.id |
| jobs | assigned_worker_id | worker_profiles.id |
| jobs | assigned_dispatch_attempt_id | dispatch_attempts.id |
| job_media | job_id | jobs.id |
| dispatch_attempts | job_id | jobs.id |
| dispatch_attempts | worker_profile_id | worker_profiles.id |
| payments | job_id | jobs.id |
| ratings | job_id | jobs.id |
| ratings | customer_profile_id | customer_profiles.id |
| ratings | worker_profile_id | worker_profiles.id |
| complaints | job_id | jobs.id |
| complaints | customer_profile_id | customer_profiles.id |
| complaints | worker_profile_id | worker_profiles.id |

---

# 11. Constraints

## Global Constraints

- All primary keys use UUID.
- All important operational tables contain created_at.
- Mutable operational tables contain updated_at.
- Raw tracking codes are never stored.
- Raw passwords are never stored.
- Full Aadhaar or full government ID number is never stored.

## Job Constraints

- One job has one assigned worker in MVP.
- One job has one payment record.
- One job has one customer rating.
- One job has one complaint record.
- One job cannot have multiple active dispatch offers.

## Worker Constraints

- One auth user maps to one worker profile.
- One phone number maps to one worker profile.
- Only approved workers can receive dispatch offers.

---

# 12. Index Strategy

## Required MVP Indexes

| Index | Table | Columns | Purpose |
|---|---|---|---|
| idx_customer_phone | customer_profiles | phone | Lookup/upsert |
| idx_worker_phone | worker_profiles | phone | Login/admin search |
| idx_worker_locality | worker_profiles | locality_id | Dispatch filtering |
| idx_worker_category | worker_profiles | primary_category_id | Dispatch filtering |
| idx_worker_approval | worker_profiles | approval_status | Admin approval queue |
| idx_jobs_ref | jobs | job_ref | Public lookup |
| idx_jobs_public_id | jobs | public_id | Public route lookup |
| idx_jobs_customer | jobs | customer_profile_id | Customer history |
| idx_jobs_worker | jobs | assigned_worker_id | Worker jobs |
| idx_jobs_status | jobs | booking_status, dispatch_status, payment_status | Admin queues |
| idx_jobs_locality | jobs | locality_id | Microzone filtering |
| idx_dispatch_job | dispatch_attempts | job_id | Dispatch history |
| idx_dispatch_worker | dispatch_attempts | worker_profile_id | Worker offers |
| idx_payment_job | payments | job_id | Payment lookup |
| idx_payment_status | payments | status | Ledger queue |
| idx_complaint_job | complaints | job_id | Complaint lookup |
| idx_complaint_status | complaints | status | Complaint queue |
| idx_activity_entity | activity_logs | entity_type, entity_id | Audit lookup |
| idx_activity_created | activity_logs | created_at | Audit filtering |

## Optional Later Indexes

- Trigram search on customer names
- Trigram search on worker names
- Materialized metrics view indexes

Not required for MVP.

---

# 13. Audit Strategy

## Audit Fields

All mutable tables should include:

- created_at
- updated_at

Important actor-driven actions must create `activity_logs`.

## Updated At Trigger

A reusable database trigger should update `updated_at` automatically.

Applies to:

- customer_profiles
- worker_profiles
- service_categories
- localities
- invite_codes
- jobs
- dispatch_attempts
- payments
- complaints

---

# 14. Soft Delete Strategy

MVP should avoid physical deletion for operational records.

## Do Not Delete

- jobs
- payments
- complaints
- ratings
- dispatch_attempts
- activity_logs

## Status-Based Deactivation

Use status fields instead:

- worker_profiles.approval_status = suspended
- service_categories.is_active = false
- localities.is_active = false
- invite_codes.is_active = false
- jobs.booking_status = cancelled

## Future Soft Delete Column

A `deleted_at` column may be added later if required, but it is not necessary for MVP.

---

# 15. Storage Architecture

Supabase Storage buckets:

## worker-documents

Purpose:
Private KYC and onboarding files.

Access:
- Worker can upload own docs.
- Admin can view/review.
- Public cannot access.

## job-media

Purpose:
Customer issue photos and worker completion photos.

Access:
- Customer uploads via server route.
- Worker uploads completion photos for assigned jobs.
- Admin can view.
- Public direct access denied.

## File Rules

- Max file size: 5 MB
- Customer issue photo max count: 3
- Allowed job image types:
  - image/jpeg
  - image/png
  - image/webp
- Worker document types:
  - image/jpeg
  - image/png
  - image/webp
  - application/pdf

---

# 16. Supabase Considerations

## 16.1 RLS

RLS must be enabled on all public schema tables.

## 16.2 Service Role

Next.js server routes may use Supabase service role only for controlled server-side operations.

Service role must never be exposed to browser/client code.

## 16.3 Auth

Customer auth is not used in MVP.

Worker/admin auth uses Supabase Auth.

## 16.4 Free Tier Limits

Because MVP may run on free tiers:

- Limit photo uploads.
- Avoid realtime.
- Avoid large logs in metadata.
- Export backups regularly.
- Keep activity metadata small.

---

# 17. Data Retention Policy

## MVP Retention

| Data Type | Retention |
|---|---|
| Jobs | Keep indefinitely during beta |
| Payments | Keep indefinitely during beta |
| Complaints | Keep indefinitely during beta |
| Ratings | Keep indefinitely during beta |
| Activity logs | Keep at least 12 months |
| Worker documents | Keep while worker active, review later |
| Job media | Keep during beta, review after 100 jobs |

## Sensitive Data Principle

Store the minimum possible sensitive data.

Do not store:

- Full Aadhaar number
- Raw tracking code
- Raw passwords
- Unnecessary identity data

---

# 18. Migration Order

Recommended migration sequence:

1. Enable extensions
2. Create enum types
3. Create localities
4. Create service_categories
5. Create invite_codes
6. Create customer_profiles
7. Create worker_profiles
8. Create worker_documents
9. Create jobs
10. Create job_media
11. Create dispatch_attempts
12. Add assigned_dispatch_attempt_id FK if circular dependency requires second pass
13. Create payments
14. Create ratings
15. Create complaints
16. Create activity_logs
17. Create indexes
18. Create updated_at trigger
19. Enable RLS
20. Add RLS policies in KS-007

---

# 19. Seed Data Requirements

## Required Seed Data

### service_categories

- electrician
- plumber
- carpenter
- ac_appliance_repair
- helper_labour

### localities

Founder must define 3–5 Orai launch localities before public beta.

Example placeholders:

- Rath Road
- Bus Stand Area
- Station Area
- Rajendra Nagar
- Tulsi Nagar

These must be verified before production use.

### invite_codes

Create founder-controlled test invite codes only.

---

# 20. Deferred Tables

Do not create these in MVP:

| Table | Delay Until |
|---|---|
| wallets | Not before legal/payment architecture review |
| wallet_ledger | Not before platform-held payments |
| subscriptions | After 1000 jobs |
| referrals | After 100 jobs |
| coupons | After 100 jobs |
| chat_messages | Not planned for MVP |
| notification_outbox | After automation need |
| route_tracking | After live maps decision |
| worker_locations | After live dispatch scale |
| settlement_batches | After platform payout automation |
| b2b_accounts | After first household beta or if B2B manually proves demand |
| analytics_events | After 1000 jobs |
| app_devices | After native app or push notifications |

---

# 21. Future Expansion Notes

## After 100 Jobs

Potential additions:

- Customer saved addresses
- Repeat booking shortcut
- Worker-to-customer rating
- Basic analytics charts
- Simple export reports
- Basic referral tracking

## After 1000 Jobs

Potential additions:

- WhatsApp API automation
- Push notifications
- Native Android app wrapper
- Automated dispatch ranking
- Payment gateway integration
- B2B accounts
- Worker memberships
- Settlement automation

None of these should be added before MVP proof.

---

# 22. Schema Freeze Checklist

- [x] PWA-first schema
- [x] No customer auth required
- [x] Worker/admin auth supported
- [x] Invite-gated customer requests supported
- [x] Worker onboarding supported
- [x] Admin approval supported
- [x] Job lifecycle supported
- [x] Serial dispatch supported
- [x] Payment recording supported
- [x] Ratings supported
- [x] Complaints supported
- [x] Activity logs supported
- [x] Supabase Storage metadata supported
- [x] No wallet
- [x] No chat
- [x] No maps
- [x] No ads
- [x] No referrals
- [x] No subscriptions
- [x] No AI matching
- [x] No native app dependency

---

# Final Verdict

KS-006 Database Schema v1.0 is approved as the database specification foundation for KaamSetu MVP.

Next document:

**KS-007 Supabase RLS Policies v1.0**
