-- სკ მერცხალი 1925 — FULL DATABASE SETUP (all steps in one).
-- Supabase → SQL Editor → New query → paste everything → Run.
-- Safe to run more than once. If Supabase warns about "destructive operations", confirm: it only replaces security rules.

-- ===== 1. tables, security, photo storage =====
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


-- ===== 2. starting data (squad, table, matches) =====
-- Initial data (31 Oct 2026). Run once after schema.sql. The GFF sync keeps standings & matches fresh.
insert into standings (pos,team,played,won,drawn,lost,goals_for,goals_against,points,logo_url) values
(1,'ვესტ ჯორჯია',26,16,7,3,68,30,55,null),
(2,'სამცხე',26,17,4,5,64,27,55,null),
(3,'არაგველები',26,15,7,4,53,19,52,null),
(4,'სამგურალი 2',26,15,2,9,44,30,47,null),
(5,'ბორჯომი',26,13,4,9,59,49,43,null),
(6,'ვიტ ჯორჯია 2',26,13,3,10,50,35,42,null),
(7,'სქური',25,11,7,7,44,34,40,null),
(8,'ტორპედო 2',26,10,8,8,46,40,38,null),
(9,'მერცხალი',26,10,5,11,46,53,35,null),
(10,'გაგრა 2',26,10,4,12,39,38,34,null),
(11,'არაგვი 2',26,9,6,11,47,43,33,null),
(12,'ალგეთი',25,7,6,12,37,45,27,null),
(13,'კოლხეთი 1913-2',26,7,6,13,33,51,27,null),
(14,'ლოკომოტივი 2',26,8,1,17,36,59,25,null),
(15,'მერანი 2',26,7,1,18,40,84,22,null),
(16,'ბახმარო',26,3,1,22,25,94,10,null)
on conflict (pos) do nothing;
insert into matches (id,round,date_label,home,away,home_score,away_score,kickoff,venue,played,sort) values
('r26','ტური 26','29 ოქტომბერი','ლოკომოტივი 2','მერცხალი',1,3,null,null,true,26),
('r25','ტური 25','22 ოქტომბერი','მერცხალი','არაგვი 2',1,2,null,null,true,25),
('r24','ტური 24','15 ოქტომბერი','ვესტ ჯორჯია','მერცხალი',6,0,null,null,true,24),
('r23','ტური 23','8 ოქტომბერი','მერცხალი','სამცხე',2,2,null,null,true,23),
('r22','ტური 22','1 ოქტომბერი','სამგურალი 2','მერცხალი',3,0,null,null,true,22),
('r21','ტური 21','24 სექტემბერი','მერცხალი','ტორპედო 2',1,1,null,null,true,21),
('r20','ტური 20','18 სექტემბერი','მერცხალი','გაგრა 2',1,2,null,null,true,20),
('r19','ტური 19','11 სექტემბერი','ვიტ ჯორჯია 2','მერცხალი',6,0,null,null,true,19),
('r18','ტური 18','4 სექტემბერი','მერცხალი','კოლხეთი 1913-2',4,1,null,null,true,18),
('r17','ტური 17','28 აგვისტო','მერანი 2','მერცხალი',3,6,null,null,true,17),
('r16','ტური 16','21 აგვისტო','მერცხალი','ალგეთი',4,1,null,null,true,16),
('r15','ტური 15','14 აგვისტო','მერცხალი','სქური',3,4,null,null,true,15),
('r14','ტური 14','7 აგვისტო','არაგველები','მერცხალი',0,0,null,null,true,14),
('r13','ტური 13','20 ივნისი','მერცხალი','ბახმარო',1,0,null,null,true,13),
('r12','ტური 12','14 ივნისი','ბორჯომი','მერცხალი',4,3,null,null,true,12),
('r11','ტური 11','9 ივნისი','მერცხალი','ლოკომოტივი 2',1,0,null,null,true,11),
('r10','ტური 10','4 ივნისი','არაგვი 2','მერცხალი',3,2,null,null,true,10),
('r9','ტური 9','29 მაისი','მერცხალი','ვესტ ჯორჯია',2,3,null,null,true,9),
('r8','ტური 8','20 მაისი','სამცხე','მერცხალი',4,0,null,null,true,8),
('r7','ტური 7','13 მაისი','მერცხალი','სამგურალი 2',0,0,null,null,true,7),
('r6','ტური 6','6 მაისი','ტორპედო 2','მერცხალი',2,2,null,null,true,6),
('r5','ტური 5','30 აპრილი','გაგრა 2','მერცხალი',1,2,null,null,true,5),
('r4','ტური 4','22 აპრილი','მერცხალი','ვიტ ჯორჯია 2',2,0,null,null,true,4),
('r3','ტური 3','17 აპრილი','კოლხეთი 1913-2','მერცხალი',1,2,null,null,true,3),
('r2','ტური 2','9 აპრილი','მერცხალი','მერანი 2',3,0,null,null,true,2),
('r1','ტური 1','1 აპრილი','ალგეთი','მერცხალი',3,1,null,null,true,1),
('r27','ტური 27','5 ნოემბერი','მერცხალი','ბორჯომი',null,null,'14:00','ოზურგეთი, კოტე გოგატაძე',false,27),
('r28','ტური 28','12 ნოემბერი','ბახმარო','მერცხალი',null,null,'14:00','ჩოხატაური, ბორის პაიჭაძე',false,28),
('r29','ტური 29','19 ნოემბერი','მერცხალი','არაგველები',null,null,'14:00','ოზურგეთი, კოტე გოგატაძე',false,29),
('r30','ტური 30','26 ნოემბერი','სქური','მერცხალი',null,null,'14:00','წალენჯიხა, საშა კვარაცხელია',false,30)
on conflict (id) do nothing;

insert into players (name,position,number,birth_year,sort)
select * from (values
('ბესიკ გოლიაძე','GK',null,1994,1),
('ლუკა ლომაძე','GK',null,null,2),
('ნიკოლოზ რამიშვილი','GK',null,2006,3),
('გოჩა პაიჭაძე','DF','3',2004,4),
('რომან მორჩილაძე','DF',null,2004,5),
('გიორგი კაჭეიშვილი','DF',null,1994,6),
('ნიკა აფხაზავა','DF',null,1995,7),
('დავით მამალაძე','DF',null,1998,8),
('ზაზა თუღუში','DF',null,1982,9),
('გოგიტა ხამაშურიძე','DF',null,1984,10),
('ვაჟა რამიშვილი','DF',null,1985,11),
('თემურ ჩხატარაშვილი','DF',null,1988,12),
('გიორგი გოგუა','MF','7',1994,13),
('გიორგი ქაშია','MF',null,1995,14),
('თენგიზ ალიევი','MF',null,1999,15),
('კოკა შენგელია','MF',null,2000,16),
('დავით ბოლქვაძე','MF',null,1980,17),
('გიორგი ჭანუყვაძე','MF',null,1995,18),
('გიორგი გოგელია','MF',null,2001,19),
('საბა ვაშალომიძე','MF',null,2005,20),
('ლაშა კოტრიკაძე','MF',null,1993,21),
('ნოდარ მაჭავარიანი','MF',null,1993,22),
('ელგუჯა ჩხაიძე','MF',null,1996,23),
('ლევან ათუაშვილი','MF',null,1990,24),
('სერგო ჩიგოგიძე','MF',null,1988,25),
('ილია ხეცურიანი','MF',null,1993,26),
('გრიგოლ ბერიშვილი','MF',null,1993,27),
('გიორგი გვაძგავა','MF',null,1995,28),
('ვახტანგ ჯაყელი','FW',null,1992,29),
('გიგა ამბროლაძე','FW',null,1990,30),
('დიმიტრი ჯაფარიძე','FW',null,1999,31),
('დავით ვაშაკიძე','FW',null,1991,32),
('ლუკა მჟავანაძე','FW',null,2004,33)
) as v(name,position,number,birth_year,sort)
where not exists (select 1 from players);

-- ===== 3. English version =====
-- English version: run once in Supabase → SQL Editor (safe to run again).
alter table news add column if not exists title_en text;
alter table news add column if not exists excerpt_en text;
alter table news add column if not exists body_en text;
alter table players add column if not exists name_en text;
update players set name_en = 'Besik Goliadze' where name = 'ბესიკ გოლიაძე' and name_en is null;
update players set name_en = 'Luka Lomadze' where name = 'ლუკა ლომაძე' and name_en is null;
update players set name_en = 'Nikoloz Ramishvili' where name = 'ნიკოლოზ რამიშვილი' and name_en is null;
update players set name_en = 'Gocha Paichadze' where name = 'გოჩა პაიჭაძე' and name_en is null;
update players set name_en = 'Roman Morchiladze' where name = 'რომან მორჩილაძე' and name_en is null;
update players set name_en = 'Giorgi Kacheishvili' where name = 'გიორგი კაჭეიშვილი' and name_en is null;
update players set name_en = 'Nika Apkhazava' where name = 'ნიკა აფხაზავა' and name_en is null;
update players set name_en = 'Davit Mamaladze' where name = 'დავით მამალაძე' and name_en is null;
update players set name_en = 'Zaza Tughushi' where name = 'ზაზა თუღუში' and name_en is null;
update players set name_en = 'Gogita Khamashuridze' where name = 'გოგიტა ხამაშურიძე' and name_en is null;
update players set name_en = 'Vazha Ramishvili' where name = 'ვაჟა რამიშვილი' and name_en is null;
update players set name_en = 'Temur Chkhatarashvili' where name = 'თემურ ჩხატარაშვილი' and name_en is null;
update players set name_en = 'Giorgi Gogua' where name = 'გიორგი გოგუა' and name_en is null;
update players set name_en = 'Giorgi Kashia' where name = 'გიორგი ქაშია' and name_en is null;
update players set name_en = 'Tengiz Alievi' where name = 'თენგიზ ალიევი' and name_en is null;
update players set name_en = 'Koka Shengelia' where name = 'კოკა შენგელია' and name_en is null;
update players set name_en = 'David Bolkvadze' where name = 'დავით ბოლქვაძე' and name_en is null;
update players set name_en = 'Giorgi Tchanukvadze' where name = 'გიორგი ჭანუყვაძე' and name_en is null;
update players set name_en = 'Giorgi Gogelia' where name = 'გიორგი გოგელია' and name_en is null;
update players set name_en = 'Saba Vashalomidze' where name = 'საბა ვაშალომიძე' and name_en is null;
update players set name_en = 'Lasha Kotrikadze' where name = 'ლაშა კოტრიკაძე' and name_en is null;
update players set name_en = 'Nodar Machavariani' where name = 'ნოდარ მაჭავარიანი' and name_en is null;
update players set name_en = 'Elguja Chkhaidze' where name = 'ელგუჯა ჩხაიძე' and name_en is null;
update players set name_en = 'Levan Atuashvili' where name = 'ლევან ათუაშვილი' and name_en is null;
update players set name_en = 'Sergo Chigogidze' where name = 'სერგო ჩიგოგიძე' and name_en is null;
update players set name_en = 'Ilia Khetsuriani' where name = 'ილია ხეცურიანი' and name_en is null;
update players set name_en = 'Grigol Berishvili' where name = 'გრიგოლ ბერიშვილი' and name_en is null;
update players set name_en = 'Giorgi Gvadsgava' where name = 'გიორგი გვაძგავა' and name_en is null;
update players set name_en = 'Vakhtang Jakeli' where name = 'ვახტანგ ჯაყელი' and name_en is null;
update players set name_en = 'Giga Ambroladze' where name = 'გიგა ამბროლაძე' and name_en is null;
update players set name_en = 'Dimitri Japaridze' where name = 'დიმიტრი ჯაფარიძე' and name_en is null;
update players set name_en = 'Davit Vashakidze' where name = 'დავით ვაშაკიძე' and name_en is null;
update players set name_en = 'Luka Mzhavanadze' where name = 'ლუკა მჟავანაძე' and name_en is null;


-- ===== 4. app notifications =====
-- Mobile app push notifications: run once in Supabase → SQL Editor (safe to run again).
create table if not exists push_tokens (
  token text primary key,
  lang text not null default 'ka',
  updated_at timestamptz not null default now()
);
-- Only the website server (service role) reads or writes this table; no public access.
alter table push_tokens enable row level security;


-- ===== 5. Facebook import columns =====
-- Facebook import: run once in Supabase → SQL Editor (safe to run again).
alter table news add column if not exists source text not null default 'admin';
alter table news add column if not exists fb_post_id text unique;
alter table news add column if not exists fb_url text;


-- ===== 6. match details =====
-- Match details (goals, substitutions, cards, lineups, referees) from GFF match pages.
-- Run once in Supabase → SQL Editor (safe to run again).
alter table matches add column if not exists gff_path text;
alter table matches add column if not exists details jsonb;
alter table matches add column if not exists details_at timestamptz;
