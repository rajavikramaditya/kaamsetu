-- KS-012: 006_triggers.sql

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
