-- Dev seed: localities (see 009_seed_data.sql for production seed)

select name, city, state from public.localities order by sort_order;
