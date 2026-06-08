# Schema Context (Sprint 0)

Relevant tables for foundation work:

## Reference

- `localities` — service areas in Orai
- `service_categories` — electrician, plumber, etc.
- `invite_codes` — customer invite gate

## Identity

- `customer_profiles` — anonymous/light customer records
- `worker_profiles` — worker onboarding and approval
- `worker_documents` — KYC metadata (private storage)

## Operations

- `jobs` — central job lifecycle
- `job_media` — issue/completion photos
- `dispatch_attempts` — serial dispatch offers
- `payments` — payment recording
- `ratings` — post-job ratings
- `complaints` — dispute handling
- `activity_logs` — audit trail

## Enums

`booking_status`, `dispatch_status`, `payment_status`, `complaint_status`, `approval_status`, `pricing_type`

Full spec: `docs/KS-006-Database-Schema-v1.0-professional.md`

Migrations: `supabase/migrations/`
