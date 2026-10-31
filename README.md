# ს.კ მერცხალი 1925 — website

Next.js 16 site with an admin panel. Data lives in Supabase (free tier); the site runs on Vercel (free tier).
League table, fixtures and results sync from liga.gff.ge every morning automatically.

**What's included**
- Public pages: Home, News (+ article pages), Squad, Matches & table, History, Gallery, Contact
- `/admin`: sign-in; news (create / edit / delete, photo upload, draft or publish, “featured on home”); squad editor with photos; gallery uploads; contact-form inbox; “sync GFF now” button
- Daily GFF sync at 08:00 Tbilisi time (`vercel.json` → `/api/sync-gff`)
- Until the database is connected, pages show the 31 Oct 2026 snapshot bundled in `lib/seed.ts`

---

## Go live — about 15 minutes, no coding

### 1. Supabase (database, photos, admin logins)
1. Create a free account at **supabase.com** → **New project** (region: *Central EU (Frankfurt)*). Save the database password somewhere safe.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. New query again → paste `supabase/seed.sql` → **Run** (loads the squad, table and matches).
4. **Authentication → Sign In / Providers → Email**: turn **“Allow new users to sign up” OFF**. (Only people you add can log in.)
5. **Authentication → Users → Add user → Create new user**: your email + a strong password, tick “Auto confirm”. Repeat for anyone else who should post news.
6. **Project Settings → API**: keep this tab open — you need *Project URL*, *anon public* key and *service_role* key in step 3.

### 2. GitHub (holds the code)
1. Create a free account at **github.com** → **New repository** → name `mertskhali-website`, *Private* → Create.
2. On the empty repo page click **“uploading an existing file”**, drag in all files from this folder (not `node_modules` or `.next`), **Commit**.

### 3. Vercel (hosting)
1. Sign up at **vercel.com** with your GitHub account → **Add New → Project** → import `mertskhali-website`.
2. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret — never share) |
   | `CRON_SECRET` | any long random text, e.g. 40 random letters |
   | `NEXT_PUBLIC_SITE_URL` | `https://<your-project>.vercel.app` (later your domain) |

3. **Deploy**. In ~1 minute the site is live at `https://<your-project>.vercel.app`.
4. Open `/admin`, sign in, go to **მატჩები და ცხრილი → ახლავე განახლება** once to pull fresh GFF data.

### 4. Domain (when you buy one)
- Register a `.ge` domain (e.g. `mertskhali.ge`) through an accredited registrar listed on **nic.ge**.
- Vercel → Project → **Settings → Domains** → add it; Vercel shows two DNS records → enter them at your registrar. HTTPS is automatic.
- Update `NEXT_PUBLIC_SITE_URL` to the new address and redeploy.

---

## Everyday use
- **Post news:** `/admin` → **+ ახალი სიახლე** → title, category, photo, text → **გამოქვეყნება**. It appears on the site within seconds.
- **Squad:** `/admin/squad` — fix names/numbers, add photos, add or remove players.
- **Gallery:** `/admin/gallery` — upload several photos at once.
- **Messages:** contact-form messages arrive in `/admin/messages`.
- **Club details** (phone, email, coach, Facebook): edit `lib/club.ts` on GitHub → Vercel redeploys automatically.
- **Logo:** `public/logo.png` (header) and `app/icon.png` (browser tab) — replace the files to change the crest.
- **New season:** change `GFF_SEASON` / `GFF_LEAGUE` in Vercel env vars (numbers from the liga.gff.ge URL, e.g. `?season=44&league=4`).

## Notes
- Ask GFF for permission to reuse their table/fixtures; the sync makes one request per page per day and links back to liga.gff.ge.
- If GFF redesigns its site, the sync stops with an error and the last good data stays online — the parser in `lib/gff.ts` then needs a small update.
- Free tiers: Supabase pauses a project after a week with zero traffic; normal site visits keep it awake.

## Developers
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```
