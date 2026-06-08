# KaamSetu — Schema Context Pack

Core tables for MVP (KS-006 / KS-012):

## Reference

- `localities` — service areas
- `service_categories` — electrician, plumber, etc.
- `invite_codes` — customer invite gate

## Identity

- `customer_profiles` — anonymous/light customer records
- `worker_profiles` — worker onboarding and approval
- `worker_documents` — KYC file metadata (private storage)

## Operations

- `jobs` — booking lifecycle (booking_status, dispatch_status, payment_status)
- `job_media` — issue/completion photos
- `dispatch_attempts` — one active offer per job
- `payments` — payment ledger
- `ratings` — one per job
- `complaints` — one per job in MVP
- `activity_logs` — audit trail

## Security

- RLS enabled on all tables
- `tracking_code_hash` on jobs — never store raw tracking code
- Storage buckets: `worker-documents`, `job-media` (private)
