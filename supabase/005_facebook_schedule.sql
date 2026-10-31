-- Optional: check Facebook every 30 minutes (Vercel's free plan only allows a daily job).
-- 1) Replace YOUR_CRON_SECRET below with the same CRON_SECRET you put in Vercel.
-- 2) Run in Supabase → SQL Editor.
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('mertskhali-facebook') where exists (select 1 from cron.job where jobname = 'mertskhali-facebook');

select cron.schedule(
  'mertskhali-facebook',
  '*/30 * * * *',
  $$
  select net.http_get(
    url := 'https://mertskhali-website.vercel.app/api/sync-facebook',
    headers := jsonb_build_object('Authorization', 'Bearer YOUR_CRON_SECRET')
  );
  $$
);
