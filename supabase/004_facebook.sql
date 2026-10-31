-- Facebook import: run once in Supabase → SQL Editor (safe to run again).
alter table news add column if not exists source text not null default 'admin';
alter table news add column if not exists fb_post_id text unique;
alter table news add column if not exists fb_url text;
