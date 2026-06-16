-- KS-012: 003_tables_core.sql

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

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_hi text,
  pricing_type_default pricing_type not null default 'fixed_price',
  standard_visit_charge integer not null default 0,
  requires_shift_fields boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_categories_visit_charge_check check (
    standard_visit_charge >= 0 and standard_visit_charge <= 9999
  )
);

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
