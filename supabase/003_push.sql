-- Mobile app push notifications: run once in Supabase → SQL Editor (safe to run again).
create table if not exists push_tokens (
  token text primary key,
  lang text not null default 'ka',
  updated_at timestamptz not null default now()
);
-- Only the website server (service role) reads or writes this table; no public access.
alter table push_tokens enable row level security;
