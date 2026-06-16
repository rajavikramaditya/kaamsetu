-- KS-012: 009_seed_data.sql — from docs/LAUNCH-CONFIG.md

insert into public.service_categories
  (slug, name_en, name_hi, pricing_type_default, standard_visit_charge, requires_shift_fields, sort_order)
values
  ('plumber', 'Plumber', 'प्लंबर', 'quote_required', 99, false, 10),
  ('electrician', 'Electrician', 'इलेक्ट्रीशियन', 'quote_required', 99, false, 20),
  ('helper_labour', 'Helper / Labour', 'हेल्पर / मजदूर', 'daily_wage', 0, true, 30),
  ('painter', 'Painter', 'पेंटर', 'quote_required', 99, false, 40),
  ('ac_appliance_repair', 'Fridge / AC', 'फ्रिज / AC', 'quote_required', 99, false, 50)
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_hi = excluded.name_hi,
  pricing_type_default = excluded.pricing_type_default,
  standard_visit_charge = excluded.standard_visit_charge,
  requires_shift_fields = excluded.requires_shift_fields,
  sort_order = excluded.sort_order;

insert into public.localities (city, state, name, sort_order)
values
  ('Orai', 'Uttar Pradesh', 'Indira Nagar', 10),
  ('Orai', 'Uttar Pradesh', 'Rath Road', 20),
  ('Orai', 'Uttar Pradesh', 'Rajendra Nagar', 30),
  ('Orai', 'Uttar Pradesh', 'Civil Lines', 40),
  ('Orai', 'Uttar Pradesh', 'Patel Nagar', 50),
  ('Orai', 'Uttar Pradesh', 'Tulsi Nagar', 60),
  ('Orai', 'Uttar Pradesh', 'Sardar Patel Nagar', 70),
  ('Orai', 'Uttar Pradesh', 'Konch Bus Stand Area', 80),
  ('Orai', 'Uttar Pradesh', 'Station Road Area', 90),
  ('Orai', 'Uttar Pradesh', 'Kalpi Road Area', 100)
on conflict do nothing;
