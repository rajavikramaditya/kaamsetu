# KaamSetu — AI Agent Guide

**Project:** KaamSetu · *Local Work. Trusted People.*  
**Stack:** Next.js 16 (App Router) · TypeScript · Supabase · Vercel · PWA  
**Status doc:** `docs/PROJECT-STATUS.md` — **update after every successful checkpoint**

---

## 1. What This Project Is

KaamSetu v1 is a **closed-beta, invite-only, dispatch-led hyperlocal service marketplace** for one founder operating in one city cluster.

It is **not** an open marketplace, not Urban Company, and not a super-app.

### Core MVP loop

```text
Customer request (PWA, no login) → Admin triage & dispatch → Worker accept/decline
→ Job status updates → Payment record → Rating / complaint
```

### Three user types

| Role | Auth | Access |
|---|---|---|
| **Customer** | None (invite code + track token) | Submit request, track job, rate |
| **Worker** | Supabase Auth (Email OTP now; Phone OTP when SMS configured) | Profile, KYC, offers, job updates |
| **Admin** | Supabase Auth (`role=admin`) | Full platform control |

### Critical product rules (never violate)

1. **Serial dispatch only** — one active dispatch offer per job at any time.
2. **No customer login** in MVP.
3. **Worker auth** — Email OTP for closed beta (low cost). Phone OTP code path kept for when SMS provider is configured. Worker identity = profile phone + Aadhaar.
4. **One booking engine** — PWA and assisted (WhatsApp/phone) bookings share the same `jobs` table; differ only by `source_channel`.
5. **Three pricing modes, one job model** — `fixed_price`, `quote_required`, `daily_wage` via `pricing_mode` field; never three separate booking systems.
6. **Founder-controlled** — no auto-pricing, no parallel bidding, no AI matching.
7. **PWA-first** — no native Android/iOS apps before closed beta.
8. **Worker Freedom Principle** — In MVP, worker dispatch must **not** be restricted by locality. Locality is informational metadata only. Dispatch eligibility is based on **category, approval status, availability, and manual founder decision**. Workers may accept jobs anywhere in Orai; job locality must be **visible** on the offer card before accept/decline.

---

## 2. What NOT to Build (MVP Forbidden List)

Do **not** add these unless explicitly requested and documented in a post-MVP phase:

- Native apps · Wallet · Escrow · In-app chat · Maps · Live tracking
- SMS OTP (paid SMS provider) · Push notifications · WhatsApp API automation · IVR
- Ads · Referrals · Coupons · Subscriptions · Auto-pricing · AI matching
- Public worker discovery · Parallel multi-worker bidding
- Razorpay API integration (manual payment links only, later)
- Customer accounts / login / history (delay until 100 jobs)

If a feature does not improve **request capture, matching, execution, payment recording, or trust** — reject it.

---

## 3. Architecture

```text
Customer PWA ──┐
Worker PWA  ──┼── Next.js App Router (single deployable app)
Admin panel ──┘         │
                        ├── Route handlers (/app/api/...)
                        └── Server modules (/server/...)
                                  │
                        Supabase PostgreSQL + Storage + RLS
                                  │
                        Manual WhatsApp Business (external, not coded)
```

### Target folder structure (KS-011)

```text
app/           # Routes (customer/, worker/, admin/, api/)
components/    # Shared UI
features/      # Domain modules (jobs, workers, dispatch, etc.)
lib/           # Utilities, Supabase client, validators
server/        # Server-only business logic
supabase/      # Migrations, seed SQL
types/         # Shared TypeScript types
docs/          # Specs + PROJECT-STATUS.md
```

Match existing patterns before inventing new abstractions. One sprint = one working layer.

---

## 4. Source-of-Truth Documents

Read these **before** implementing a feature area:

| When working on… | Read |
|---|---|
| Any feature | `docs/KaamSetu PRD v1.0.md` |
| Scope questions | `docs/KaamSetu Product Architecture and MVP Scope Lock v1.0.md` |
| Database | `docs/KS-006-Database-Schema-v1.0-professional.md` |
| Security / RLS | `docs/KS-007-Supabase-RLS-Policies-v1.0.md` |
| API routes | `docs/KS-008-API-Contracts-v1.0.md` |
| Sprint order | `docs/KS-009-Sprint-Plan-v1.0.md` |
| Code structure | `docs/KS-011-Repository-Structure-and-Engineering-Standards-v1.0.md` |
| SQL migrations | `docs/KS-012-Supabase-SQL-Migration-Pack-v1.0.md` |
| Task breakdown | `docs/KS-013-Build-Task-Pack-v1.0.md` |
| Current progress | `docs/PROJECT-STATUS.md` |

Do **not** create new planning documents. Implement from KS-005 through KS-013.

---

## 5. Next.js Rules

<!-- BEGIN:nextjs-agent-rules -->
This is NOT the Next.js you know. This project uses **Next.js 16** with breaking changes — APIs, conventions, and file structure may differ from your training data. **Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code.** Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Additional rules:

- Use **App Router** only (no Pages Router).
- Prefer **Server Components**; add `"use client"` only when needed.
- API logic in route handlers must match **KS-008** contracts exactly.
- Never expose Supabase service-role key to the client.
- Use RLS for authorization — do not rely on client-side role checks alone.

---

## 6. Supabase Rules

- All tables defined in KS-006; apply via KS-012 migration pack.
- Every table must have RLS policies from KS-007 before production data.
- Storage buckets: worker documents and job media only (per PRD).
- Auth: Email OTP for workers (closed beta). Phone OTP when SMS provider configured. Admin email/password.
- Admin role stored in user metadata or `profiles.role` — verify server-side.

---

## 7. Coding Standards

- **TypeScript strict** — no `any` unless unavoidable and commented.
- **Minimize scope** — one sprint task at a time; no drive-by refactors.
- **Match conventions** — read surrounding code before adding files.
- **No over-engineering** — no premature abstractions, microservices, or extra packages.
- **Validation** — Zod or equivalent at API boundaries; match PRD field rules.
- **Activity log** — write audit entries for admin actions (approvals, dispatch, status changes).
- **Job state machine** — follow PRD states; never skip states or allow invalid transitions.
- **Category pricing** — seed from `docs/LAUNCH-CONFIG.md`; include `standard_visit_charge` on `service_categories`. Admin Settings (Sprint 4) must allow founder to edit visit charge and pricing mode without code changes.

---

## 8. Sprint Execution Protocol

1. Check `docs/PROJECT-STATUS.md` for current sprint and blockers.
2. Implement only the **current sprint** deliverables (KS-009 order).
3. Map every change to a KS document — if it isn't in the PRD, don't build it.
4. After completing a checkpoint → follow **§8.1 Git Checkpoint Protocol** (mandatory).
5. If architecture conflict found → stop, note in PROJECT-STATUS, do not hack around it.

### Sprint order (do not skip)

```text
Sprint 0: Foundation → Sprint 1: DB + RLS → Sprint 2: Worker
→ Sprint 3: Customer flow → Sprint 4: Admin → Sprint 5: Dispatch
→ Sprint 6: Job lifecycle → Sprint 7: Beta hardening → Closed Beta
```

### 8.1 Git Checkpoint Protocol (mandatory)

After every **validated** sprint checkpoint, the agent **must** commit and push to `origin/main` without waiting for the founder to ask.

**When to commit**

- All acceptance criteria for the checkpoint are met (see KS-009 + `docs/PROJECT-STATUS.md`).
- `npm run build` passes (or equivalent verification for that checkpoint).
- `docs/PROJECT-STATUS.md` updated (status, changelog, blockers).
- `docs/context/current-sprint.md` updated if sprint scope changed.

**When NOT to commit**

- Checkpoint incomplete or unverified.
- Build or lint fails and is not fixed.
- Files contain secrets (`.env.local`, API keys, passwords).
- Only founder-side ops steps done (no code changes) — update PROJECT-STATUS only.

**Checkpoint naming (KS-009 aligned)**

Use this ID in commit message and PROJECT-STATUS changelog:

| Sprint | Checkpoint ID | Commit subject prefix |
|---|---|---|
| Sprint 0 | `KS-S0-foundation` | `checkpoint: KS-S0-foundation` |
| Sprint 1 | `KS-S1-database-rls` | `checkpoint: KS-S1-database-rls` |
| Sprint 2 | `KS-S2-worker-module` | `checkpoint: KS-S2-worker-module` |
| Sprint 3 | `KS-S3-customer-flow` | `checkpoint: KS-S3-customer-flow` |
| Sprint 4 | `KS-S4-admin-ops` | `checkpoint: KS-S4-admin-ops` |
| Sprint 5 | `KS-S5-dispatch` | `checkpoint: KS-S5-dispatch` |
| Sprint 6 | `KS-S6-job-lifecycle` | `checkpoint: KS-S6-job-lifecycle` |
| Sprint 7 | `KS-S7-beta-hardening` | `checkpoint: KS-S7-beta-hardening` |

**Commit message format**

```text
checkpoint: KS-S0-foundation — short description of what was validated

Optional body: bullet list of deliverables verified.
```

**Push workflow (every checkpoint)**

```text
1. git status + git diff — confirm no secrets staged
2. git add (relevant files only — never .env.local)
3. git commit -m "checkpoint: KS-Sx-name — ..."
4. git push origin main
5. Confirm push succeeded; note live URL if Vercel redeploys
6. Update PROJECT-STATUS changelog with checkpoint ID + commit hash
```

**Branch rule:** Push directly to `main` unless founder requests a feature branch.

**Do not ask "should I push?"** after a validated checkpoint — push is part of the protocol.

---

## 9. Common Mistakes to Avoid

| Mistake | Correct approach |
|---|---|
| Building marketplace discovery UI | Founder dispatches; customer never picks workers |
| Restricting dispatch by worker locality | Locality is display-only; filter by category + availability |
| Adding paid SMS OTP before provider setup | Email OTP for workers now; Phone OTP when SMS configured |
| Multiple active offers per job | Serial dispatch — one offer at a time |
| Separate WhatsApp booking system | Same `jobs` table, `source_channel = assisted` |
| Three booking flows for pricing modes | One job model with `pricing_mode` enum |
| Client-side admin checks only | RLS + server-side role verification |
| Feature creep (maps, chat, wallet) | Check forbidden list above |
| Skipping PROJECT-STATUS update | Always update after checkpoint success |
| Skipping git push after validated checkpoint | Follow §8.1 Git Checkpoint Protocol |
| Ignoring KS-008 API shapes | Match contracts exactly for frontend/backend parity |
| Using training-data Next.js patterns | Read `node_modules/next/dist/docs/` first |

---

## 10. Environment & Secrets

- Never commit `.env`, `.env.local`, or Supabase keys.
- Maintain `.env.example` with required variable names (no real values).
- Expected vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only).

---

## 11. Testing Before Marking Done

- API route returns match KS-008 response shapes.
- RLS: test as anonymous, worker, and admin roles.
- Mobile viewport: customer and worker flows are phone-first.
- Serial dispatch: verify only one active offer per job.
- Full loop: request → admin queue → dispatch → accept → complete → pay → rate.

---

## 12. Founder vs Agent Boundaries

**Agent builds:** code, schema, migrations, UI, API, tests, deployment config.  
**Founder must:** create Supabase/Vercel accounts, domain, recruit workers, manual KYC, dispatch operations, WhatsApp SIM, legal pages, invite code distribution, field testing.

See `docs/PROJECT-STATUS.md` §5 for full publish checklist.
