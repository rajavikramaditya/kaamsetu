-- KS-012: Enable RLS on all application tables

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
