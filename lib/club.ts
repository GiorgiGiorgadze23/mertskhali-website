import matchVideosFile from "@/content/match-videos.json";

// Club details shown across the site. Edit here and redeploy.
export const CONTACT = {
  address: "კოტე გოგატაძის სტადიონი, ოზურგეთი",
  email: "giorgadze@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61584229075980",
};

export const HEAD_COACH = "დავით სურგულაძე";
export const LEAGUE_LABEL = "ლიგა 4";
export const SEASON_LABEL = "სეზონი 2026";

// League zones as marked on liga.gff.ge (season 2026, Liga 4): top 3 promoted to Liga 3, bottom 4 relegated.
export const ZONES = { promoted: 3, relegated: 4 };
export function zoneOf(pos: number, total: number): "up" | "down" | null {
  if (pos <= ZONES.promoted) return "up";
  if (total && pos > total - ZONES.relegated) return "down";
  return null;
}

/** Video shown on the home page until an article with a video link is published (then the newest such article wins). */
/** Match videos, by GFF match id. Each one plays on that match's page; the newest is also the home-page lead. */
export const MATCH_VIDEOS: Record<string, string> = {
  g4950: "https://www.facebook.com/share/v/1F5yFAp5qh/", // მერცხალი 4:0 ბორჯომი, ტური 27
};

const ROUND_VIDEOS: Record<string, string[]> = matchVideosFile.rounds;

/** All videos for a match: the id-specific one first, then the club's YouTube full-match parts for that round. */
export function matchVideoUrls(m: { id: string; round: string }): string[] {
  const n = m.round.replace(/\D/g, "");
  return [...(MATCH_VIDEOS[m.id] ? [MATCH_VIDEOS[m.id]] : []), ...(ROUND_VIDEOS[n] ?? [])];
}

const [featuredMatch, featuredUrl] = Object.entries(MATCH_VIDEOS).at(-1) ?? [];
export const FEATURED_VIDEO: { url: string; matchId?: string } | null = featuredUrl ? { url: featuredUrl, matchId: featuredMatch } : null;
