-- KS-012: Post-migration sanity checks (informational)

select count(*) as category_count from public.service_categories;
select count(*) as locality_count from public.localities;

select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
