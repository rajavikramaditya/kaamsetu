-- KS-012: MVP seed data — categories and placeholder localities

insert into public.service_categories
(slug, name_en, name_hi, pricing_type_default, requires_shift_fields, sort_order)
values
('electrician', 'Electrician', 'इलेक्ट्रीशियन', 'fixed_price', false, 10),
('plumber', 'Plumber', 'प्लंबर', 'fixed_price', false, 20),
('carpenter', 'Carpenter', 'बढ़ई', 'fixed_price', false, 30),
('ac_appliance_repair', 'AC / Appliance Repair', 'AC / उपकरण मरम्मत', 'quote_required', false, 40),
('helper_labour', 'Helper / Labour', 'हेल्पर / मजदूर', 'daily_wage', true, 50)
on conflict (slug) do nothing;

insert into public.localities
(city, state, name, pincode, sort_order)
values
('Orai', 'Uttar Pradesh', 'Rath Road', null, 10),
('Orai', 'Uttar Pradesh', 'Bus Stand Area', null, 20),
('Orai', 'Uttar Pradesh', 'Station Area', null, 30),
('Orai', 'Uttar Pradesh', 'Rajendra Nagar', null, 40),
('Orai', 'Uttar Pradesh', 'Tulsi Nagar', null, 50);
