-- KS-012: Operational workflow tables

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

alter table public.jobs
add constraint jobs_assigned_dispatch_attempt_fk
foreign key (assigned_dispatch_attempt_id)
references public.dispatch_attempts(id);

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
