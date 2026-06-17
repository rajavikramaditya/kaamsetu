-- KS-S3 UX: voice note media kind for customer issue recordings

alter table public.job_media drop constraint if exists job_media_kind_check;

alter table public.job_media add constraint job_media_kind_check check (
  media_kind in ('issue_photo', 'issue_voice_note', 'completion_photo', 'other')
);
