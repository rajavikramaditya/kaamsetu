-- KS-012: Enable required PostgreSQL extensions
create extension if not exists pgcrypto;
create extension if not exists citext;
