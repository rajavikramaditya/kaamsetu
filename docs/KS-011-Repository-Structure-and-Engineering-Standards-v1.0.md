# KS-011 Repository Structure & Engineering Standards v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Document Type:** Repository Architecture & Engineering Standards  
**Version:** 1.0  
**Status:** Build Preparation Approved  
**Depends On:**  
- KS-005 PRD v1.0  
- KS-006 Database Schema v1.0  
- KS-007 Supabase RLS Policies v1.0  
- KS-008 API Contracts v1.0  
- KS-010 Architecture Audit & Gap Analysis v1.0  

---

## 1. Purpose

This document defines the official KaamSetu codebase structure and engineering rules.

Goal:

- Keep MVP low-cost.
- Avoid over-engineering.
- Avoid future rewrites.
- Keep admin, worker, customer, API, and database logic modular.
- Make the project AI-agent friendly.
- Support future extraction without major architecture breakage.

---

## 2. Core Architecture Decision

KaamSetu will start as a **single Next.js application**.

But internally it will be structured as a **modular product system**, not a messy single-folder app.

This means:

```text
One deployable app today.
Clear module boundaries for tomorrow.
```

Current deployment:

```text
Next.js PWA
↓
Vercel
↓
Supabase PostgreSQL + Storage
```

Future-ready path:

```text
Same repo structure
↓
Admin can become separate app later
Worker PWA can become native wrapper later
Customer PWA can become public app later
API can move to separate backend later
```

No rewrite should be required if boundaries are respected.

---

## 3. Repository Root Structure

Recommended root:

```text
kaamsetu/
│
├── app/
├── components/
├── features/
├── lib/
├── server/
├── supabase/
├── scripts/
├── tests/
├── docs/
├── public/
├── types/
├── .env.example
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. App Router Structure

Use Next.js App Router.

```text
app/
│
├── (public)/
│   ├── page.tsx
│   ├── request/
│   │   └── page.tsx
│   ├── track/
│   │   └── page.tsx
│   └── layout.tsx
│
├── worker/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── offers/
│   │   └── [dispatchId]/
│   │       └── page.tsx
│   └── jobs/
│       └── [jobId]/
│           └── page.tsx
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── workers/
│   │   └── page.tsx
│   ├── jobs/
│   │   ├── page.tsx
│   │   └── [jobId]/
│   │       └── page.tsx
│   ├── dispatch/
│   │   └── page.tsx
│   ├── payments/
│   │   └── page.tsx
│   ├── complaints/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── activity-logs/
│       └── page.tsx
│
├── api/
│   ├── public/
│   ├── worker/
│   ├── admin/
│   └── health/
│
├── manifest.ts
├── layout.tsx
└── globals.css
```

---

## 5. Why Admin Stays Inside Same App for MVP

Admin panel remains inside the same Next.js app at:

```text
/admin
```

Reason:

- Lower cost
- Faster development
- Same auth system
- Same database client
- Same deployment
- Easier solo-founder maintenance

Future safety:

Admin code must be isolated under:

```text
app/admin/
features/admin/
server/admin/
```

This makes it possible to extract admin into a separate app later if needed.

---

## 6. Feature Module Structure

Use feature-based organization.

```text
features/
│
├── public-request/
├── customer-tracking/
├── worker-auth/
├── worker-profile/
├── worker-offers/
├── worker-jobs/
├── admin-dashboard/
├── admin-workers/
├── admin-jobs/
├── admin-dispatch/
├── admin-payments/
├── admin-complaints/
├── admin-settings/
└── activity-logs/
```

Each feature should contain:

```text
components/
actions.ts
schemas.ts
types.ts
queries.ts
```

Example:

```text
features/admin-jobs/
│
├── components/
│   ├── JobQueueTable.tsx
│   └── JobStatusBadge.tsx
├── actions.ts
├── queries.ts
├── schemas.ts
└── types.ts
```

---

## 7. Server Folder Structure

All database and business logic goes under:

```text
server/
│
├── db/
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   └── supabase-admin.ts
│
├── auth/
│   ├── require-admin.ts
│   ├── require-worker.ts
│   └── session.ts
│
├── public/
│   ├── create-request.ts
│   ├── validate-invite.ts
│   └── track-job.ts
│
├── worker/
│   ├── profile.ts
│   ├── offers.ts
│   └── jobs.ts
│
├── admin/
│   ├── workers.ts
│   ├── jobs.ts
│   ├── dispatch.ts
│   ├── payments.ts
│   ├── complaints.ts
│   └── settings.ts
│
├── logging/
│   └── activity-log.ts
│
└── security/
    ├── hash-track-code.ts
    ├── rate-limit.ts
    └── sanitize-log-metadata.ts
```

Rule:

> No business logic directly inside page components.

Pages call feature actions.  
Feature actions call server modules.  
Server modules talk to Supabase.

---

## 8. Supabase Client Rules

Three clients only:

### Browser Client

```text
server/db/supabase-browser.ts
```

Use only for safe authenticated frontend reads where allowed.

### Server Client

```text
server/db/supabase-server.ts
```

Uses user session.

### Admin Client

```text
server/db/supabase-admin.ts
```

Uses service role.

Rules:

- Admin client must be server-only.
- Never import admin client into client components.
- Never expose service role key.
- Public customer routes use admin client only inside route handler.

---

## 9. API Route Structure

```text
app/api/
│
├── public/
│   ├── bootstrap/route.ts
│   ├── invite/validate/route.ts
│   ├── requests/route.ts
│   └── jobs/
│       ├── lookup/route.ts
│       └── [publicId]/
│           ├── media/route.ts
│           ├── payments/confirm/route.ts
│           ├── ratings/route.ts
│           └── complaints/route.ts
│
├── worker/
│   ├── auth/login/route.ts
│   ├── me/route.ts
│   ├── profile/route.ts
│   ├── documents/route.ts
│   ├── dashboard/route.ts
│   ├── offers/route.ts
│   ├── offers/[dispatchId]/accept/route.ts
│   ├── offers/[dispatchId]/decline/route.ts
│   └── jobs/[jobId]/status/route.ts
│
└── admin/
    ├── dashboard/route.ts
    ├── workers/route.ts
    ├── workers/[workerId]/approve/route.ts
    ├── workers/[workerId]/reject/route.ts
    ├── jobs/route.ts
    ├── jobs/[jobId]/route.ts
    ├── jobs/[jobId]/triage/route.ts
    ├── jobs/[jobId]/dispatch-attempts/route.ts
    ├── jobs/[jobId]/assign/route.ts
    ├── payments/route.ts
    ├── complaints/route.ts
    ├── settings/route.ts
    └── activity-logs/route.ts
```

All APIs must follow KS-008 final route naming and PRD contract.

---

## 10. Supabase Folder Structure

```text
supabase/
│
├── migrations/
│   ├── 001_extensions.sql
│   ├── 002_enums.sql
│   ├── 003_tables.sql
│   ├── 004_indexes.sql
│   ├── 005_triggers.sql
│   ├── 006_storage.sql
│   ├── 007_rls.sql
│   └── 008_seed.sql
│
├── seed/
│   ├── categories.sql
│   ├── localities.sql
│   └── invite_codes.sql
│
└── README.md
```

This folder is mandatory before coding Sprint 1.

---

## 11. Types Folder

```text
types/
│
├── database.types.ts
├── api.types.ts
├── enums.ts
└── common.ts
```

Rules:

- Database types should be generated from Supabase if possible.
- API types should match KS-008.
- Do not duplicate enum strings randomly across files.
- Put shared enum constants in `types/enums.ts`.

---

## 12. Lib Folder

```text
lib/
│
├── constants/
│   ├── app.ts
│   ├── routes.ts
│   └── limits.ts
│
├── validation/
│   ├── phone.ts
│   ├── files.ts
│   └── amounts.ts
│
├── formatting/
│   ├── currency.ts
│   ├── date.ts
│   └── status-labels.ts
│
└── utils/
    ├── result.ts
    └── assert.ts
```

Rule:

Generic reusable utilities only.

No feature-specific business logic in `lib`.

---

## 13. Components Folder

```text
components/
│
├── ui/
├── layout/
├── forms/
├── status/
└── feedback/
```

Rules:

- UI components should be dumb/presentational.
- No Supabase calls inside shared UI components.
- No business decisions inside UI components.

---

## 14. Documentation Folder

```text
docs/
│
├── KS-001-Project-Charter.md
├── KS-002-Founder-Blueprint.md
├── KS-003-Implementation-Blueprint.md
├── KS-004-MVP-Scope-Lock.md
├── KS-005-PRD.md
├── KS-006-Database-Schema.md
├── KS-007-RLS-Policies.md
├── KS-008-API-Contracts.md
├── KS-009-Sprint-Plan.md
├── KS-010-Architecture-Audit.md
├── KS-011-Repository-Structure.md
└── context/
    ├── core.md
    ├── schema.md
    ├── api.md
    └── current-sprint.md
```

Important:

AI agents should not be given every document every time.

Use the `/docs/context/` folder for short task-specific context.

---

## 15. AI Context Pack Strategy

To solve AI context overload:

Create small context files:

### docs/context/core.md

Contains:

- product purpose
- stack
- MVP exclusions
- build rules

### docs/context/schema.md

Contains:

- relevant tables only

### docs/context/api.md

Contains:

- relevant endpoints only

### docs/context/current-sprint.md

Contains:

- current task
- accepted files
- forbidden changes

Rule:

> AI agents get context packs, not the entire history.

---

## 16. Environment Variables

Use `.env.example`.

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

TRACK_CODE_PEPPER=

APP_ENV=development
APP_BASE_URL=http://localhost:3000

ADMIN_BOOTSTRAP_EMAIL=
```

Rules:

- `NEXT_PUBLIC_*` values can be exposed.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed.
- `TRACK_CODE_PEPPER` must never be exposed.
- `.env.local` must never be committed.

---

## 17. Coding Standards

## TypeScript

- Strict mode enabled
- No `any` unless justified
- Use explicit return types for server functions
- Use Zod for request validation

## React

- Use server components by default
- Use client components only for forms/interactions
- Keep page files thin
- Move reusable UI into components

## API

- Validate every request body
- Return standard success/error format
- Never leak stack traces
- Log every mutation

## Database

- Do not bypass server validations
- Do not write raw SQL inside page components
- Keep migration files versioned

---

## 18. Error Handling Standard

Every API response must follow:

```json
{
  "success": true,
  "data": {}
}
```

or

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "field_errors": {}
  }
}
```

Allowed error codes:

- VALIDATION_ERROR
- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- CONFLICT
- RATE_LIMITED
- UPLOAD_ERROR
- INVALID_STATE_TRANSITION
- INTERNAL_ERROR

---

## 19. Logging Standard

Every mutation must call:

```text
logActivity()
```

Required metadata:

- actor_type
- actor_user_id
- entity_type
- entity_id
- action
- source
- safe metadata

Do not log:

- raw tracking code
- raw password
- full government ID
- service role key
- document content

---

## 20. Testing Standards

Use:

- Vitest for unit tests
- Playwright for critical E2E flows

Initial tests:

```text
tests/
│
├── unit/
│   ├── validation.test.ts
│   └── state-machines.test.ts
│
└── e2e/
    ├── public-request.spec.ts
    ├── worker-onboarding.spec.ts
    └── admin-dispatch.spec.ts
```

No Cypress in MVP.

---

## 21. State Machine Rules

State transitions should be centralized.

```text
server/state-machines/
│
├── booking.ts
├── dispatch.ts
├── payment.ts
└── complaint.ts
```

No route handler should invent transitions independently.

---

## 22. Future Extraction Safety

To avoid future rewrites:

| Future Need | Current Boundary |
|---|---|
| Separate admin app | app/admin + features/admin + server/admin |
| Native Android app | API routes already separated |
| Dedicated backend | server modules are extractable |
| More cities | localities table and admin settings |
| More roles | auth metadata and RLS helpers |
| More automation | API boundaries already defined |

This structure supports long-term growth without overbuilding MVP.

---

## 23. Forbidden MVP Patterns

Do not create:

- `/utils` dumping ground
- random Supabase calls in components
- duplicate enum strings
- hardcoded status logic inside UI
- service role import in browser code
- one giant admin page
- one giant API route
- unversioned SQL changes
- undocumented state transitions

---

## 24. Build Start Checklist

Before coding:

- [ ] Repo initialized
- [ ] Docs folder created
- [ ] .env.example added
- [ ] Supabase project created
- [ ] Vercel project created
- [ ] App runs locally
- [ ] Folder structure created
- [ ] Supabase migration folder created
- [ ] Context pack files created
- [ ] AI agent rules added

---

## 25. Final Verdict

KaamSetu will use a single Next.js repository for MVP, but with strict module boundaries.

This gives:

- lowest cost now
- fastest build now
- clean future extraction later
- no forced admin rewrite
- no forced backend rewrite
- no forced customer app rewrite

Next document:

**KS-012 Supabase SQL Migration Pack v1.0**
