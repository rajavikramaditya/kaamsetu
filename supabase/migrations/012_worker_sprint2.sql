-- KS-S2: Worker module schema adjustments (doc types, approval labels, onboarding)

-- Extend approval_status for founder-facing labels
alter type approval_status add value if not exists 'pending';
alter type approval_status add value if not exists 'banned';

-- Allow profile completion after OTP login before all fields are set
alter table public.worker_profiles
  alter column locality_id drop not null,
  alter column primary_category_id drop not null;

-- Aadhaar (required) + PAN (optional) document types
alter table public.worker_documents
  drop constraint if exists worker_document_type_check;

alter table public.worker_documents
  add constraint worker_document_type_check check (
    document_type in (
      'profile_photo',
      'government_id_front',
      'government_id_back',
      'aadhaar_image',
      'pan_image',
      'other'
    )
  );

-- Worker self-registration after OTP (Sprint 2)
create policy worker_profiles_worker_insert
  on public.worker_profiles
  for insert
  to authenticated
  with check (auth_user_id = auth.uid());
