# KS-007 Supabase RLS Policies v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** Security Architecture Document  
**Version:** 1.0  
**Status:** MVP Security Layer Specification  
**Depends On:** KS-005 PRD v1.0, KS-006 Database Schema v1.0  
**Stack:** Next.js + TypeScript + Supabase PostgreSQL + Supabase Storage + Vercel  
**Last Updated:** 2026-06-04  

---

## Table of Contents

1. Document Purpose  
2. Security Philosophy  
3. Authentication Model  
4. Role Model  
5. Access Boundary Rules  
6. RLS Implementation Strategy  
7. Table Policy Matrix  
8. Table-by-Table RLS Policies  
9. Storage RLS Policies  
10. Service Role Usage Rules  
11. Public Customer Access Rules  
12. Worker Access Rules  
13. Admin Access Rules  
14. Activity Logging Security  
15. Data Exposure Rules  
16. Policy Testing Checklist  
17. Common Failure Modes  
18. Implementation Order  
19. Deferred Security Features  
20. Final RLS Freeze Checklist  

---

# 1. Document Purpose

This document defines the official Row Level Security architecture for KaamSetu MVP v1.0.

It is intended for:

- Supabase implementation
- SQL policy generation
- AI coding agents
- Security review
- API route design
- MVP launch readiness

This document does not include market research, UI design, startup strategy, or feature brainstorming.

---

# 2. Security Philosophy

KaamSetu v1.0 is a closed-beta, founder-controlled, dispatch-led platform.

Security principles:

1. **Deny by default**
2. **Expose minimum data**
3. **Customers do not directly query tables**
4. **Workers only see their own data**
5. **Admins control operations**
6. **All sensitive mutations go through server routes**
7. **Service role key is server-only**
8. **Activity logs are append-only**
9. **Storage buckets are private**
10. **No raw secrets or sensitive IDs are stored**

RLS is not optional. Every public schema table must have RLS enabled.

---

# 3. Authentication Model

## 3.1 Customer Authentication

Customers do **not** use Supabase Auth in MVP.

Customer access works through:

- job_ref
- phone
- track_code

The raw tracking code must never be stored. Store only:

```text
tracking_code_hash
```

Customer request creation, lookup, payment confirmation, rating, and complaint creation must go through Next.js route handlers.

Customers must never directly access Supabase tables from the browser.

---

## 3.2 Worker Authentication

Workers use Supabase Auth.

The UI can show:

```text
mobile number + password
```

Internally, the backend may map mobile number to deterministic auth email alias.

Worker access is limited to:

- own worker profile
- own documents
- dispatch offers sent to them
- jobs assigned to them
- media for assigned jobs
- their own earnings/payment summaries

---

## 3.3 Admin Authentication

Admins use Supabase Auth.

Admin access is determined by role metadata or a dedicated admin check.

Recommended approach:

```text
auth.users.raw_app_meta_data.role = "admin"
```

or a future `admin_users` table.

For MVP simplicity, use app metadata role.

---

# 4. Role Model

Required roles:

| Role | Auth? | Description |
|---|---:|---|
| anonymous_customer | No | Public invite-gated customer |
| worker_pending | Yes | Worker created but not approved |
| worker_verified | Yes | Approved worker |
| admin | Yes | Founder/admin |

No additional roles are required in MVP.

---

# 5. Access Boundary Rules

## 5.1 Customer Boundary

Customers cannot directly read or write:

- customer_profiles
- jobs
- payments
- ratings
- complaints
- job_media
- activity_logs

All customer actions must go through public API routes.

## 5.2 Worker Boundary

Workers can only read/update their own operational records.

Workers cannot:

- approve themselves
- see other workers
- see unrelated jobs
- see all customers
- edit payment confirmation after admin confirmation
- edit job status after closure
- view activity logs

## 5.3 Admin Boundary

Admin can manage all MVP records.

Admin must still use route handlers for controlled mutations where business rules matter.

## 5.4 Service Role Boundary

The Supabase service role key is allowed only inside secure server-side code.

Never expose service role key to:

- browser
- PWA
- client components
- public environment variables
- GitHub repository

---

# 6. RLS Implementation Strategy

## 6.1 Enable RLS on Every Public Table

Required:

```sql
alter table table_name enable row level security;
```

Tables:

- customer_profiles
- worker_profiles
- worker_documents
- service_categories
- localities
- invite_codes
- jobs
- job_media
- dispatch_attempts
- payments
- ratings
- complaints
- activity_logs

## 6.2 Use Helper Functions

Recommended helper functions:

### is_admin()

Purpose:
Check whether current authenticated user is admin.

Logic:
Check auth JWT app metadata role.

### current_worker_profile_id()

Purpose:
Return worker_profiles.id for current auth.uid().

### is_assigned_worker(job_id)

Purpose:
Check whether current worker is assigned to a job.

These helper functions reduce duplicated policy logic.

---

# 7. Table Policy Matrix

| Table | Anonymous | Worker | Admin | Service Role |
|---|---|---|---|---|
| service_categories | Read active only via API preferred | Read active | Full | Full |
| localities | Read active only via API preferred | Read active | Full | Full |
| invite_codes | No direct access | No direct access | Full | Full |
| customer_profiles | No direct access | No direct access except assigned job summary via API | Full | Full |
| worker_profiles | No direct access | Own profile read/update limited | Full | Full |
| worker_documents | No direct access | Own docs read/upload metadata | Full | Full |
| jobs | No direct access | Assigned jobs only | Full | Full |
| job_media | No direct access | Assigned job media only | Full | Full |
| dispatch_attempts | No direct access | Own offers only | Full | Full |
| payments | No direct access | Own assigned job payment summary | Full | Full |
| ratings | No direct access | Ratings for own completed jobs | Full | Full |
| complaints | No direct access | Complaints on own assigned jobs | Full | Full |
| activity_logs | No direct access | No direct access | Read only / insert through server | Full |

---

# 8. Table-by-Table RLS Policies

---

## 8.1 service_categories

### Purpose

List available service categories.

### Anonymous

No direct table access recommended.

Public API route:

```text
GET /api/public/bootstrap
```

should fetch active categories using server logic.

### Worker

Workers may read active categories.

Policy:

```text
Authenticated users can SELECT rows where is_active = true.
```

### Admin

Admins can select, insert, update.

Admin should not physically delete categories.

### Delete

No delete in MVP.

---

## 8.2 localities

### Purpose

List serviceable launch localities.

### Anonymous

No direct table access recommended.

Public API route:

```text
GET /api/public/bootstrap
```

should return active/serviceable localities.

### Worker

Workers may read active localities.

Policy:

```text
Authenticated users can SELECT rows where is_active = true.
```

### Admin

Admins can select, insert, update.

### Delete

No delete in MVP.

---

## 8.3 invite_codes

### Purpose

Closed-beta access control.

### Anonymous

No direct access.

Invite validation must happen through:

```text
POST /api/public/invite/validate
```

### Worker

No direct access.

### Admin

Admin can select, insert, update.

Admin should not delete invite codes.

### Critical Rules

- Server must validate code on request creation again.
- used_count must be incremented only after successful job creation.
- Client-side invite validation is not enough.

---

## 8.4 customer_profiles

### Purpose

Store customer identity without customer login.

### Anonymous

No direct table access.

### Worker

No direct access to customer_profiles table.

Workers receive limited customer contact information through assigned job API only.

### Admin

Admin full access.

### Service Role

Public request creation route may create/upsert customer profile using service role.

### Data Minimization

Worker APIs should not expose alternate_phone unless necessary.

---

## 8.5 worker_profiles

### Purpose

Worker identity, approval, availability, and service metadata.

### Anonymous

No access.

### Worker SELECT

Workers can read only their own profile:

```text
worker_profiles.auth_user_id = auth.uid()
```

### Worker UPDATE

Workers can update limited fields only before approval or when allowed by API.

Allowed self-edit fields:

- whatsapp_number
- address_text
- years_experience
- has_own_tools
- supported_job_modes
- is_available

Restricted fields:

- approval_status
- rejection_reason
- badge_status
- approved_at
- worker_code
- primary_category_id after approval
- government_id fields after review

Recommendation:
Use server route for worker profile updates rather than allowing wide direct updates.

### Admin

Admin full select/update/insert.

### Delete

No delete. Use approval_status = suspended.

---

## 8.6 worker_documents

### Purpose

Metadata for worker KYC files.

### Anonymous

No access.

### Worker SELECT

Worker can read metadata for their own documents only.

Condition:

```text
worker_documents.worker_profile_id = current_worker_profile_id()
```

### Worker INSERT

Worker can insert document metadata for their own profile only, preferably through server route.

### Worker UPDATE

No direct update after upload, except maybe replacement before approval via server route.

### Admin

Admin full read/update.

### Delete

No delete in MVP. Admin may mark verification_status rejected.

---

## 8.7 jobs

### Purpose

Master operational record.

### Anonymous

No direct table access.

All public actions go through token-based API routes.

### Worker SELECT

Worker can read jobs assigned to them:

```text
jobs.assigned_worker_id = current_worker_profile_id()
```

Workers may also need to read job summaries attached to their dispatch offers.

This should preferably be done through API route to avoid exposing too much customer data.

### Worker UPDATE

Workers should not directly update jobs table.

Worker job status actions must go through:

```text
POST /api/worker/jobs/{jobId}/status
```

Server route validates transitions and writes activity log.

### Admin

Admin full access.

### Delete

No delete. Use booking_status = cancelled.

---

## 8.8 job_media

### Purpose

Stores metadata for job-related files.

### Anonymous

No direct access.

Public photo upload must use route handler:

```text
POST /api/public/jobs/{publicId}/media
```

### Worker SELECT

Worker can view media only for assigned jobs.

Condition:

```text
job_media.job_id IN jobs assigned to current_worker_profile_id()
```

### Worker INSERT

Worker can insert completion photos only for assigned jobs through API route.

### Admin

Admin full access.

### Delete

No delete in MVP.

---

## 8.9 dispatch_attempts

### Purpose

Tracks worker offer history.

### Anonymous

No access.

### Worker SELECT

Worker can read dispatch attempts where:

```text
dispatch_attempts.worker_profile_id = current_worker_profile_id()
```

### Worker UPDATE

Worker should not directly update table.

Accept/decline must go through:

```text
POST /api/worker/offers/{dispatchId}/accept
POST /api/worker/offers/{dispatchId}/decline
```

Server validates:

- offer belongs to worker
- offer_status = sent
- offer not expired
- job not already assigned

### Admin

Admin full access.

### Critical Rule

There must be only one active `sent` offer per job.

This should be enforced by a partial unique index if possible.

---

## 8.10 payments

### Purpose

Payment recording and reconciliation.

### Anonymous

No direct access.

Customer payment confirmation must use public API route with job_ref + phone + track_code.

### Worker SELECT

Worker can read payment rows for jobs assigned to them.

### Worker INSERT/UPDATE

Worker should not directly write payments table.

Worker completion route may create/update payment status through server logic.

### Admin

Admin full read/update.

### Delete

No delete.

---

## 8.11 ratings

### Purpose

Customer-to-worker rating.

### Anonymous

No direct access.

Rating creation must use public API route with credentials.

### Worker SELECT

Worker can read ratings attached to their own completed jobs.

### Worker INSERT/UPDATE

No worker insert/update.

### Admin

Admin full read.

Admin should not edit ratings unless moderation is required later.

### Delete

No delete in MVP.

---

## 8.12 complaints

### Purpose

Complaint handling.

### Anonymous

No direct access.

Complaint creation must use public API route with job_ref + phone + track_code.

### Worker SELECT

Worker can read complaints related to their assigned jobs if admin decides to expose them.

Recommended MVP:
Do not expose full complaint description to worker automatically. Show only admin-managed issue status.

### Worker UPDATE

No worker update.

### Admin

Admin full read/update.

### Delete

No delete.

---

## 8.13 activity_logs

### Purpose

Immutable audit record.

### Anonymous

No access.

### Worker

No direct access.

### Admin

Admin can read.

Admin should not update/delete.

### Insert

Application server inserts activity logs.

Direct client insert should be avoided except controlled server logic.

### Delete

No delete.

### Critical Rule

activity_logs must be append-only.

---

# 9. Storage RLS Policies

Supabase Storage buckets:

- worker-documents
- job-media

Both must be private.

---

## 9.1 worker-documents bucket

### Worker Upload

Worker can upload documents only to path:

```text
worker-documents/{worker_profile_id}/...
```

where worker_profile_id belongs to auth.uid().

### Worker Read

Worker can read own document files.

### Admin Read

Admin can read all worker documents.

### Public Access

No public access.

### Delete

No client delete in MVP.

---

## 9.2 job-media bucket

### Public Upload

Customers upload through server route only.

No anonymous direct bucket insert.

### Worker Upload

Worker can upload completion photos only for assigned jobs through API route.

### Worker Read

Worker can read media for assigned jobs only.

### Admin Read

Admin can read all job media.

### Public Access

No public direct access.

---

# 10. Service Role Usage Rules

Service role may be used only in:

- Next.js route handlers
- server actions
- scheduled backup scripts
- admin-only server operations

Service role must be used for:

- anonymous customer request creation
- track-code validation
- public job lookup
- payment confirmation from public flow
- complaint creation from public flow
- rating creation from public flow
- server-side file metadata inserts
- activity log creation

Never use service role in:

- client components
- browser JavaScript
- public environment variables
- mobile/PWA client code

Environment variable naming:

```text
SUPABASE_SERVICE_ROLE_KEY
```

must exist only server-side.

---

# 11. Public Customer Access Rules

Customer public APIs must validate:

- job_ref or public_id
- normalized phone
- raw track_code input matched against tracking_code_hash
- rate limits
- current job state
- invite code rules during request creation

Public API must never return:

- full worker phone before assignment
- worker private documents
- other customer records
- internal admin notes
- activity logs
- raw tracking hash
- service role derived data

---

# 12. Worker Access Rules

Workers may access:

- own profile
- own document metadata
- own dispatch offers
- jobs assigned to them
- job media for assigned jobs
- payment summaries for assigned jobs
- ratings for completed assigned jobs

Workers may not access:

- admin dashboard
- invite codes
- other workers
- unrelated customer records
- unrelated jobs
- activity logs
- full complaint admin notes
- payment confirmation controls
- settings

---

# 13. Admin Access Rules

Admin can access all MVP operational data.

Admin actions should still follow business rules:

- cannot close unpaid job unless waived or confirmed
- cannot send second active offer for same job
- cannot assign suspended worker
- cannot delete audit logs
- cannot physically delete jobs/payments/complaints in MVP

Admin permissions are broad, but application logic must remain strict.

---

# 14. Activity Logging Security

Every mutation must log:

- actor_type
- actor_user_id when available
- entity_type
- entity_id
- action
- source
- safe metadata
- created_at

Do not log:

- raw password
- raw tracking code
- full government ID
- service role key
- full document file content
- unredacted sensitive data

---

# 15. Data Exposure Rules

## Worker Summary Visible to Customer

After assignment, customer may see:

- worker first name
- worker photo if available
- category
- badge status
- jobs completed
- average rating after threshold

Do not show:

- government ID
- full address
- internal score
- private documents
- other job history

## Customer Summary Visible to Worker

Worker may see:

- customer first name
- phone/contact link if assigned
- address text
- landmark
- job description
- payment preference

Do not show:

- alternate phone unless required
- invite code
- internal customer notes
- other customer jobs

---

# 16. Policy Testing Checklist

## Anonymous Tests

- Anonymous cannot select jobs table.
- Anonymous cannot select customer_profiles.
- Anonymous cannot select worker_profiles.
- Anonymous cannot select payments.
- Anonymous cannot access private storage directly.
- Anonymous public API works only with valid invite or tracking credentials.

## Worker Tests

- Worker can view own profile.
- Worker cannot view another worker profile.
- Worker can view own dispatch offers.
- Worker cannot view another worker offer.
- Worker can view assigned job.
- Worker cannot view unassigned job.
- Worker cannot approve self.
- Worker cannot update payment confirmation directly.
- Worker cannot view activity logs.

## Admin Tests

- Admin can view dashboard data.
- Admin can approve worker.
- Admin can dispatch job.
- Admin can update payment.
- Admin can resolve complaint.
- Admin can read activity logs.
- Admin cannot delete activity logs through application flow.

## Storage Tests

- Worker can upload own document.
- Worker cannot upload to another worker folder.
- Worker can view own document.
- Worker cannot view another worker document.
- Worker can upload assigned job completion photo.
- Anonymous cannot read private media URL.
- Admin can access all media through authenticated route.

---

# 17. Common Failure Modes

## Failure 1: Public table access accidentally enabled

Risk:
Anonymous users can read sensitive data.

Countermeasure:
RLS enabled on all tables, no public select policies on sensitive tables.

## Failure 2: Service role leaked

Risk:
Full database compromise.

Countermeasure:
Server-only environment variables, never import service client in client components.

## Failure 3: Worker sees unrelated jobs

Risk:
Privacy and trust failure.

Countermeasure:
Assigned-worker-only job policies and route validation.

## Failure 4: Customer tracking code stored raw

Risk:
Anyone with database access can access job lookup.

Countermeasure:
Store hash only.

## Failure 5: Activity logs editable

Risk:
Dispute records can be manipulated.

Countermeasure:
No update/delete policy for activity_logs.

## Failure 6: Storage public by mistake

Risk:
KYC documents exposed.

Countermeasure:
Private buckets only.

---

# 18. Implementation Order

1. Create helper functions:
   - is_admin()
   - current_worker_profile_id()
2. Enable RLS on all tables.
3. Add admin policies.
4. Add worker self-access policies.
5. Add worker assigned-job policies.
6. Deny anonymous table access.
7. Configure Storage private buckets.
8. Add Storage policies.
9. Implement server-side public customer routes.
10. Test anonymous denial.
11. Test worker isolation.
12. Test admin access.
13. Test service role-only operations.
14. Document policy behavior in repo.

---

# 19. Deferred Security Features

Do not build now:

- Device fingerprinting
- Advanced fraud scoring
- Admin role hierarchy
- Multi-admin permissions
- OTP login
- Customer accounts
- Customer data export portal
- Automated deletion workflow
- App Check
- Realtime presence permissions

Add later only after MVP proof.

---

# 20. Final RLS Freeze Checklist

- [x] RLS enabled on all application tables
- [x] Anonymous direct table access denied
- [x] Public customer actions routed through server
- [x] Worker can read own profile
- [x] Worker cannot read other workers
- [x] Worker can read own dispatch offers
- [x] Worker can read assigned jobs only
- [x] Worker cannot directly confirm final payments
- [x] Worker cannot approve/reject workers
- [x] Admin can manage all operational records
- [x] Service role limited to server-side code
- [x] Storage buckets private
- [x] KYC documents protected
- [x] Job media protected
- [x] Activity logs append-only
- [x] No raw track codes stored
- [x] No raw government ID stored
- [x] No wallet/security complexity added

---

# Final Verdict

KS-007 Supabase RLS Policies v1.0 defines the MVP security boundary for KaamSetu.

Next document:

**KS-008 API Contracts v1.0**
