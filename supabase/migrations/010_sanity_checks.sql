-- KS-012: 010_sanity_checks.sql
-- Run after migrations; raises if expectations fail.

do $$
declare
  cat_count integer;
  loc_count integer;
begin
  select count(*) into cat_count from public.service_categories;
  select count(*) into loc_count from public.localities;

  if cat_count < 5 then
    raise exception 'Sanity check failed: expected >= 5 categories, got %', cat_count;
  end if;

  if loc_count < 10 then
    raise exception 'Sanity check failed: expected >= 10 localities, got %', loc_count;
  end if;
end $$;
