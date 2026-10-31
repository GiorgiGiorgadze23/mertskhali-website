import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { serviceClient } from "@/lib/supabase/clients";
import { facebookConfigured, syncFacebook } from "@/lib/facebook";

export const dynamic = "force-dynamic";

// Called by Vercel Cron (daily) and by Supabase pg_cron (every 30 min, see supabase/005_facebook_schedule.sql),
// both with "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!facebookConfigured()) return NextResponse.json({ ok: false, error: "FB_PAGE_TOKEN / FB_PAGE_ID not set" }, { status: 200 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  try {
    const r = await syncFacebook(db);
    if (r.imported) {
      for (const p of ["/", "/news", "/en", "/en/news"]) revalidatePath(p);
    }
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
