# KaamSetu — Launch Configuration

**Source:** Founder inputs (confirmed 2026-06-16)  
**Used by:** Sprint 1 seed (`supabase/migrations/009_seed_data.sql`)  
**Editable later:** Admin → Settings → Categories (Sprint 4) — `pricing_type_default`, `standard_visit_charge`

> Agent: this file is canonical for seed data. Schema must include `standard_visit_charge` on `service_categories` (see § Schema note below).

---

## Launch market

| Field | Value |
|---|---|
| **District** | Orai, Jalaun, Uttar Pradesh |
| **Launch cluster** | Indra Nagar + surrounding (~3–5 km) |
| **Live app URL** | https://kaamsetu-green.vercel.app |
| **Supabase project** | `hdpilxkplygjxvjytvxu` |

---

## Service categories (5 — locked)

| # | Name | Slug | `pricing_type_default` | `standard_visit_charge` (₹) | Shift fields | Notes |
|---|---|---|---|---:|---|---|
| 1 | Plumber | `plumber` | `quote_required` | 99 | false | Visit fee before quote |
| 2 | Electrician | `electrician` | `quote_required` | 99 | false | Visit fee before quote |
| 3 | Helper / Labour | `helper_labour` | `daily_wage` | 0 | **true** | Half-day / full-day rates separate |
| 4 | Painter | `painter` | `quote_required` | 99 | false | Variable scope |
| 5 | Fridge / AC | `ac_appliance_repair` | `quote_required` | 99 | false | Appliance repair & service |

### Helper / Labour — shift pricing (Sprint 4 admin editable)

| Shift | Field (future) | Initial beta |
|---|---|---|
| Half day | `half_day_rate` | Founder sets in admin later |
| Full day | `full_day_rate` | Founder sets in admin later |

Helper has **no visit charge** (`standard_visit_charge = 0`).

---

## Localities (10 — locked)

All seeded with `city = 'Orai'`, `state = 'Uttar Pradesh'`, `is_serviceable = true`.

| # | Name | Slug (seed) |
|---|---|---|
| 1 | Indira Nagar | `indira-nagar` |
| 2 | Rath Road | `rath-road` |
| 3 | Rajendra Nagar | `rajendra-nagar` |
| 4 | Civil Lines | `civil-lines` |
| 5 | Patel Nagar | `patel-nagar` |
| 6 | Tulsi Nagar | `tulsi-nagar` |
| 7 | Sardar Patel Nagar | `sardar-patel-nagar` |
| 8 | Konch Bus Stand Area | `konch-bus-stand-area` |
| 9 | Station Road Area | `station-road-area` |
| 10 | Kalpi Road Area | `kalpi-road-area` |

---

## Schema note (Sprint 1)

KS-006 `service_categories` needs one added column:

```sql
standard_visit_charge integer NOT NULL DEFAULT 0
  CHECK (standard_visit_charge >= 0 AND standard_visit_charge <= 9999)
```

**Admin edit (Sprint 4):** Settings screen must allow founder to update per category:

- `standard_visit_charge`
- `pricing_type_default`
- `is_active`
- `name_en` / `name_hi`

Changes apply to **new jobs only**; existing jobs keep `price_snapshot` at creation time.

---

## Founder ops checklist

| Item | Status |
|---|---|
| Launch city + cluster | ✅ |
| 5 categories + pricing | ✅ Confirmed |
| `standard_visit_charge` values | ✅ Beta values locked |
| Localities (10) | ✅ |
| Supabase + Vercel | ✅ |
| WhatsApp Business | ⬜ |
| Privacy policy | ⬜ |
| Workers recruited | ⬜ 0 / 20 |

---

## Seed SQL reference (Sprint 1)

Agent: generate `009_seed_data.sql` from this table data exactly.
