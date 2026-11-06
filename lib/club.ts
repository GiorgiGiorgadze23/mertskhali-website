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
export const FEATURED_VIDEO = "https://www.facebook.com/share/v/1F5yFAp5qh/";
