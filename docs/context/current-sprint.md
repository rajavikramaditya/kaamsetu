# Current Sprint: Sprint 0 — Repository Foundation

## Goal

Establish clean project foundation per KS-013 Task 0.x.

## Status

- [x] Next.js app with TypeScript + App Router
- [x] Folder structure (KS-011)
- [x] `.env.example`
- [x] Supabase migration files (KS-012)
- [x] Core server modules and types
- [x] API route stubs
- [x] Page route stubs
- [x] Context packs
- [ ] Supabase project connected
- [ ] Migrations applied
- [ ] Database types generated

## Allowed Files

All boilerplate scaffolding. No feature business logic yet.

## Forbidden Changes

- No wallet, chat, maps, or out-of-scope features
- No service role in client code
- No direct Supabase calls from components
- No unversioned SQL changes

## Next Sprint

**Sprint 1:** Run migrations, generate `types/database.types.ts`, connect Supabase.

**Sprint 2:** Minimal admin shell — auth guard, dashboard, settings, worker approval.

## Acceptance

- App runs locally (`npm run dev`)
- Build passes (`npm run build`)
- `/api/health` returns success
- Folder structure matches KS-011
