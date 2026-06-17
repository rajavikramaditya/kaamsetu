# KS-008 API Contracts v1.0

**Project:** KaamSetu  
**Version:** 1.0  
**Document Type:** API Contract Specification  
**Status:** MVP Approved  
**Depends On:** KS-005 PRD, KS-006 Database Schema, KS-007 RLS Policies

---

# Table of Contents

1. API Philosophy
2. Standards
3. Authentication Model
4. Public APIs
5. Worker APIs
6. Admin APIs
7. Response Standards
8. Error Standards
9. Validation Rules
10. State Transition Rules
11. Rate Limiting
12. Activity Logging Requirements
13. API Freeze Checklist

---

# 1. API Philosophy

Rules:

- Thin frontend
- Business logic on server
- Database never accessed directly from customer UI
- Route Handlers are source of truth
- Every mutation generates activity log

Base URL:

```text
/api
```

Version:

```text
v1
```

---

# 2. Standards

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message"
  }
}
```

---

# 3. Authentication Model

Public:
No auth.

Worker:
Supabase session required.

Admin:
Admin role required.

---

# 4. Public APIs

## POST /api/public/invite/validate

Purpose:
Validate invite code.

Request

```json
{
  "invite_code": "ABC123"
}
```

Response

```json
{
  "success": true,
  "valid": true
}
```

---

## GET /api/public/bootstrap

Purpose:
Fetch localities and categories.

Response

```json
{
  "categories": [],
  "localities": []
}
```

---

## POST /api/public/requests

Purpose:
Create customer request.

Request

```json
{
  "invite_code":"ABC123",
  "full_name":"Vikram",
  "phone":"9999999999",
  "locality_id":"uuid",
  "category_id":"uuid",
  "description":"Fan repair required",
  "address":"Full address"
}
```

Response

```json
{
  "success": true,
  "job_id": "uuid",
  "public_id": "uuid",
  "job_ref": "KS-000001",
  "track_code": "123456",
  "booking_status": "requested",
  "next_step": "photo_upload"
}
```

---

## POST /api/public/jobs/{publicId}/media

Purpose:
Upload customer issue media (photo or voice note).

Request (`multipart/form-data`)

| Field | Required | Notes |
|---|---|---|
| `file` | Yes | Single file per request |
| `media_kind` | Yes | `issue_photo` or `issue_voice_note` |
| `job_ref` | Yes | `KS-######` |
| `phone` | Yes | 10-digit mobile |
| `track_code` | Yes | 6 digits |

Response

```json
{
  "success": true,
  "media_id": "uuid",
  "media_kind": "issue_photo",
  "uploaded_count": 1
}
```

Rules:
- Max **5** `issue_photo` rows per job.
- Max **1** `issue_voice_note` row per job (client records max 60s).
- Photos should be client-compressed before upload where possible (1280px max width, ~0.7 quality, WebP/JPEG).
- Max 5 MB per file after compression.

Errors: `PHOTO_LIMIT`, `VOICE_LIMIT`, `VALIDATION_ERROR`, `FORBIDDEN`

---

## POST /api/public/jobs/lookup

Purpose:
Track job (manual lookup or via device-saved request). Client stores `job_ref`, `phone`, `track_code`, `category`, `locality`, `created_at` in `localStorage` after request create; My Requests UI calls this endpoint with stored credentials.

Request

```json
{
  "job_ref": "KS-000001",
  "phone": "9999999999",
  "track_code": "123456"
}
```

Response

```json
{
  "success": true,
  "job": {
    "public_id": "uuid",
    "job_ref": "KS-000001",
    "booking_status": "requested",
    "dispatch_status": "not_started",
    "payment_status": "not_due",
    "service_category": "Plumber",
    "locality": "Indira Nagar",
    "description": "...",
    "address_text": "...",
    "requested_at": "2026-06-17T00:00:00Z"
  }
}
```

Note: Legacy path `POST /api/public/track` is superseded by `/api/public/jobs/lookup`.

---

## POST /api/public/track (deprecated)

Superseded by `POST /api/public/jobs/lookup`. Kept for reference only.

Request

```json
{
  "job_ref": "KS-000001",
  "phone": "9999999999",
  "track_code": "123456"
}
```

Response

```json
{
  "success": true,
  "job": { "booking_status": "requested" }
}
```

---

## POST /api/public/payment-confirmation

Purpose:
Customer confirms payment.

---

## POST /api/public/rating

Purpose:
Submit rating.

---

## POST /api/public/complaints

Purpose:
Create complaint.

---

# 5. Worker APIs

## POST /api/worker/login

Purpose:
Worker authentication.

---

## GET /api/worker/profile

Returns worker profile.

---

## PUT /api/worker/profile

Updates allowed profile fields.

Allowed:

- whatsapp_number
- address_text
- is_available

---

## GET /api/worker/dashboard

Returns:

- active jobs
- pending offers
- earnings summary

---

## GET /api/worker/offers

Returns worker offers.

---

## POST /api/worker/offers/{id}/accept

Accept dispatch offer.

Valid State:

```text
sent → accepted
```

---

## POST /api/worker/offers/{id}/decline

Decline dispatch offer.

Valid State:

```text
sent → declined
```

---

## GET /api/worker/jobs

Assigned jobs only.

---

## GET /api/worker/jobs/{id}

Single job details.

---

## POST /api/worker/jobs/{id}/start

State:

```text
assigned → in_progress
```

---

## POST /api/worker/jobs/{id}/complete

State:

```text
in_progress → completed
```

Requires:

- completion note

Optional:

- completion photos

---

# 6. Admin APIs

## GET /api/admin/dashboard

Metrics:

- workers
- jobs
- complaints
- payments

---

## GET /api/admin/workers

Worker listing.

Filters:

- status
- locality
- category

---

## POST /api/admin/workers/{id}/approve

State:

```text
under_review → approved
```

---

## POST /api/admin/workers/{id}/reject

State:

```text
under_review → rejected
```

---

## GET /api/admin/jobs

Job queue.

Filters:

- status
- locality
- category

---

## GET /api/admin/jobs/{id}

Single job.

---

## POST /api/admin/jobs/{id}/validate

State:

```text
requested → validated
```

---

## POST /api/admin/jobs/{id}/dispatch

Creates dispatch attempt.

---

## POST /api/admin/jobs/{id}/assign

Assign worker.

State:

```text
dispatching → assigned
```

---

## POST /api/admin/jobs/{id}/cancel

State:

```text
requested → cancelled
validated → cancelled
dispatching → cancelled
```

---

## GET /api/admin/payments

Payment ledger.

---

## POST /api/admin/payments/{id}/confirm

State:

```text
customer_marked_paid
↓
admin_confirmed_paid
```

---

## GET /api/admin/complaints

Complaint queue.

---

## POST /api/admin/complaints/{id}/resolve

State:

```text
open → resolved
```

---

## POST /api/admin/complaints/{id}/dismiss

State:

```text
open → dismissed
```

---

## GET /api/admin/activity-logs

Audit records.

Read-only.

---

# 7. Response Standards

Every response must include:

```json
{
  "success": true
}
```

or

```json
{
  "success": false
}
```

Never mix formats.

---

# 8. Error Standards

Codes:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
RATE_LIMITED
INTERNAL_ERROR
```

---

# 9. Validation Rules

Phone:

```text
10 digits
```

Description:

```text
20-500 chars
```

Review:

```text
0-300 chars
```

Rating:

```text
1-5
```

Amount:

```text
>=0
```

---

# 10. State Transition Rules

Booking

```text
requested
↓
validated
↓
dispatching
↓
assigned
↓
in_progress
↓
completed
↓
closed
```

Cancellation

```text
requested
↓
cancelled
```

Dispute

```text
completed
↓
disputed
```

---

# 11. Rate Limiting

Public APIs:

- 10 req/min per IP

Tracking:

- 20 req/hour

Complaint:

- 5/day

Invite validation:

- 20/day

---

# 12. Activity Logging Requirements

Must log:

- request creation
- worker approval
- dispatch creation
- assignment
- job completion
- payment confirmation
- complaint resolution

---

# 13. API Freeze Checklist

Included:

- Public request flow
- Worker workflow
- Admin workflow
- Dispatch flow
- Payment flow
- Complaint flow

Excluded:

- Wallet
- Chat
- Maps
- Referrals
- Ads
- Notifications
- AI matching

---

# Final Verdict

KS-008 defines all MVP APIs required to build KaamSetu v1.0.

Next Document:

KS-009 Sprint Plan v1.0
