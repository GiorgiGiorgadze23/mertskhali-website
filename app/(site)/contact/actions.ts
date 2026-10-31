"use server";

import { publicClient } from "@/lib/supabase/clients";

export async function sendMessage(_: { ok: boolean; error: string }, form: FormData) {
  if (form.get("website")) return { ok: true, error: "" };
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  if (!name || !email.includes("@") || !body) return { ok: false, error: "შეავსეთ ყველა ველი." };
  const db = publicClient();
  if (!db) return { ok: false, error: "ფორმა ჯერ არ არის დაკავშირებული." };
  const { error } = await db.from("messages").insert({ name: name.slice(0, 120), email: email.slice(0, 200), body: body.slice(0, 5000) });
  return error ? { ok: false, error: "ვერ გაიგზავნა, სცადეთ მოგვიანებით." } : { ok: true, error: "" };
}
