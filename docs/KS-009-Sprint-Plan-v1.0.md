# KS-009 Sprint Plan v1.0

**Project:** KaamSetu  
**Tagline:** Local Work. Trusted People.  
**Version:** 1.0  
**Document Type:** Engineering Delivery Plan  
**Status:** MVP Build Approved  
**Depends On:** KS-005 PRD, KS-006 Schema, KS-007 RLS, KS-008 API Contracts

---

# Objective

Convert all approved documents into a working Closed Beta MVP.

Rules:

- Solo Founder Mode
- AI Agents = Engineering Team
- Budget < ₹10,000
- PWA First
- No Feature Creep

---

# Build Sequence

```text
Sprint 0
↓
Sprint 1
↓
Sprint 2
↓
Sprint 3
↓
Sprint 4
↓
Sprint 5
↓
Closed Beta
```

---

# Sprint 0 — Foundation

Duration: 2-3 Days

## Deliverables

- Next.js project setup
- TypeScript setup
- Supabase project
- Vercel project
- Environment variables
- Folder structure
- ESLint + Prettier

## Done When

- App runs locally
- App deployed on Vercel
- Supabase connected

---

# Sprint 1 — Database & Security

Duration: 3-5 Days

## Deliverables

- KS-006 implementation
- Database migrations
- Enums
- Tables
- Indexes
- Storage buckets
- KS-007 RLS implementation

## Done When

- Schema deployed
- RLS tested
- Storage working

---

# Sprint 2 — Worker Module

Duration: 5-7 Days

## Screens

- Login
- Profile
- KYC
- Dashboard

## APIs

- Worker Profile
- Worker Dashboard
- Worker Documents

## Done When

- Worker can login
- Worker can complete profile
- Worker can upload documents

---

# Sprint 3 — Customer Request Flow

Duration: 5-7 Days

## Screens

- Invite Validation
- Request Form
- Success Screen
- Track Job

## APIs

- Invite Validation
- Create Request
- Track Request

## Done When

- Customer creates request
- Job appears in admin queue

---

# Sprint 4 — Admin Operations

Duration: 7-10 Days

## Screens

- Dashboard
- Worker Approval
- Job Queue
- Job Details

## APIs

- Approve Worker
- Reject Worker
- Validate Job

## Done When

- Founder can operate platform manually

---

# Sprint 5 — Dispatch System

Duration: 5-7 Days

## Features

- Create Dispatch Offer
- Accept Offer
- Decline Offer
- Assign Worker

## Done When

- One worker receives one offer
- Job becomes assigned

---

# Sprint 6 — Job Lifecycle

Duration: 5-7 Days

## Features

- Start Job
- Complete Job
- Payment Record
- Rating
- Complaint

## Done When

- Full job lifecycle works end-to-end

---

# Sprint 7 — Closed Beta Hardening

Duration: 3-5 Days

## Tasks

- Bug fixes
- Validation review
- Security review
- Activity log audit
- Mobile testing

## Done When

- 20 workers onboardable
- 20 jobs executable

---

# AI Agent Task Breakdown

## GPT / ChatGPT

- Architecture review
- API review
- Sprint review

## Copilot

- Implementation assistance

## Gemini

- Code audit
- Bug review

---

# Release Criteria

Before Beta:

- Worker onboarding works
- Job creation works
- Dispatch works
- Payments recorded
- Complaints recorded
- Ratings recorded

---

# Success Metrics

Closed Beta Targets:

- 20 Workers
- 20 Jobs
- 5 Repeat Customers
- 0 Critical Security Issues

---

# Not Allowed Before Beta

- Wallet
- Chat
- Maps
- Ads
- Referrals
- Native App
- AI Matching

---

# Final Verdict

After Sprint 7, KaamSetu enters Closed Beta.

Next Phase:

KS-010 Build Execution & Repository Structure
