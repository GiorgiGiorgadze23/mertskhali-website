import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getMatches, getNews, ourMatches } from "@/lib/data";

export const revalidate = 3600;

const PAGES: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
  ["", 1, "daily"],
  ["/news", 0.9, "daily"],
  ["/matches", 0.9, "daily"],
  ["/squad", 0.8, "weekly"],
  ["/history", 0.7, "monthly"],
  ["/gallery", 0.7, "monthly"],
  ["/contact", 0.5, "yearly"],
];

// Each page exists in Georgian (/) and English (/en); both are listed with hreflang links to each other.
function pair(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], lastModified?: string | Date): MetadataRoute.Sitemap {
  const ka = `${SITE}${path || "/"}`;
  const en = `${SITE}/en${path}`;
  const alternates = { languages: { ka, en, "x-default": ka } };
  return [
    { url: ka, lastModified, changeFrequency, priority, alternates },
    { url: en, lastModified, changeFrequency, priority: Math.max(0.1, priority - 0.2), alternates },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = PAGES.flatMap(([p, pr, cf]) => pair(p, pr, cf, now));
  try {
    const { items } = await getNews({ limit: 500 });
    for (const n of items) out.push(...pair(`/news/${n.slug}`, 0.7, "monthly", n.published_at ?? n.created_at));
  } catch {}
  try {
    const { results, upcoming } = ourMatches(await getMatches());
    for (const m of [...upcoming, ...results]) out.push(...pair(`/matches/${m.id}`, 0.5, m.played ? "yearly" : "daily"));
  } catch {}
  return out;
}
