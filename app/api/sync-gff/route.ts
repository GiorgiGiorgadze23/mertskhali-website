import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publicClient, serviceClient } from "@/lib/supabase/clients";
import { syncGff } from "@/lib/gff";

export const dynamic = "force-dynamic";

const MIN_GAP_MS = 10 * 60 * 1000;

// Called by Vercel Cron once a day (see vercel.json). With "Authorization: Bearer <CRON_SECRET>" it always runs;
// without it (e.g. CRON_SECRET not configured) it runs only if the saved data is older than 10 minutes,
// so the endpoint can't be used to hammer GFF or the database.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authed = !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
  if (!authed) {
    const { data } = (await publicClient()?.from("standings").select("updated_at").order("updated_at", { ascending: false }).limit(1)) ?? { data: null };
    const last = data?.[0]?.updated_at ? Date.parse(data[0].updated_at) : 0;
    if (Date.now() - last < MIN_GAP_MS) return NextResponse.json({ ok: true, skipped: "fresh", last: data?.[0]?.updated_at });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  try {
    const result = await syncGff(db);
    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath("/en");
    revalidatePath("/en/matches");
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
