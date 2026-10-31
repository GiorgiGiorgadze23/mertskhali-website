import { serviceClient } from "./supabase/clients";
import type { News } from "./types";

type Msg = { to: string; title: string; body: string; data: Record<string, string>; sound: "default" };

/** Sends "new article" notifications to every phone with the app (Expo push service, free). */
export async function notifyNews(n: Pick<News, "slug" | "title" | "title_en" | "excerpt" | "excerpt_en">) {
  const db = serviceClient();
  if (!db) return { sent: 0 };
  const { data, error } = await db.from("push_tokens").select("token, lang").limit(20000);
  if (error || !data?.length) return { sent: 0 };

  const msgs: Msg[] = data.map((r) => {
    const en = r.lang === "en" && n.title_en;
    return {
      to: r.token,
      title: en ? n.title_en! : n.title,
      body: (en ? n.excerpt_en : n.excerpt) ?? (r.lang === "en" ? "New article from FC Mertskhali" : "ახალი სიახლე მერცხლისგან"),
      data: { slug: n.slug },
      sound: "default",
    };
  });

  const dead: string[] = [];
  for (let i = 0; i < msgs.length; i += 100) {
    const chunk = msgs.slice(i, i + 100);
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(chunk),
      });
      const out = (await res.json()) as { data?: { status: string; details?: { error?: string } }[] };
      out.data?.forEach((r, k) => {
        if (r.details?.error === "DeviceNotRegistered") dead.push(chunk[k].to);
      });
    } catch {
      // A failed notification must never block publishing.
    }
  }
  if (dead.length) await db.from("push_tokens").delete().in("token", dead);
  return { sent: msgs.length - dead.length };
}
