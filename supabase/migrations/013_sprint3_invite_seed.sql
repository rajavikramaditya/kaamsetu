-- KS-S3: Beta customer invite codes for Orai closed beta

insert into public.invite_codes (code, code_type, max_uses, is_active)
values
  ('ORAI2026', 'customer', 100, true),
  ('ORAI-BETA', 'customer', 50, true)
on conflict (code) do update set
  is_active = excluded.is_active,
  max_uses = excluded.max_uses;
