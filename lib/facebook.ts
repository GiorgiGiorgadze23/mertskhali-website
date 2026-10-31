import type { SupabaseClient } from "@supabase/supabase-js";
import { makeSlug } from "./slug";
import { notifyNews } from "./push";

// Imports new posts from the club's Facebook Page (official Graph API) as published news.
// Only NEW posts are added: anything edited or hidden in /admin is never overwritten.
// Needs FB_PAGE_TOKEN (a Page access token) and FB_PAGE_ID in the Vercel settings.

const VERSION = process.env.FB_GRAPH_VERSION || "v26.0";

type FbPost = { id: string; message?: string; created_time: string; full_picture?: string; permalink_url?: string };

export const facebookConfigured = () => Boolean(process.env.FB_PAGE_TOKEN && process.env.FB_PAGE_ID);

/** "First sentence/line" → title (≤ 90 chars, cut at a word); the rest → excerpt. */
export function splitMessage(message: string) {
  const text = message.replace(/\r/g, "").trim();
  const firstLine = text.split("\n").find((l) => l.trim()) ?? "";
  let title = firstLine.trim();
  const sentence = title.match(/^(.{20,120}?[.!?])(\s|$)/);
  if (sentence) title = sentence[1];
  if (title.length > 90) title = title.slice(0, 90).replace(/\s+\S*$/, "") + "…";
  const rest = text.slice(text.indexOf(firstLine) + firstLine.length).trim() || (sentence ? firstLine.slice(sentence[1].length).trim() : "");
  const excerptSrc = (rest || text).replace(/\s+/g, " ").trim();
  const excerpt = excerptSrc.length > 200 ? excerptSrc.slice(0, 200).replace(/\s+\S*$/, "") + "…" : excerptSrc;
  return { title: title || "სიახლე", excerpt: excerpt === title ? null : excerpt, body: text };
}

const MATCH_WORDS = /(მატჩ|ანგარიშით|დავამარცხეთ|გავიმარჯვეთ|დავმარცხდით|ფრე|ტური|\d+\s*[-:]\s*\d+)/;
export const guessCategory = (text: string) => (MATCH_WORDS.test(text) ? "მატჩი" : "კლუბი");

/** Facebook image links expire, so we copy the picture into our own storage. */
async function copyImage(db: SupabaseClient, url: string, postId: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength > 8 * 1024 * 1024) return null;
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const path = `facebook/${postId.replace(/[^0-9_]/g, "")}.${ext}`;
    const up = await db.storage.from("media").upload(path, buf, { contentType: type, upsert: true });
    if (up.error) return null;
    return db.storage.from("media").getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}

export async function syncFacebook(db: SupabaseClient, opts: { notify?: boolean } = {}) {
  const token = process.env.FB_PAGE_TOKEN;
  const page = process.env.FB_PAGE_ID;
  if (!token || !page) throw new Error("Facebook ჯერ არ არის დაკავშირებული (FB_PAGE_TOKEN / FB_PAGE_ID).");

  const url = `https://graph.facebook.com/${VERSION}/${page}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=25&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url, { cache: "no-store" });
  const json = (await res.json()) as { data?: FbPost[]; error?: { message: string; code: number } };
  if (!res.ok || json.error) {
    const code = json.error?.code;
    throw new Error(code === 190 ? "Facebook-ის ტოკენი აღარ მოქმედებს — საჭიროა ახალი (იხ. README)." : `Facebook: ${json.error?.message ?? res.status}`);
  }
  const posts = (json.data ?? []).filter((p) => p.message?.trim());
  if (!posts.length) return { imported: 0 };

  const { data: existing, error } = await db.from("news").select("fb_post_id").in("fb_post_id", posts.map((p) => p.id));
  if (error) throw new Error(error.message.includes("fb_post_id") ? "გაუშვით supabase/004_facebook.sql" : error.message);
  const have = new Set((existing ?? []).map((r) => r.fb_post_id));
  // Is this the very first import? Then don't send 25 notifications at once.
  const { count } = await db.from("news").select("id", { count: "exact", head: true }).eq("source", "facebook");
  const firstRun = !count;

  const fresh = posts.filter((p) => !have.has(p.id)).reverse(); // oldest first
  let imported = 0;
  for (const p of fresh) {
    const { title, excerpt, body } = splitMessage(p.message!);
    const image_url = p.full_picture ? await copyImage(db, p.full_picture, p.id) : null;
    const slug = makeSlug(title);
    const row = {
      slug, title, excerpt, body, image_url,
      category: guessCategory(p.message!),
      published: true,
      published_at: p.created_time,
      featured: false,
      source: "facebook",
      fb_post_id: p.id,
      fb_url: p.permalink_url ?? null,
    };
    const ins = await db.from("news").insert(row);
    if (ins.error) {
      if (ins.error.code === "23505") continue; // imported by a parallel run
      throw new Error(ins.error.message);
    }
    imported++;
    if (opts.notify !== false && !firstRun) await notifyNews({ slug, title, title_en: null, excerpt, excerpt_en: null }).catch(() => null);
  }
  return { imported };
}
