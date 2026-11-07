import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { makeSlug } from "@/lib/slug";
import { CATEGORIES } from "@/lib/types";
import type { sessionClient } from "@/lib/supabase/clients";

type Db = Pick<Awaited<ReturnType<typeof sessionClient>>, "from">;
export type InboxItem = {
  key: string;
  title: string;
  excerpt?: string;
  body?: string;
  category?: string;
  title_en?: string;
  excerpt_en?: string;
  body_en?: string;
  source_url?: string;
  image_url?: string;
  /** Only for stories the owner asked to post directly; the scheduled agent always leaves this out (draft). */
  published?: boolean;
};

const DIR = join(process.cwd(), "content", "agent-inbox");

async function readInbox(): Promise<InboxItem[]> {
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const out: InboxItem[] = [];
  for (const f of files) {
    try {
      const it = JSON.parse(await readFile(join(DIR, f), "utf8")) as InboxItem;
      if (it?.key && it?.title) out.push(it);
    } catch {}
  }
  return out;
}

/** Turns agent stories that aren't in the database yet into drafts. Returns how many were added. */
export async function importAgentInbox(db: Db): Promise<number> {
  const items = await readInbox();
  if (!items.length) return 0;
  const keys = items.map((i) => `agent:${i.key}`);
  const { data } = await db.from("news").select("fb_post_id").in("fb_post_id", keys);
  const have = new Set((data ?? []).map((r: { fb_post_id: string }) => r.fb_post_id));
  let added = 0;
  for (const it of items) {
    const key = `agent:${it.key}`;
    if (have.has(key)) continue;
    const row: Record<string, unknown> = {
      title: it.title.trim(),
      slug: makeSlug(it.title),
      excerpt: it.excerpt?.trim() || null,
      body: it.body?.trim() || null,
      category: (CATEGORIES as readonly string[]).includes(it.category ?? "") ? it.category : "კლუბი",
      image_url: it.image_url || null,
      published: it.published === true,
      published_at: it.published === true ? new Date().toISOString() : null,
      featured: false,
      source: "agent",
      fb_post_id: key,
      fb_url: it.source_url || null,
    };
    if (it.title_en || it.excerpt_en || it.body_en) Object.assign(row, { title_en: it.title_en ?? null, excerpt_en: it.excerpt_en ?? null, body_en: it.body_en ?? null });
    const { error } = await db.from("news").insert(row);
    if (!error) added++;
  }
  return added;
}
