-- ს.კ მერცხალი 1925 — database schema
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Then run seed.sql the same way.

create extension if not exists "pgcrypto";

-- ---------- tables ----------
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'კლუბი',
  excerpt text,
  body text,
  image_url text,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists news_published_idx on news (published, published_at desc);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null check (position in ('GK','DF','MF','FW')),
  number text,
  birth_year int,
  photo_url text,
  sort int not null default 0
);

create table if not exists standings (
  pos int primary key,
  team text not null,
  played int not null default 0,
  won int not null default 0,
  drawn int not null default 0,
  lost int not null default 0,
  goals_for int not null default 0,
  goals_against int not null default 0,
  points int not null default 0,
  logo_url text,
  updated_at timestamptz not null default now()
);

create table if not exists matches (
  id text primary key,               -- e.g. r27 (round number)
  round text not null,
  date_label text not null,
  home text not null,
  away text not null,
  home_score int,
  away_score int,
  kickoff text,
  venue text,
  played boolean not null default false,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------- security (Row Level Security) ----------
-- Everyone can READ public content. Only signed-in admins can WRITE.
-- Admins are the users you add in Authentication → Users (turn public sign-ups OFF).
alter table news enable row level security;
alter table players enable row level security;
alter table standings enable row level security;
alter table matches enable row level security;
alter table gallery enable row level security;
alter table messages enable row level security;

drop policy if exists "public read published news" on news;
create policy "public read published news" on news for select using (published or auth.role() = 'authenticated');
drop policy if exists "admin write news" on news;
create policy "admin write news" on news for all to authenticated using (true) with check (true);

drop policy if exists "public read players" on players;
create policy "public read players" on players for select using (true);
drop policy if exists "admin write players" on players;
create policy "admin write players" on players for all to authenticated using (true) with check (true);

drop policy if exists "public read standings" on standings;
create policy "public read standings" on standings for select using (true);
drop policy if exists "admin write standings" on standings;
create policy "admin write standings" on standings for all to authenticated using (true) with check (true);

drop policy if exists "public read matches" on matches;
create policy "public read matches" on matches for select using (true);
drop policy if exists "admin write matches" on matches;
create policy "admin write matches" on matches for all to authenticated using (true) with check (true);

drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery for select using (true);
drop policy if exists "admin write gallery" on gallery;
create policy "admin write gallery" on gallery for all to authenticated using (true) with check (true);

-- Visitors may send a contact message, but only admins can read them.
drop policy if exists "anyone can send message" on messages;
create policy "anyone can send message" on messages for insert with check (
  char_length(name) between 1 and 120 and char_length(email) between 3 and 200 and char_length(body) between 1 and 5000
);
drop policy if exists "admin read messages" on messages;
create policy "admin read messages" on messages for select to authenticated using (true);
drop policy if exists "admin delete messages" on messages;
create policy "admin delete messages" on messages for delete to authenticated using (true);

-- ---------- photo storage ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id = 'media');
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
