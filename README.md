# KaamSetu

**Local Work. Trusted People.**

KaamSetu is a PWA-first local services platform for Orai, Uttar Pradesh. This repository follows the engineering standards in `docs/KS-011-Repository-Structure-and-Engineering-Standards-v1.0.md`.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage)
- Vercel
- Vitest + Playwright

## Project structure

```text
app/           Next.js routes (public, worker, admin, api)
components/    Shared presentational UI
features/      Feature modules (actions, queries, schemas, types)
server/        Business logic, auth, Supabase clients
lib/           Generic utilities and constants
types/         Shared enums and API types
supabase/      SQL migrations and seed references
docs/          Architecture documents and AI context packs
tests/         Unit and E2E tests
```

## Getting started

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only service role key |
| `TRACK_CODE_PEPPER` | Server-only HMAC pepper for tracking codes |
| `APP_ENV` | `development` or `production` |
| `APP_BASE_URL` | Public app URL |
| `ADMIN_BOOTSTRAP_EMAIL` | Initial admin bootstrap email |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

## Architecture rules

1. Pages are thin — call feature actions, not Supabase directly.
2. Three Supabase clients: browser, server, admin (server-only).
3. All APIs return `{ success, data }` or `{ success, error }`.
4. State transitions live in `server/state-machines/`.
5. Every mutation must call `logActivity()`.

## Documentation

- Engineering standards: `docs/KS-011-Repository-Structure-and-Engineering-Standards-v1.0.md`
- Build tasks: `docs/KS-013-Build-Task-Pack-v1.0.md`
- AI context packs: `docs/context/`
- Database migrations: `supabase/README.md`

## Current status

**Sprint 0 complete** — repository foundation and boilerplate are in place. Feature implementation begins in Sprint 1 (Supabase setup) and Sprint 2 (admin shell).
