# KaamSetu

**Local Work. Trusted People.**

Closed-beta hyperlocal service marketplace — Next.js PWA + Supabase + Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) · Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Environment

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (server only) |

## Docs

- `docs/PROJECT-STATUS.md` — live progress
- `docs/FOUNDER-GROUND-WORK.md` — founder checklist (Hinglish)
- `AGENTS.md` — AI agent rules
- `docs/context/` — sprint context packs

## Stack

Next.js 16 · TypeScript · Tailwind · Supabase · Vercel
