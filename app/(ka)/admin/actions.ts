"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/clients";
import { makeSlug } from "@/lib/slug";
import { CATEGORIES, type Player } from "@/lib/types";
import { syncGff } from "@/lib/gff";
import { notifyNews } from "@/lib/push";
import { syncFacebook } from "@/lib/facebook";

type State = { ok: boolean; error: string };

async function requireAdmin() {
  const db = await sessionClient();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");
  return db;
}

async function uploadImage(db: Awaited<ReturnType<typeof sessionClient>>, file: File, folder: string) {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error("მხოლოდ ფოტო (JPG, PNG, WEBP).");
  if (file.size > 5 * 1024 * 1024) throw new Error("ფოტო 5 MB-ზე დიდია.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("ფოტო ვერ აიტვირთა: " + error.message);
  return db.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function refreshPublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

// ---------- auth ----------
export async function signIn(_: State, form: FormData): Promise<State> {
  const db = await sessionClient();
  const { error } = await db.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
  if (error) return { ok: false, error: "ელფოსტა ან პაროლი არასწორია." };
  redirect("/admin");
}

export async function signOut() {
  const db = await sessionClient();
  await db.auth.signOut();
  redirect("/admin/login");
}

// ---------- news ----------
export async function saveNews(_: State, form: FormData): Promise<State> {
  const db = await requireAdmin();
  const id = String(form.get("id") || "");
  const title = String(form.get("title") || "").trim();
  if (!title) return { ok: false, error: "სათაური სავალდებულოა." };
  const category = String(form.get("category"));
  const publish = form.get("intent") === "publish";
  const row: Record<string, unknown> = {
    title,
    category: (CATEGORIES as readonly string[]).includes(category) ? category : "კლუბი",
    excerpt: String(form.get("excerpt") || "").trim() || null,
    body: String(form.get("body") || "").trim() || null,
    featured: form.get("featured") === "on",
    published: publish,
  };
  // English version (optional). Only sent when filled in, so the site still works before 002_english.sql is run.
  const en = { title_en: String(form.get("title_en") || "").trim() || null, excerpt_en: String(form.get("excerpt_en") || "").trim() || null, body_en: String(form.get("body_en") || "").trim() || null };
  if (en.title_en || en.excerpt_en || en.body_en || form.get("had_en")) Object.assign(row, en);
  const date = String(form.get("published_at") || "");
  if (publish) row.published_at = date ? new Date(date).toISOString() : new Date().toISOString();
  try {
    const img = await uploadImage(db, form.get("image") as File, "news");
    if (img) row.image_url = img;
    if (form.get("remove_image") === "on") row.image_url = null;
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  let slug: string;
  let wasPublished = false;
  if (id) {
    const prev = await db.from("news").select("published").eq("id", id).maybeSingle();
    wasPublished = !!prev.data?.published;
    const { data, error } = await db.from("news").update(row).eq("id", id).select("slug").single();
    if (error) return { ok: false, error: error.message };
    slug = data.slug;
  } else {
    slug = makeSlug(title);
    const { error } = await db.from("news").insert({ ...row, slug });
    if (error) return { ok: false, error: error.message };
  }
  refreshPublic(slug);
  revalidatePath("/admin");
  // First time an article goes public → notify app users (never blocks saving).
  if (publish && !wasPublished && form.get("notify") !== "off") {
    await notifyNews({ slug, title, title_en: en.title_en, excerpt: row.excerpt as string | null, excerpt_en: en.excerpt_en }).catch(() => null);
  }
  redirect("/admin?saved=1");
}

export async function deleteNews(form: FormData) {
  const db = await requireAdmin();
  await db.from("news").delete().eq("id", String(form.get("id")));
  refreshPublic();
  revalidatePath("/admin");
}

// ---------- gallery ----------
export async function addGallery(_: State, form: FormData): Promise<State> {
  const db = await requireAdmin();
  const files = form.getAll("images") as File[];
  const caption = String(form.get("caption") || "").trim() || null;
  try {
    for (const f of files) {
      const url = await uploadImage(db, f, "gallery");
      if (url) await db.from("gallery").insert({ image_url: url, caption });
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { ok: true, error: "" };
}

export async function deleteGallery(form: FormData) {
  const db = await requireAdmin();
  await db.from("gallery").delete().eq("id", String(form.get("id")));
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

// ---------- squad ----------
export async function savePlayer(form: FormData) {
  const db = await requireAdmin();
  const id = String(form.get("id") || "");
  const pos = String(form.get("position")) as Player["position"];
  const row: Record<string, unknown> = {
    name: String(form.get("name") || "").trim(),
    position: ["GK", "DF", "MF", "FW"].includes(pos) ? pos : "MF",
    number: String(form.get("number") || "").trim() || null,
    birth_year: Number(form.get("birth_year")) || null,
  };
  const nameEn = String(form.get("name_en") || "").trim();
  if (nameEn || form.get("had_en")) row.name_en = nameEn || null;
  if (!row.name) return;
  const photo = form.get("photo") as File | null;
  if (photo && photo.size) row.photo_url = await uploadImage(db, photo, "players");
  if (id) await db.from("players").update(row).eq("id", id);
  else await db.from("players").insert({ ...row, sort: 999 });
  revalidatePath("/squad");
  revalidatePath("/admin/squad");
}

export async function deletePlayer(form: FormData) {
  const db = await requireAdmin();
  await db.from("players").delete().eq("id", String(form.get("id")));
  revalidatePath("/squad");
  revalidatePath("/admin/squad");
}

// ---------- messages ----------
export async function deleteMessage(form: FormData) {
  const db = await requireAdmin();
  await db.from("messages").delete().eq("id", String(form.get("id")));
  revalidatePath("/admin/messages");
}

// ---------- GFF ----------
export async function syncNow(_: State): Promise<State> {
  const db = await requireAdmin();
  try {
    const r = await syncGff(db);
    revalidatePath("/");
    revalidatePath("/matches");
    return { ok: true, error: `განახლდა: ${r.standings} გუნდი, ${r.matches} მატჩი.` };
  } catch (e) {
    return { ok: false, error: "ვერ განახლდა: " + (e as Error).message };
  }
}

// ---------- Facebook ----------
export async function facebookNow(_: State): Promise<State> {
  const db = await requireAdmin();
  try {
    const r = await syncFacebook(db);
    for (const p of ["/", "/news", "/en", "/en/news", "/admin"]) revalidatePath(p);
    return { ok: true, error: r.imported ? `დაემატა ${r.imported} სიახლე Facebook-დან.` : "ახალი პოსტი არ არის." };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
