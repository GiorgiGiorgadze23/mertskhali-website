import { publicClient } from "./supabase/clients";
import { seedMatches, seedPlayers, seedStandings } from "./seed";
import type { GalleryItem, Match, News, Player, Standing } from "./types";
import { CLUB } from "./types";

// Every reader falls back to the bundled snapshot so the site renders even before
// the database is set up, or if it is briefly unreachable.

export async function getStandings(): Promise<Standing[]> {
  const db = publicClient();
  if (!db) return seedStandings;
  const { data, error } = await db.from("standings").select("*").order("pos");
  return !error && data?.length ? (data as Standing[]) : seedStandings;
}

export async function getMatches(): Promise<Match[]> {
  const db = publicClient();
  if (!db) return seedMatches;
  const { data, error } = await db.from("matches").select("*").order("sort");
  return !error && data?.length ? (data as Match[]) : seedMatches;
}

export async function getMatch(id: string): Promise<Match | null> {
  const db = publicClient();
  if (db) {
    const { data } = await db.from("matches").select("*").eq("id", id).maybeSingle();
    if (data) return data as Match;
  }
  return seedMatches.find((m) => m.id === id) ?? null;
}

export async function getPlayers(): Promise<Player[]> {
  const db = publicClient();
  if (!db) return seedPlayers;
  const { data, error } = await db.from("players").select("*").order("sort");
  return !error && data?.length ? (data as Player[]) : seedPlayers;
}

export async function getNews(opts: { category?: string; limit?: number; page?: number; featuredFirst?: boolean } = {}): Promise<{ items: News[]; total: number }> {
  const db = publicClient();
  if (!db) return { items: [], total: 0 };
  const limit = opts.limit ?? 9;
  const from = ((opts.page ?? 1) - 1) * limit;
  let q = db.from("news").select("*", { count: "exact" }).eq("published", true);
  if (opts.featuredFirst) q = q.order("featured", { ascending: false });
  q = q.order("published_at", { ascending: false }).range(from, from + limit - 1);
  if (opts.category) q = q.eq("category", opts.category);
  const { data, count } = await q;
  return { items: (data as News[]) ?? [], total: count ?? 0 };
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const db = publicClient();
  if (!db) return null;
  const { data } = await db.from("news").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as News) ?? null;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const db = publicClient();
  if (!db) return [];
  const { data } = await db.from("gallery").select("*").order("created_at", { ascending: false }).limit(60);
  return (data as GalleryItem[]) ?? [];
}

// ---------- helpers ----------
export const isUs = (team: string) => team.startsWith(CLUB);

export function ourMatches(all: Match[]) {
  const mine = all.filter((m) => isUs(m.home) || isUs(m.away));
  const upcoming = mine.filter((m) => !m.played).sort((a, b) => a.sort - b.sort);
  const results = mine.filter((m) => m.played).sort((a, b) => b.sort - a.sort);
  return { upcoming, results };
}

export function outcome(m: Match): "win" | "loss" | "draw" | null {
  if (m.home_score == null || m.away_score == null) return null;
  const diff = isUs(m.home) ? m.home_score - m.away_score : m.away_score - m.home_score;
  return diff > 0 ? "win" : diff < 0 ? "loss" : "draw";
}

export const OUTCOME_LABEL = { win: "მოგება", loss: "წაგება", draw: "ფრე" } as const;

export function formatDate(iso: string | null) {
  if (!iso) return "";
  const months = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
  const d = new Date(iso);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}
