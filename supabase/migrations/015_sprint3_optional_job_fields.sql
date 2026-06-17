-- KS-S3: Allow minimal customer requests without address/description

alter table public.jobs drop constraint if exists jobs_description_length_check;
alter table public.jobs drop constraint if exists jobs_address_length_check;

alter table public.jobs add constraint jobs_description_length_check check (
  char_length(description) <= 500
);

alter table public.jobs add constraint jobs_address_length_check check (
  char_length(address_text) <= 250
);
