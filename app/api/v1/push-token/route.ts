import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/clients";

export const dynamic = "force-dynamic";

// POST { token: "ExponentPushToken[...]", lang: "ka" | "en" } — the app registers for news notifications.
export async function POST(req: Request) {
  let body: { token?: string; lang?: string } = {};
  try {
    body = await req.json();
  } catch {}
  const token = String(body.token ?? "");
  if (!/^Expo(nent)?PushToken\[[^\]]{10,200}\]$/.test(token)) return NextResponse.json({ error: "bad_token" }, { status: 400 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const { error } = await db.from("push_tokens").upsert({ token, lang: body.lang === "en" ? "en" : "ka", updated_at: new Date().toISOString() }, { onConflict: "token" });
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
