-- KS-012: Indexes and partial constraints

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

-- One active dispatch offer per job
create unique index unique_active_dispatch_offer_per_job
on public.dispatch_attempts(job_id)
where offer_status = 'sent';
