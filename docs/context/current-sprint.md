# Current Sprint: Sprint 0 — Repository Foundation

## Goal

Create a clean, architecture-compliant project foundation before feature coding.

## Tasks

- [x] Next.js + TypeScript + App Router
- [x] Folder structure per KS-011
- [x] `.env.example`
- [x] Supabase migration folder (KS-012)
- [x] Context packs for AI agents
- [x] Core server/lib/types scaffolding
- [x] API route stubs
- [x] Page stubs for all surfaces

## Allowed files

Any file under the repository root structure defined in KS-011.

## Forbidden changes

- No wallet, chat, maps, or other MVP-excluded features
- No service role key in client code
- No raw tracking code storage
- No business logic in shared UI components
- No new planning documents

## Acceptance criteria

1. `npm run dev` starts locally
2. `npm run build` succeeds
3. `GET /api/health` returns success
4. Landing page loads at `/`
5. Folder structure matches KS-011

## Next sprint

Sprint 1 — run Supabase migrations and generate `types/database.types.ts`
