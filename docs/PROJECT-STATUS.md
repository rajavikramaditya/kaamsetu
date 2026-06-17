# KaamSetu — Project Status

**Tagline:** Local Work. Trusted People.  
**Last updated:** 2026-06-17  
**Updated by:** AI Agent (Sprint 3 founder corrections)  
**Current phase:** Sprint 3 live — founder corrections  
**Overall progress:** ~60%

**Founder decision (locked):** Orai is treated as one service radius. Workers may accept jobs anywhere in Orai. Locality is used for address clarity, admin filtering, and analytics only — **not** dispatch restriction.

## Launch market (founder locked)

| Field | Value |
|---|---|
| City | Orai District, Jalaun, UP |
| Cluster | Indra Nagar |
| Categories | 5 locked — quote/daily_wage + visit charges |
| Localities | 10 areas (Indira Nagar → Kalpi Road) |
| Config doc | `docs/LAUNCH-CONFIG.md` |

> **Maintenance rule for AI agents:** After every successful sprint checkpoint or major deliverable, update this file — progress %, checkpoint status, blockers, and `Last updated`. Then **commit and push** per `AGENTS.md` §8.1 using the KS checkpoint ID (e.g. `KS-S0-foundation`). Do not mark a checkpoint ✅ until acceptance criteria from KS-009 are met and verified.

---

## 1. Founder Goal (What You Want)

KaamSetu is **not** a generic “find any worker” app or an Urban Company clone. Your long-term vision (Founder Blueprint) is a **Bharat-first, trust-first hyperlocal workforce operating system** for Tier-2/3 India — fixed-price repairs, quote-based jobs, and daily-wage/shift labor through one backend.

Your **immediate MVP goal** (PRD + Scope Lock) is narrower and correct:

| Layer | Goal |
|---|---|
| **Business** | Prove 20 workers + 20 jobs in one city cluster before scaling |
| **Product** | Dispatch-led closed beta — customers request, founder dispatches, workers fulfill |
| **Tech** | Single Next.js PWA monolith + Supabase + Vercel, budget < ₹10,000 |
| **Operations** | You (founder) run dispatch, approvals, payments, complaints manually |
| **Trust** | Verified workers, job tracking, payment record, ratings, complaints |

**One-line summary:** You want a **software-enabled ops business** — the app records and controls the workflow; human judgment stays in the loop for the first 90 days.

---

## 2. Current Repository State

| Area | Status | Notes |
|---|---|---|
| Planning docs | ✅ Complete | PRD, schema, RLS, API, sprints, build pack in `docs/` |
| Next.js scaffold | ✅ Done | KaamSetu landing + layout |
| Folder structure (KS-011) | ✅ Done | `features/`, `server/`, `supabase/`, etc. |
| Supabase project | ✅ Done | Connected; health OK |
| Supabase client libs | ✅ Done | Browser + server + admin |
| Vercel deployment | ✅ Done | https://kaamsetu-green.vercel.app |
| PWA manifest | 🟡 Partial | Skeleton in `app/manifest.ts` — icons later |
| Domain / branding | ⬜ Not started | — |
| Database + seed | ✅ Done | Live on Supabase; bootstrap OK |
| Dispatch locality rule | ✅ Locked | Informational only — see AGENTS.md §1 |

**Stray file to clean:** `text. Text` (from test PR on GitHub — not part of KaamSetu)

---

## 3. Sprint Checkpoints (KS-009)

Progress key: ⬜ Not started · 🟡 In progress · ✅ Done · ⏸ Blocked

### Sprint 0 — Foundation (2–3 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 0.1 | Next.js + TypeScript + App Router | ✅ | KaamSetu landing |
| 0.2 | Folder structure per KS-011 | ✅ | — |
| 0.3 | Supabase project created | ✅ | `hdpilxkplygjxvjytvxu` |
| 0.4 | Vercel project + deploy | ✅ | kaamsetu-green.vercel.app |
| 0.5 | Environment variables (`.env.example`) | ✅ | Local + Vercel |
| 0.6 | ESLint + Prettier configured | 🟡 | ESLint only |
| 0.7 | App runs locally | ✅ | — |
| 0.8 | App deployed on Vercel | ✅ | KaamSetu landing live |
| 0.9 | Supabase connected | ✅ | `/api/health` OK |

**Sprint 0 exit criteria:** App runs locally · deployed on Vercel · Supabase connected  
**Sprint 0 status:** ✅ Complete (`KS-S0-foundation`)

---

### Sprint 1 — Database & Security (3–5 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 1.1 | KS-006 schema migrations | ✅ | 11 SQL files in repo |
| 1.2 | Enums, tables, indexes | ✅ | In migration pack |
| 1.3 | Storage buckets | ✅ | 007_storage_buckets.sql |
| 1.4 | KS-007 RLS policies | ✅ | 011_rls_policies.sql |
| 1.5 | RLS tested (admin/worker/public) | ✅ | Founder verified |
| 1.6 | Migrations applied on Supabase | ✅ | Bootstrap API OK |

**Sprint 1 exit criteria:** Schema deployed · RLS tested · Storage working  
**Sprint 1 status:** ✅ Complete (`KS-S1-database-rls`)

---

### Sprint 2 — Worker Module (5–7 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 2.1 | Worker login (Email OTP; Phone OTP when SMS configured) | ✅ | `/worker/login` |
| 2.2 | Profile + identity collection | ✅ | `/worker/profile` |
| 2.3 | Document upload (Aadhaar required, PAN optional) | ✅ | `worker-documents` bucket |
| 2.4 | Worker dashboard + availability toggle | ✅ | `/worker/dashboard` |

**Sprint 2 exit criteria:** Worker can login · complete profile · upload documents · toggle availability when approved  
**Sprint 2 status:** ✅ Complete + live verified (`KS-S2-worker-module`)

**Live verification (2026-06-17, founder):**
- Email OTP login + magic link callback ✅
- Profile submit (Plumber, Indira Nagar, Aadhaar) ✅
- Founder approval in Supabase ✅
- Dashboard: Approved, Available/Busy toggle ✅
- Nav: Dashboard + Profile links ✅
- Build stamp visible on deploy ✅

**Not in Sprint 2 (deferred):** Phone OTP (needs SMS provider), admin approval UI (Sprint 4), job offers (Sprint 5)

---

### Sprint 3 — Customer Request Flow (5–7 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 3.1 | Landing + invite gate | ✅ | Live |
| 3.2 | Request form + validation | ✅ | Live |
| 3.3 | Photo upload (5 max, compressed) + voice note | ✅ | Build |
| 3.4 | Track job + device saved requests | ✅ | Build |

**Sprint 3 exit criteria:** Customer creates request · job appears in admin queue  
**Sprint 3 status:** 🟡 Live test passed — UX corrections pushed (`KS-S3-customer-flow`)

**UX corrections:** Multi-photo compression, optional 60s voice note, localStorage saved requests ("My Requests"), manual track fallback. No customer login.

**Sprint 3 locked decisions (implemented):**

| # | Decision |
|---|---|
| 1 | **Required at submit:** name, mobile, service, locality only |
| 2 | Address, description, photos, voice — all optional |
| 3 | Up to 5 client-compressed photos; 1 optional 60s voice note |
| 4 | No customer login — `localStorage` saved requests + manual track fallback |
| 5 | PWA installable app experience |

**Migrations:** `013` invite seed · `014` voice media · `015` optional job fields (founder: run 015 if minimal submit fails)

---

### Sprint 4 — Admin Operations (7–10 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 4.1 | Admin login + dashboard | ⬜ | — |
| 4.2 | Worker approval queue | ⬜ | — |
| 4.3 | Job/request queue | ⬜ | — |
| 4.4 | Job detail + assisted booking entry | ⬜ | — |

**Sprint 4 exit criteria:** Founder can operate platform manually  
**Sprint 4 status:** ⬜ Not started

---

### Sprint 5 — Dispatch System (5–7 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 5.1 | Create dispatch offer (serial, one active) | ⬜ | — |
| 5.2 | Worker accept/decline | ⬜ | — |
| 5.3 | Assign worker to job | ⬜ | — |

**Sprint 5 exit criteria:** One worker receives one offer · job becomes assigned  
**Sprint 5 status:** ⬜ Not started

---

### Sprint 6 — Job Lifecycle (5–7 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 6.1 | Job status updates (worker) | ⬜ | — |
| 6.2 | Payment record | ⬜ | — |
| 6.3 | Rating + complaint | ⬜ | — |

**Sprint 6 exit criteria:** Full job lifecycle end-to-end  
**Sprint 6 status:** ⬜ Not started

---

### Sprint 7 — Closed Beta Hardening (3–5 days)

| # | Deliverable | Status | Verified |
|---|---|---|---|
| 7.1 | Bug fixes + validation review | ⬜ | — |
| 7.2 | Security review | ⬜ | — |
| 7.3 | Activity log audit | ⬜ | — |
| 7.4 | Mobile/PWA testing | ⬜ | — |

**Sprint 7 exit criteria:** 20 workers onboardable · 20 jobs executable  
**Sprint 7 status:** ⬜ Not started

---

## 4. Closed Beta Release Criteria

| Criterion | Status |
|---|---|
| Worker onboarding works | ⬜ |
| Job creation works | ⬜ |
| Dispatch works (serial offers) | ⬜ |
| Payments recorded | ⬜ |
| Complaints recorded | ⬜ |
| Ratings recorded | ⬜ |
| 0 critical security issues | ⬜ |
| 20 workers onboarded | ⬜ |
| 20 jobs completed | ⬜ |
| 5 repeat customers | ⬜ |

**Beta target:** Closed beta live in **one city cluster**, invite-only.

---

## 5. Publish Checklist — Who Does What

### ✅ AI agents can build (engineering)

- Next.js app structure, routes, UI components
- Supabase SQL migrations (KS-012), RLS (KS-007)
- API route handlers per KS-008 contracts
- PWA manifest, responsive mobile UI
- Admin / worker / customer screens per PRD
- Form validation, job state machine, activity logs
- `.env.example`, deployment config, lint/format setup
- Unit/integration tests for critical paths
- Security hardening (RLS, rate limits, input validation)

### 👤 Founder must do (cannot be delegated to code)

| Category | Action | Why |
|---|---|---|
| **Accounts** | Create Supabase project, Vercel account, connect GitHub repo | Requires your login/billing |
| **Accounts** | Register domain (e.g. `kaamsetu.in`) | Ownership + DNS |
| **Accounts** | Razorpay merchant account (when taking online payments) | KYC + bank verification |
| **Legal** | Business entity ( proprietorship / LLP / Pvt Ltd ) | Contracts, invoices, liability |
| **Legal** | DPDP privacy notice, terms of service, grievance officer | Required before public data collection |
| **Legal** | GST registration (when revenue threshold applies) | Tax compliance |
| **Operations** | Recruit & verify 20 workers in launch city | Physical trust layer |
| **Operations** | Manual KYC review (ID, selfie, background checks) | Human judgment |
| **Operations** | WhatsApp Business app + dedicated business SIM | Assisted booking channel |
| **Operations** | Create invite codes, distribute to beta customers | Closed beta control |
| **Operations** | Run dispatch, pricing, dispute resolution daily | Core MVP workflow |
| **Operations** | Confirm cash/UPI payments manually | No payment API in MVP |
| **Operations** | Customer support calls / WhatsApp replies | Trust + retention |
| **Launch city** | Pick one city + 3–5 km cluster + 5 categories max | Scope lock |
| **Content** | Service prices, locality names, Hindi/regional copy | Local market knowledge |
| **Testing** | Real-device testing with workers & customers in field | Agents can't replace field QA |
| **Budget** | Approve spend: domain (~₹500–1000/yr), optional tools | Financial decisions |

### 🤝 Shared (agent builds, founder configures)

| Item | Agent | Founder |
|---|---|---|
| Supabase env vars | Writes `.env.example` + setup docs | Copies keys into Vercel/local |
| Vercel deploy | Configures `next.config`, build | Links repo, sets env in dashboard |
| Seed data (categories, localities) | SQL seed scripts | Approves launch city data |
| Invite codes | Admin UI + DB | Decides who gets codes |
| Worker accounts | Admin create-worker flow | Decides who to onboard |

---

## 6. Active Blockers

| Blocker | Owner | Resolution |
|---|---|---|
| WhatsApp Business not setup | Founder | Phase 2.1 in FOUNDER-GROUND-WORK |
| Workers not recruited | Founder | Phase 3 — target 20 |
| Helper half/full day rates | Founder | Set in admin Settings after Sprint 4 |

---

## 7. Document Index (Source of Truth)

| Doc | Purpose |
|---|---|
| `KaamSetu Founder Blueprint v1.0.md` | Long-term business vision |
| `KaamSetu PRD v1.0.md` | MVP product spec (KS-005) |
| `KaamSetu Product Architecture and MVP Scope Lock v1.0.md` | Scope boundaries |
| `KS-006-Database-Schema-v1.0-professional.md` | Database design |
| `KS-007-Supabase-RLS-Policies-v1.0.md` | Security policies |
| `KS-008-API-Contracts-v1.0.md` | API spec |
| `KS-009-Sprint-Plan-v1.0.md` | Sprint sequence |
| `KS-011-Repository-Structure-and-Engineering-Standards-v1.0.md` | Code structure |
| `KS-012-Supabase-SQL-Migration-Pack-v1.0.md` | SQL migrations |
| `KS-013-Build-Task-Pack-v1.0.md` | Task-level execution |
| `AGENTS.md` | AI agent operating rules |
| `FOUNDER-GROUND-WORK.md` | Founder step-by-step ground ops (Hinglish) |
| `LAUNCH-CONFIG.md` | Locked launch city, categories, seed config |
| **`PROJECT-STATUS.md`** | **This file — living status** |

---

## 8. Changelog

| Date | Checkpoint | Change |
|---|---|---|
| 2026-06-17 | `KS-S3-customer-flow` fix | Minimal required fields, voice recorder repair, saved request auto-load |
| 2026-06-17 | `KS-S3-customer-flow` docs | Governance alignment: media limits, saved requests, PWA, no customer login |
| 2026-06-17 | `KS-S3-customer-flow` UX | Multi-photo compression, voice note, saved requests on device |
| 2026-06-17 | `KS-S3-customer-flow` build | Customer invite gate, request form, photo upload, track job; migration 013 invite seed |
| 2026-06-17 | `KS-S2-worker-module` live | Worker login, profile, docs, dashboard, availability — founder verified on production |
| 2026-06-17 | `2a894d8` | Worker nav, session redirect, build stamp |
| 2026-06-17 | `3bc2f05` | Submit-before-upload docs, duplicate doc replace |
| 2026-06-16 | Locality rule | Orai = one radius; locality display-only, not dispatch filter |
| 2026-06-16 | `KS-S1-database-rls` | Migrations live; bootstrap verified |
| 2026-06-16 | `KS-S0-foundation` (`b873301`) | Pushed: Supabase client, health API, landing, docs |

---

## 9. Next Recommended Action

**For founder:** Run migration `015_sprint3_optional_job_fields.sql` if not done. Re-test: minimal submit (name+phone+service+locality only), tap saved request on `/track`, voice note on supported browser.

**For agent:** Sprint 3 corrections complete. After founder re-test passes, mark Sprint 3 ✅ — do not start Sprint 4 until founder confirms.
