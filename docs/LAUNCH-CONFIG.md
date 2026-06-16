# KaamSetu — Launch Configuration

**Source:** Founder inputs from `docs/FOUNDER-GROUND-WORK.md`  
**Last updated:** 2026-06-16  
**Used by:** Sprint 1 seed data (`supabase/migrations/009_seed_data.sql`)

> Agent: use this file as canonical launch market config. If founder updates FOUNDER-GROUND-WORK, sync here before seed migrations.

---

## Launch market

| Field | Value |
|---|---|
| **District** | Orai, Jalaun, Uttar Pradesh |
| **Launch cluster** | Indra Nagar (~3–5 km radius) |
| **Rationale** | Founder on-ground, workers available, local demand |
| **Live app URL** | https://kaamsetu-green.vercel.app |
| **Supabase project** | `hdpilxkplygjxvjytvxu` |

---

## Service categories (max 5 — locked)

| # | Category | Slug (seed) | Pricing mode | Notes |
|---|---|---|---|---|
| 1 | Plumber | `plumber` | `fixed_price` | Small repairs, tap, pipe |
| 2 | Electrician | `electrician` | `fixed_price` | Switch, fan, wiring basics |
| 3 | Helper / Labour | `helper-labour` | `daily_wage` | Half-day / full-day shifts |
| 4 | Painter | `painter` | `quote_required` | Variable scope jobs |
| 5 | Fridge / AC Electrician | `appliance-electrician` | `quote_required` | Fridge, AC repair & service |

**Pricing modes inferred from PRD defaults** — founder to confirm or correct before Sprint 1 seed deploy.

---

## Localities (customer dropdown)

**Status:** ⏸ Pending — Step 0.3 not filled in FOUNDER-GROUND-WORK

Minimum needed for Sprint 1 seed: **5–10 colony/area names** within Indra Nagar cluster.

```
[ ] Founder to add — e.g. Indra Nagar Block A, Indra Nagar Block B, nearby colonies
```

Until localities are listed, Sprint 1 seed will use **Indra Nagar** only as single locality placeholder.

---

## Founder ops checklist status

| Item | Status |
|---|---|
| Launch city locked | ✅ Orai, Jalaun UP |
| Launch cluster | ✅ Indra Nagar |
| 5 categories | ✅ Locked (pricing modes inferred) |
| Localities list | ⏸ Pending |
| Supabase + keys | ✅ Done |
| Vercel deploy | ✅ kaamsetu-green.vercel.app |
| WhatsApp Business | ⬜ Not started |
| Price templates | ⬜ Not started |
| Privacy policy | ⬜ Not started |
| Workers recruited | ⬜ 0 / 20 |

---

## Next agent action

**Sprint 1 (`KS-S1-database-rls`)** — run KS-012 migrations + seed using this config.

**Founder action before seed:** Fill Step 0.3 localities in `FOUNDER-GROUND-WORK.md` (5–10 names).
