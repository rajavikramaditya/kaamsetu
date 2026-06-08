# KaamSetu Core Context

## Product

**KaamSetu** — Local Work. Trusted People.

MVP connects customers in Orai with verified local workers for home services (electrician, plumber, carpenter, AC repair, helper/labour).

## Stack

- Next.js App Router (TypeScript)
- Supabase PostgreSQL + Storage + Auth
- Vercel deployment
- PWA (no native apps in MVP)

## Architecture

Single Next.js app with strict module boundaries:

- `app/` — routes (public, worker, admin, api)
- `features/` — feature modules (components, actions, queries, schemas, types)
- `server/` — business logic and Supabase access
- `lib/` — generic utilities only
- `types/` — shared enums and API types

Flow: **Page → feature action → server module → Supabase**

## MVP exclusions (forbidden)

- Wallet / escrow
- Chat
- Maps / live tracking
- Ads / referrals / coupons / subscriptions
- Native Android/iOS apps
- AI matching
- WhatsApp API / IVR automation

## Build rules

1. No business logic in page components.
2. Three Supabase clients only: browser, server, admin (server-only).
3. Never expose `SUPABASE_SERVICE_ROLE_KEY` or `TRACK_CODE_PEPPER`.
4. Never store raw tracking codes.
5. All API responses use `{ success, data }` or `{ success, error }`.
6. Every mutation must call `logActivity()`.
7. State transitions use `server/state-machines/`.
8. Validate requests with Zod.

## Role boundaries

| Surface | Path prefix | Auth |
|---------|-------------|------|
| Customer | `/`, `/request`, `/track` | None (invite + track code) |
| Worker | `/worker/*` | Supabase session (worker role) |
| Admin | `/admin/*` | Supabase session (admin role) |

## Current phase

Sprint 0 — repository foundation (see `current-sprint.md`).
