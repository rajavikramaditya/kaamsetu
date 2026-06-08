# KaamSetu — Core Context Pack

## Product

**KaamSetu** — Local Work. Trusted People.

MVP connects customers with trusted local workers for home services in Orai, UP.

## Stack

- **Frontend:** Next.js 16 App Router, TypeScript, Tailwind CSS, PWA
- **Backend:** Next.js Route Handlers + server modules
- **Database:** Supabase PostgreSQL + Storage
- **Deploy:** Vercel

## Architecture Rules

1. Single Next.js app with strict module boundaries
2. Pages → feature actions → server modules → Supabase
3. No business logic in page components
4. Three Supabase clients only: browser, server, admin (service role)
5. Admin client is server-only — never in client components
6. Public customer flows use route handlers + service role
7. Every mutation logs via `logActivity()`
8. State transitions use `server/state-machines/`
9. API responses follow `{ success, data }` or `{ success, error }`

## MVP Exclusions (Forbidden)

Wallet, chat, maps, live tracking, ads, referrals, coupons, subscriptions, native apps, AI matching, WhatsApp API automation, IVR automation.

## Module Boundaries

| Surface | App Routes | Features | Server |
|---------|-----------|----------|--------|
| Public | `app/(public)/` | `features/public-request/` | `server/public/` |
| Worker | `app/worker/` | `features/worker-*/` | `server/worker/` |
| Admin | `app/admin/` | `features/admin-*/` | `server/admin/` |

## Key Docs

- KS-011: Repository structure
- KS-012: SQL migrations
- KS-008: API contracts
- KS-006: Database schema
