# API Context (Sprint 0)

Base path: `/api`

## Implemented

- `GET /api/health` — service health check

## Scaffolded (501 until sprint implementation)

### Public

- `GET /api/public/bootstrap`
- `POST /api/public/invite/validate`
- `POST /api/public/requests`
- `POST /api/public/jobs/lookup`
- `POST /api/public/jobs/[publicId]/media`
- `POST /api/public/jobs/[publicId]/payments/confirm`
- `POST /api/public/jobs/[publicId]/ratings`
- `POST /api/public/jobs/[publicId]/complaints`

### Worker

- `POST /api/worker/auth/login`
- `GET /api/worker/me`
- `GET|PUT /api/worker/profile`
- `POST /api/worker/documents`
- `GET /api/worker/dashboard`
- `GET /api/worker/offers`
- `POST /api/worker/offers/[dispatchId]/accept|decline`
- `POST /api/worker/jobs/[jobId]/status`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/workers`
- `POST /api/admin/workers/[workerId]/approve|reject`
- `GET /api/admin/jobs`, `GET /api/admin/jobs/[jobId]`
- `POST /api/admin/jobs/[jobId]/triage|assign`
- `GET|POST /api/admin/jobs/[jobId]/dispatch-attempts`
- `GET /api/admin/payments`
- `GET /api/admin/complaints`
- `GET|PUT /api/admin/settings`
- `GET /api/admin/activity-logs`

Full spec: `docs/KS-008-API-Contracts-v1.0.md`

Response format: `types/common.ts`
