# KaamSetu — API Context Pack

Base: `/api` — all responses use `{ success, data }` or `{ success, error }`.

## Public (no auth, service role server-side)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/public/bootstrap` | Categories, localities, beta status |
| POST | `/api/public/invite/validate` | Validate invite code |
| POST | `/api/public/requests` | Create customer request |
| POST | `/api/public/jobs/lookup` | Track job |
| POST | `/api/public/jobs/{publicId}/media` | Upload job photos |
| POST | `/api/public/jobs/{publicId}/payments/confirm` | Customer payment confirm |
| POST | `/api/public/jobs/{publicId}/ratings` | Submit rating |
| POST | `/api/public/jobs/{publicId}/complaints` | Create complaint |

## Worker (Supabase session, role=worker)

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/worker/auth/login` | Login |
| GET | `/api/worker/me` | Current worker |
| GET/PUT | `/api/worker/profile` | Profile |
| POST | `/api/worker/documents` | Upload documents |
| GET | `/api/worker/dashboard` | Dashboard data |
| GET | `/api/worker/offers` | Pending offers |
| POST | `/api/worker/offers/{dispatchId}/accept` | Accept offer |
| POST | `/api/worker/offers/{dispatchId}/decline` | Decline offer |
| PATCH | `/api/worker/jobs/{jobId}/status` | Update job status |

## Admin (session, role=admin)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/admin/dashboard` | Metrics |
| GET | `/api/admin/workers` | Worker list |
| POST | `/api/admin/workers/{workerId}/approve` | Approve |
| POST | `/api/admin/workers/{workerId}/reject` | Reject |
| GET | `/api/admin/jobs` | Job queue |
| GET | `/api/admin/jobs/{jobId}` | Job detail |
| POST | `/api/admin/jobs/{jobId}/triage` | Validate/triage |
| POST | `/api/admin/jobs/{jobId}/dispatch-attempts` | Send offer |
| POST | `/api/admin/jobs/{jobId}/assign` | Manual assign |
| GET | `/api/admin/payments` | Payment ledger |
| GET | `/api/admin/complaints` | Complaints |
| GET/PUT | `/api/admin/settings` | Categories, localities, invites |
| GET | `/api/admin/activity-logs` | Audit log |

## Health

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/health` | Service health check |
