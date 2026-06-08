-- Dev seed: service categories (see 009_seed_data.sql for production seed)

select slug, name_en from public.service_categories order by sort_order;
