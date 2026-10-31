"use server";

import { publicClient } from "@/lib/supabase/clients";
import { t, type Lang } from "@/lib/i18n";

export async function sendMessage(_: { ok: boolean; error: string }, form: FormData) {
  const f = t((form.get("lang") === "en" ? "en" : "ka") as Lang).form;
  if (form.get("website")) return { ok: true, error: "" };
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!name || !email.includes("@") || !body) return { ok: false, error: f.fill };
  const db = publicClient();
  if (!db) return { ok: false, error: f.notReady };
  const { error } = await db.from("messages").insert({ name: name.slice(0, 120), email: email.slice(0, 200), body: body.slice(0, 5000) });
  return error ? { ok: false, error: f.failed } : { ok: true, error: "" };
}
