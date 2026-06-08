# KaamSetu

**Local Work. Trusted People.**

KaamSetu is a PWA-first platform connecting customers with trusted local workers for home services. Built as a single Next.js application with strict module boundaries for future extraction.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (PostgreSQL + Storage + Auth)
- **Vercel** deployment

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in Supabase credentials and `TRACK_CODE_PEPPER`.

### 3. Run database migrations

Apply SQL files in `supabase/migrations/` to your Supabase project (see `supabase/README.md`).

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
app/           # Next.js App Router (public, worker, admin, api)
components/    # Shared presentational UI
features/      # Feature modules (actions, schemas, queries, types)
lib/           # Generic utilities, constants, validation
server/        # Business logic, auth, db clients, state machines
supabase/      # SQL migrations and seed data
types/         # Shared TypeScript types
tests/         # Vitest unit + Playwright E2E
docs/          # Architecture docs and AI context packs
```

See [KS-011](docs/KS-011-Repository-Structure-and-Engineering-Standards-v1.0.md) for full standards.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

## Architecture Rules

1. Pages call feature actions → server modules → Supabase
2. No business logic in page components
3. Service role key is server-only
4. Every mutation logs to `activity_logs`
5. State transitions use centralized state machines

## Documentation

- `docs/KS-011` — Repository structure & engineering standards
- `docs/KS-012` — Supabase SQL migration pack
- `docs/KS-008` — API contracts
- `docs/context/` — AI agent context packs

## MVP Scope

Included: invite-gated requests, worker onboarding, admin dispatch, payments, ratings, complaints.

Excluded: wallet, chat, maps, native apps, AI matching, ads.
