# KS-012 Supabase SQL Migration Pack v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** Supabase SQL Migration Implementation Pack  
**Version:** 1.0  
**Status:** Pre-Coding Migration Specification  
**Depends On:**  
- KS-006 Database Schema v1.0  
- KS-007 Supabase RLS Policies v1.0  
- KS-010 Architecture Audit & Gap Analysis v1.0  
- KS-011 Repository Structure & Engineering Standards v1.0  

---

## 1. Purpose

This document defines the Supabase SQL migration pack for KaamSetu MVP.

It is designed so AI coding agents can create real migration files inside:

```text
supabase/migrations/
```

This document is not a strategy document.  
It is an implementation specification.

---

## 2. Migration File Structure

Required migration files:

```text
supabase/migrations/
│
├── 001_extensions.sql
├── 002_enums.sql
├── 003_tables_core.sql
├── 004_tables_operations.sql
├── 005_constraints_indexes.sql
├── 006_triggers.sql
├── 007_storage_buckets.sql
├── 008_rls_enable.sql
├── 009_seed_data.sql
└── 010_sanity_checks.sql
```

Recommended later:

```text
011_rls_policies.sql
```

RLS policies are documented in KS-007 and should be implemented carefully after base schema is stable.

---

## 3. Execution Order

Run migrations in this order:

1. Extensions
2. Enums
3. Core tables
4. Operational tables
5. Constraints and indexes
6. Triggers
7. Storage buckets
8. Enable RLS
9. Seed data
10. Sanity checks

Do not seed data before tables and constraints exist.

---

# 4. 001_extensions.sql

## Purpose

Enable required PostgreSQL extensions.

## Required SQL

```sql
create extension if not exists pgcrypto;
create extension if not exists citext;
```

## Optional Later

```sql
create extension if not exists pg_trgm;
```

Do not enable optional extensions unless needed.

---

# 5. 002_enums.sql

## Purpose

Create controlled lifecycle enums.

## Required Types

```sql
create type booking_status as enum (
  'requested',
  'validated',
  'dispatching',
  'assigned',
  'in_progress',
  'completed',
  'disputed',
  'closed',
  'cancelled'
);

create type dispatch_status as enum (
  'not_started',
  'offer_pending',
  'assigned',
  'failed',
  'stopped'
);

create type payment_status as enum (
  'not_due',
  'due',
  'payment_link_sent',
  'customer_marked_paid',
  'admin_confirmed_paid',
  'failed',
  'waived'
);

create type complaint_status as enum (
  'open',
  'under_review',
  'resolved',
  'dismissed',
  'closed'
);

create type approval_status as enum (
  'invited',
  'draft',
  'under_review',
  'approved',
  'rejected',
  'suspended'
);

create type pricing_type as enum (
  'fixed_price',
  'quote_required',
  'daily_wage'
);

create type request_source as enum (
  'pwa',
  'whatsapp_assisted',
  'call_assisted',
  'admin_manual'
);

create type payment_method as enum (
  'cash',
  'upi',
  'razorpay_link',
  'bank_transfer',
  'waived'
);
```

## Important Note

`jobs.complaint_status` should not use `complaint_status` enum directly unless `none` is added.

MVP recommendation:

```sql
complaint_status text not null default 'none'
```

Allowed values enforced by CHECK:

```text
none, open, under_review, resolved, dismissed, closed
```

---

# 6. 003_tables_core.sql

## Purpose

Create core reference and identity tables.

Tables:

1. localities
2. service_categories
3. invite_codes
4. customer_profiles
5. worker_profiles
6. worker_documents

---

## 6.1 localities

```sql
create table public.localities (
  id uuid primary key default gen_random_uuid(),
  city text not null default 'Orai',
  state text not null default 'Uttar Pradesh',
  name text not null,
  pincode text,
  is_serviceable boolean not null default true,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6.2 service_categories

```sql
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_hi text,
  pricing_type_default pricing_type not null default 'fixed_price',
  requires_shift_fields boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 6.3 invite_codes

```sql
create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  code_type text not null default 'customer',
  locality_id uuid references public.localities(id),
  max_uses integer not null default 1,
  used_count integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint invite_codes_max_uses_check check (max_uses > 0),
  constraint invite_codes_used_count_check check (used_count >= 0 and used_count <= max_uses)
);
```

---

## 6.4 customer_profiles

```sql
create table public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id),
  full_name text not null,
  phone text not null,
  alternate_phone text,
  language_code text not null default 'hi',
  locality_id uuid not null references public.localities(id),
  default_address_text text,
  landmark text,
  invite_code_id uuid references public.invite_codes(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customer_name_length_check check (char_length(full_name) between 2 and 80),
  constraint customer_language_check check (language_code in ('hi', 'en'))
);
```

---

## 6.5 worker_profiles

```sql
create table public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id),
  worker_code text not null unique,
  full_name text not null,
  phone text not null unique,
  whatsapp_number text,
  locality_id uuid not null references public.localities(id),
  address_text text,
  primary_category_id uuid not null references public.service_categories(id),
  secondary_category_ids uuid[],
  supported_job_modes text[] not null default array['fixed_price'],
  years_experience integer default 0,
  has_own_tools boolean not null default false,
  government_id_type text,
  government_id_last4 text,
  approval_status approval_status not null default 'invited',
  rejection_reason text,
  is_available boolean not null default true,
  badge_status text not null default 'pending',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint worker_name_length_check check (char_length(full_name) between 2 and 80),
  constraint worker_experience_check check (years_experience is null or years_experience between 0 and 40),
  constraint worker_badge_status_check check (badge_status in ('pending', 'probation', 'verified', 'paused')),
  constraint worker_gov_id_last4_check check (government_id_last4 is null or government_id_last4 ~ '^[0-9]{4}$')
);
```

---

## 6.6 worker_documents

```sql
create table public.worker_documents (
  id uuid primary key default gen_random_uuid(),
  worker_profile_id uuid not null references public.worker_profiles(id),
  document_type text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes integer not null,
  verification_status text not null default 'pending',
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),

  constraint worker_document_type_check check (
    document_type in ('profile_photo', 'government_id_front', 'government_id_back', 'other')
  ),
  constraint worker_document_verification_check check (
    verification_status in ('pending', 'approved', 'rejected')
  ),
  constraint worker_document_size_check check (file_size_bytes > 0 and file_size_bytes <= 5242880)
);
```

---

# 7. 004_tables_operations.sql

## Purpose

Create operational workflow tables.

Tables:

1. jobs
2. job_media
3. dispatch_attempts
4. payments
5. ratings
6. complaints
7. activity_logs

---

## 7.1 jobs

```sql
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  job_ref text not null unique,
  tracking_code_hash text not null,

  customer_profile_id uuid not null references public.customer_profiles(id),
  invite_code_id uuid references public.invite_codes(id),
  service_category_id uuid not null references public.service_categories(id),
  locality_id uuid not null references public.localities(id),

  request_source request_source not null default 'pwa',
  pricing_type pricing_type not null default 'fixed_price',

  description text not null,
  address_text text not null,
  landmark text,
  preferred_date date,
  preferred_time_slot text not null,

  workers_needed integer,
  shift_type text,

  booking_status booking_status not null default 'requested',
  dispatch_status dispatch_status not null default 'not_started',
  payment_status payment_status not null default 'not_due',
  complaint_status text not null default 'none',

  assigned_worker_id uuid references public.worker_profiles(id),
  assigned_dispatch_attempt_id uuid,

  estimated_amount numeric(10,2),
  final_amount numeric(10,2),
  worker_payable_amount numeric(10,2),
  estimated_duration_hours integer,

  customer_payment_preference text not null default 'either',
  admin_notes text,
  status_reason text,

  requested_at timestamptz not null default now(),
  assigned_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  closed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint jobs_description_length_check check (char_length(description) between 20 and 500),
  constraint jobs_address_length_check check (char_length(address_text) between 10 and 250),
  constraint jobs_amount_check check (
    (estimated_amount is null or estimated_amount >= 0)
    and (final_amount is null or final_amount >= 0)
    and (worker_payable_amount is null or worker_payable_amount >= 0)
  ),
  constraint jobs_duration_check check (
    estimated_duration_hours is null or estimated_duration_hours > 0
  ),
  constraint jobs_workers_needed_check check (
    workers_needed is null or workers_needed between 1 and 20
  ),
  constraint jobs_shift_type_check check (
    shift_type is null or shift_type in ('half_day', 'full_day')
  ),
  constraint jobs_payment_pref_check check (
    customer_payment_preference in ('cash', 'upi', 'either')
  ),
  constraint jobs_complaint_status_check check (
    complaint_status in ('none', 'open', 'under_review', 'resolved', 'dismissed', 'closed')
  )
);
```

Note:

`assigned_dispatch_attempt_id` FK must be added after `dispatch_attempts` exists.

---

## 7.2 job_media

```sql
create table public.job_media (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  uploaded_by_role text not null,
  uploaded_by_user_id uuid references auth.users(id),
  media_kind text not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes integer not null,
  created_at timestamptz not null default now(),

  constraint job_media_role_check check (
    uploaded_by_role in ('customer', 'worker', 'admin', 'system')
  ),
  constraint job_media_kind_check check (
    media_kind in ('issue_photo', 'completion_photo', 'other')
  ),
  constraint job_media_size_check check (file_size_bytes > 0 and file_size_bytes <= 5242880)
);
```

---

## 7.3 dispatch_attempts

```sql
create table public.dispatch_attempts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  worker_profile_id uuid not null references public.worker_profiles(id),
  offer_status text not null default 'sent',
  contact_method text not null default 'whatsapp_manual',
  offered_amount numeric(10,2),
  offer_expires_at timestamptz,
  response_note text,
  sent_at timestamptz not null default now(),
  responded_at timestamptz,
  created_by_admin_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint dispatch_offer_status_check check (
    offer_status in ('sent', 'accepted', 'declined', 'expired', 'withdrawn', 'accepted_manual', 'declined_manual')
  ),
  constraint dispatch_contact_method_check check (
    contact_method in ('whatsapp_manual', 'call_manual', 'admin_manual')
  ),
  constraint dispatch_amount_check check (offered_amount is null or offered_amount >= 0)
);
```

Add circular FK after table creation:

```sql
alter table public.jobs
add constraint jobs_assigned_dispatch_attempt_fk
foreign key (assigned_dispatch_attempt_id)
references public.dispatch_attempts(id);
```

---

## 7.4 payments

```sql
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id),
  amount numeric(10,2) not null default 0,
  payment_method payment_method,
  status payment_status not null default 'not_due',
  link_url text,
  external_reference text,
  reported_by_role text,
  reported_by_user_id uuid references auth.users(id),
  reported_at timestamptz,
  confirmed_by uuid references auth.users(id),
  confirmed_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint payments_amount_check check (amount >= 0),
  constraint payments_reported_by_role_check check (
    reported_by_role is null or reported_by_role in ('customer', 'worker', 'admin', 'system')
  )
);
```

---

## 7.5 ratings

```sql
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs(id),
  customer_profile_id uuid not null references public.customer_profiles(id),
  worker_profile_id uuid not null references public.worker_profiles(id),
  overall_rating smallint not null,
  punctuality_rating smallint,
  behavior_rating smallint,
  quality_rating smallint,
  review_text text,
  created_at timestamptz not null default now(),

  constraint ratings_overall_check check (overall_rating between 1 and 5),
  constraint ratings_punctuality_check check (punctuality_rating is null or punctuality_rating between 1 and 5),
  constraint ratings_behavior_check check (behavior_rating is null or behavior_rating between 1 and 5),
  constraint ratings_quality_check check (quality_rating is null or quality_rating between 1 and 5),
  constraint ratings_review_length_check check (review_text is null or char_length(review_text) <= 300)
);
```

---

## 7.6 complaints

```sql
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  complaint_ref text not null unique,
  job_id uuid not null unique references public.jobs(id),
  customer_profile_id uuid references public.customer_profiles(id),
  worker_profile_id uuid references public.worker_profiles(id),
  complaint_type text not null,
  description text not null,
  status complaint_status not null default 'open',
  resolution_note text,
  resolved_by uuid references auth.users(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint complaints_description_length_check check (char_length(description) between 20 and 500),
  constraint complaints_type_check check (
    complaint_type in ('no_show', 'quality_issue', 'billing_issue', 'behavior_issue', 'safety_issue', 'other')
  )
);
```

---

## 7.7 activity_logs

```sql
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null,
  actor_user_id uuid references auth.users(id),
  actor_label text,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  source text not null default 'web',
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),

  constraint activity_actor_type_check check (
    actor_type in ('customer', 'worker', 'admin', 'system')
  ),
  constraint activity_source_check check (
    source in ('web', 'worker', 'admin', 'system')
  )
);
```

---

# 8. 005_constraints_indexes.sql

## Purpose

Create indexes and partial constraints.

---

## 8.1 Core Indexes

```sql
create index idx_customer_phone on public.customer_profiles(phone);
create index idx_worker_phone on public.worker_profiles(phone);
create index idx_worker_locality on public.worker_profiles(locality_id);
create index idx_worker_category on public.worker_profiles(primary_category_id);
create index idx_worker_approval on public.worker_profiles(approval_status);
create index idx_worker_available on public.worker_profiles(is_available);

create index idx_jobs_ref on public.jobs(job_ref);
create index idx_jobs_public_id on public.jobs(public_id);
create index idx_jobs_customer on public.jobs(customer_profile_id);
create index idx_jobs_worker on public.jobs(assigned_worker_id);
create index idx_jobs_status on public.jobs(booking_status, dispatch_status, payment_status);
create index idx_jobs_locality on public.jobs(locality_id);
create index idx_jobs_category on public.jobs(service_category_id);

create index idx_dispatch_job on public.dispatch_attempts(job_id);
create index idx_dispatch_worker on public.dispatch_attempts(worker_profile_id);
create index idx_payment_job on public.payments(job_id);
create index idx_payment_status on public.payments(status);
create index idx_complaint_job on public.complaints(job_id);
create index idx_complaint_status on public.complaints(status);
create index idx_activity_entity on public.activity_logs(entity_type, entity_id);
create index idx_activity_created on public.activity_logs(created_at);
```

---

## 8.2 One Active Dispatch Offer Per Job

```sql
create unique index unique_active_dispatch_offer_per_job
on public.dispatch_attempts(job_id)
where offer_status = 'sent';
```

This enforces serial dispatch.

---

# 9. 006_triggers.sql

## Purpose

Add automatic updated_at handling.

---

## 9.1 Updated At Function

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

---

## 9.2 Apply Updated At Trigger

```sql
create trigger set_updated_at_localities
before update on public.localities
for each row execute function public.set_updated_at();

create trigger set_updated_at_service_categories
before update on public.service_categories
for each row execute function public.set_updated_at();

create trigger set_updated_at_invite_codes
before update on public.invite_codes
for each row execute function public.set_updated_at();

create trigger set_updated_at_customer_profiles
before update on public.customer_profiles
for each row execute function public.set_updated_at();

create trigger set_updated_at_worker_profiles
before update on public.worker_profiles
for each row execute function public.set_updated_at();

create trigger set_updated_at_jobs
before update on public.jobs
for each row execute function public.set_updated_at();

create trigger set_updated_at_dispatch_attempts
before update on public.dispatch_attempts
for each row execute function public.set_updated_at();

create trigger set_updated_at_payments
before update on public.payments
for each row execute function public.set_updated_at();

create trigger set_updated_at_complaints
before update on public.complaints
for each row execute function public.set_updated_at();
```

---

# 10. 007_storage_buckets.sql

## Purpose

Create private storage buckets.

---

## Required Buckets

```sql
insert into storage.buckets (id, name, public)
values
  ('worker-documents', 'worker-documents', false),
  ('job-media', 'job-media', false)
on conflict (id) do nothing;
```

## Storage Rules

- Buckets are private.
- Public direct access is forbidden.
- Signed URLs may be generated server-side for admin/worker when allowed.
- No public KYC file URLs.

---

# 11. 008_rls_enable.sql

## Purpose

Enable RLS on all application tables.

```sql
alter table public.localities enable row level security;
alter table public.service_categories enable row level security;
alter table public.invite_codes enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.worker_documents enable row level security;
alter table public.jobs enable row level security;
alter table public.job_media enable row level security;
alter table public.dispatch_attempts enable row level security;
alter table public.payments enable row level security;
alter table public.ratings enable row level security;
alter table public.complaints enable row level security;
alter table public.activity_logs enable row level security;
```

Important:

Actual policies are implemented from KS-007.  
Do not leave tables exposed.

---

# 12. 009_seed_data.sql

## Purpose

Seed MVP categories and placeholder localities.

---

## 12.1 Categories

```sql
insert into public.service_categories
(slug, name_en, name_hi, pricing_type_default, requires_shift_fields, sort_order)
values
('electrician', 'Electrician', 'इलेक्ट्रीशियन', 'fixed_price', false, 10),
('plumber', 'Plumber', 'प्लंबर', 'fixed_price', false, 20),
('carpenter', 'Carpenter', 'बढ़ई', 'fixed_price', false, 30),
('ac_appliance_repair', 'AC / Appliance Repair', 'AC / उपकरण मरम्मत', 'quote_required', false, 40),
('helper_labour', 'Helper / Labour', 'हेल्पर / मजदूर', 'daily_wage', true, 50)
on conflict (slug) do nothing;
```

---

## 12.2 Localities

These are placeholders. Founder must verify before beta.

```sql
insert into public.localities
(city, state, name, pincode, sort_order)
values
('Orai', 'Uttar Pradesh', 'Rath Road', null, 10),
('Orai', 'Uttar Pradesh', 'Bus Stand Area', null, 20),
('Orai', 'Uttar Pradesh', 'Station Area', null, 30),
('Orai', 'Uttar Pradesh', 'Rajendra Nagar', null, 40),
('Orai', 'Uttar Pradesh', 'Tulsi Nagar', null, 50)
on conflict do nothing;
```

---

# 13. 010_sanity_checks.sql

## Purpose

Verify migration success.

---

## Checks

```sql
select count(*) as category_count from public.service_categories;
select count(*) as locality_count from public.localities;

select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Expected:

- category_count >= 5
- locality_count >= 3
- all MVP tables exist

---

# 14. RLS Policy Implementation Note

RLS SQL should be created in a separate file:

```text
011_rls_policies.sql
```

Reason:

- Easier testing
- Easier rollback
- Cleaner debugging

RLS must follow KS-007.

---

# 15. AI Agent Implementation Rules

When converting this pack into SQL files:

Do:

- Create one migration file per section.
- Keep SQL idempotent where possible.
- Use comments.
- Test migrations on empty Supabase project.
- Run sanity checks.

Do not:

- Add tables not listed here.
- Add wallet/chat/maps/referral tables.
- Remove RLS enablement.
- Store raw tracking code.
- Store full government ID.
- Make storage buckets public.

---

# 16. Migration Completion Checklist

- [ ] Extensions created
- [ ] Enums created
- [ ] Core tables created
- [ ] Operational tables created
- [ ] Circular FK added
- [ ] Indexes created
- [ ] One-active-offer constraint created
- [ ] Updated_at trigger created
- [ ] Storage buckets created
- [ ] RLS enabled
- [ ] Seed data inserted
- [ ] Sanity checks passed

---

# Final Verdict

KS-012 defines the Supabase SQL migration pack required before coding begins.

Next document:

**KS-013 Build Task Pack v1.0**
