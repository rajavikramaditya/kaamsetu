-- KS-007: 011_rls_policies.sql

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

create or replace function public.current_worker_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.worker_profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_assigned_worker(p_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.jobs
    where id = p_job_id
      and assigned_worker_id = public.current_worker_profile_id()
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.current_worker_profile_id() from public;
revoke all on function public.is_assigned_worker(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_worker_profile_id() to authenticated;
grant execute on function public.is_assigned_worker(uuid) to authenticated;

-- service_categories
create policy service_categories_worker_select on public.service_categories for select to authenticated using (is_active = true);
create policy service_categories_admin_select on public.service_categories for select to authenticated using (public.is_admin());
create policy service_categories_admin_insert on public.service_categories for insert to authenticated with check (public.is_admin());
create policy service_categories_admin_update on public.service_categories for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- localities
create policy localities_worker_select on public.localities for select to authenticated using (is_active = true);
create policy localities_admin_select on public.localities for select to authenticated using (public.is_admin());
create policy localities_admin_insert on public.localities for insert to authenticated with check (public.is_admin());
create policy localities_admin_update on public.localities for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- invite_codes
create policy invite_codes_admin_select on public.invite_codes for select to authenticated using (public.is_admin());
create policy invite_codes_admin_insert on public.invite_codes for insert to authenticated with check (public.is_admin());
create policy invite_codes_admin_update on public.invite_codes for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- customer_profiles
create policy customer_profiles_admin_select on public.customer_profiles for select to authenticated using (public.is_admin());
create policy customer_profiles_admin_insert on public.customer_profiles for insert to authenticated with check (public.is_admin());
create policy customer_profiles_admin_update on public.customer_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- worker_profiles
create policy worker_profiles_worker_select on public.worker_profiles for select to authenticated using (auth_user_id = auth.uid());
create policy worker_profiles_worker_update on public.worker_profiles for update to authenticated using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy worker_profiles_admin_select on public.worker_profiles for select to authenticated using (public.is_admin());
create policy worker_profiles_admin_insert on public.worker_profiles for insert to authenticated with check (public.is_admin());
create policy worker_profiles_admin_update on public.worker_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- worker_documents
create policy worker_documents_worker_select on public.worker_documents for select to authenticated using (worker_profile_id = public.current_worker_profile_id());
create policy worker_documents_worker_insert on public.worker_documents for insert to authenticated with check (worker_profile_id = public.current_worker_profile_id());
create policy worker_documents_admin_select on public.worker_documents for select to authenticated using (public.is_admin());
create policy worker_documents_admin_insert on public.worker_documents for insert to authenticated with check (public.is_admin());
create policy worker_documents_admin_update on public.worker_documents for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- jobs
create policy jobs_worker_select on public.jobs for select to authenticated using (assigned_worker_id = public.current_worker_profile_id());
create policy jobs_admin_select on public.jobs for select to authenticated using (public.is_admin());
create policy jobs_admin_insert on public.jobs for insert to authenticated with check (public.is_admin());
create policy jobs_admin_update on public.jobs for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- job_media
create policy job_media_worker_select on public.job_media for select to authenticated using (public.is_assigned_worker(job_id));
create policy job_media_worker_insert on public.job_media for insert to authenticated with check (public.is_assigned_worker(job_id));
create policy job_media_admin_select on public.job_media for select to authenticated using (public.is_admin());
create policy job_media_admin_insert on public.job_media for insert to authenticated with check (public.is_admin());
create policy job_media_admin_update on public.job_media for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- dispatch_attempts
create policy dispatch_attempts_worker_select on public.dispatch_attempts for select to authenticated using (worker_profile_id = public.current_worker_profile_id());
create policy dispatch_attempts_admin_select on public.dispatch_attempts for select to authenticated using (public.is_admin());
create policy dispatch_attempts_admin_insert on public.dispatch_attempts for insert to authenticated with check (public.is_admin());
create policy dispatch_attempts_admin_update on public.dispatch_attempts for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- payments
create policy payments_worker_select on public.payments for select to authenticated using (
  exists (
    select 1 from public.jobs j
    where j.id = payments.job_id
      and j.assigned_worker_id = public.current_worker_profile_id()
  )
);
create policy payments_admin_select on public.payments for select to authenticated using (public.is_admin());
create policy payments_admin_update on public.payments for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ratings
create policy ratings_worker_select on public.ratings for select to authenticated using (worker_profile_id = public.current_worker_profile_id());
create policy ratings_admin_select on public.ratings for select to authenticated using (public.is_admin());

-- complaints
create policy complaints_worker_select on public.complaints for select to authenticated using (
  exists (
    select 1 from public.jobs j
    where j.id = complaints.job_id
      and j.assigned_worker_id = public.current_worker_profile_id()
  )
);
create policy complaints_admin_select on public.complaints for select to authenticated using (public.is_admin());
create policy complaints_admin_update on public.complaints for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- activity_logs
create policy activity_logs_admin_select on public.activity_logs for select to authenticated using (public.is_admin());

-- storage.objects
create policy worker_documents_storage_worker_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = public.current_worker_profile_id()::text
);
create policy worker_documents_storage_worker_select on storage.objects for select to authenticated using (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = public.current_worker_profile_id()::text
);
create policy worker_documents_storage_admin_select on storage.objects for select to authenticated using (
  bucket_id = 'worker-documents' and public.is_admin()
);

create policy job_media_storage_worker_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'job-media'
  and public.is_assigned_worker(((storage.foldername(name))[1])::uuid)
);
create policy job_media_storage_worker_select on storage.objects for select to authenticated using (
  bucket_id = 'job-media'
  and public.is_assigned_worker(((storage.foldername(name))[1])::uuid)
);
create policy job_media_storage_admin_select on storage.objects for select to authenticated using (
  bucket_id = 'job-media' and public.is_admin()
);
