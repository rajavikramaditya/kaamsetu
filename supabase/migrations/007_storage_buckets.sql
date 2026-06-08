-- KS-012: Private storage buckets (no public access)

insert into storage.buckets (id, name, public)
values
  ('worker-documents', 'worker-documents', false),
  ('job-media', 'job-media', false)
on conflict (id) do nothing;
