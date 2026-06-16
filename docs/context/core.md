# KaamSetu — Core Context (for AI agents)

**Tagline:** Local Work. Trusted People.  
**Phase:** Sprint 0 → Sprint 1 next  
**Status:** `docs/PROJECT-STATUS.md`

## Product in one paragraph

Closed-beta, invite-only, dispatch-led hyperlocal marketplace. One Next.js PWA, one Supabase backend, one founder-admin. Customers request without login; founder dispatches serially to workers; workers accept/decline via authenticated PWA.

## Stack

- Next.js 16 App Router · TypeScript · Tailwind 4
- Supabase (Auth, Postgres, Storage, RLS)
- Vercel deploy

## Non-negotiables

1. Serial dispatch — one active offer per job
2. No customer login in MVP
3. No SMS OTP — password auth only
4. One jobs table for all channels
5. Three pricing modes on one job model

## Forbidden before beta

Wallet, chat, maps, live tracking, ads, referrals, native apps, WhatsApp API, AI matching, auto-pricing.

## Key docs

| Doc | Use |
|---|---|
| PRD | Feature spec |
| KS-006 | Database |
| KS-007 | RLS |
| KS-008 | API contracts |
| KS-009 | Sprint order |
| AGENTS.md | Full agent rules |
