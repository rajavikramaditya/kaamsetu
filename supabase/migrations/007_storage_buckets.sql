-- KS-012: 007_storage_buckets.sql

insert into storage.buckets (id, name, public)
values
  ('worker-documents', 'worker-documents', false),
  ('job-media', 'job-media', false)
on conflict (id) do nothing;
