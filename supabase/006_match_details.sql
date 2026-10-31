-- Match details (goals, substitutions, cards, lineups, referees) from GFF match pages.
-- Run once in Supabase → SQL Editor (safe to run again).
alter table matches add column if not exists gff_path text;
alter table matches add column if not exists details jsonb;
alter table matches add column if not exists details_at timestamptz;
