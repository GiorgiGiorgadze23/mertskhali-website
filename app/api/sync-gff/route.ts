import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { serviceClient } from "@/lib/supabase/clients";
import { syncGff } from "@/lib/gff";

export const dynamic = "force-dynamic";

// Vercel Cron calls this daily (see vercel.json) with "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  try {
    const result = await syncGff(db);
    revalidatePath("/");
    revalidatePath("/matches");
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
