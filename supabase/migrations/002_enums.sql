-- KS-012: Controlled lifecycle enums
create type booking_status as enum (
  'requested',
  'validated',
  'dispatching',
  'assigned',
  'in_progress',
  'completed',
  'disputed',
  'closed',
  'cancelled'
);

create type dispatch_status as enum (
  'not_started',
  'offer_pending',
  'assigned',
  'failed',
  'stopped'
);

create type payment_status as enum (
  'not_due',
  'due',
  'payment_link_sent',
  'customer_marked_paid',
  'admin_confirmed_paid',
  'failed',
  'waived'
);

create type complaint_status as enum (
  'open',
  'under_review',
  'resolved',
  'dismissed',
  'closed'
);

create type approval_status as enum (
  'invited',
  'draft',
  'under_review',
  'approved',
  'rejected',
  'suspended'
);

create type pricing_type as enum (
  'fixed_price',
  'quote_required',
  'daily_wage'
);

create type request_source as enum (
  'pwa',
  'whatsapp_assisted',
  'call_assisted',
  'admin_manual'
);

create type payment_method as enum (
  'cash',
  'upi',
  'razorpay_link',
  'bank_transfer',
  'waived'
);
