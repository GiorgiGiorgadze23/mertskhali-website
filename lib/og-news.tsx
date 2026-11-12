import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getNewsBySlug } from "@/lib/data";
import { matchOgImage, OG_SIZE } from "@/lib/og-match";
import { newsTitle } from "@/components/NewsCard";
import { t, type Lang } from "@/lib/i18n";

const asset = (f: string) => readFile(join(process.cwd(), "lib/fonts", f));

/** The match an article reports on, from its „მატჩის დეტალები: …/matches/<id>“ link. */
export const articleMatchId = (body: string | null | undefined) => body?.match(/\/matches\/([\w-]+)/)?.[1] ?? null;

/**
 * Social-media preview for an article without its own photo: a match report gets the match card
 * (stadium, crest, score, scorers); any other story gets the crest and its title over the stadium.
 */
export async function newsOgImage(lang: Lang, slug: string) {
  const d = t(lang);
  const n = await getNewsBySlug(slug);
  const matchId = articleMatchId(n?.body);
  if (matchId) return matchOgImage(lang, matchId);
  const title = n ? newsTitle(lang, n) : d.clubFull;
  const [geo, latin, logo, bg] = await Promise.all([
    asset("noto-sans-georgian-georgian-800-normal.woff"),
    asset("noto-sans-georgian-latin-800-normal.woff"),
    asset("logo.png"),
    asset("stadium-og.jpg"),
  ]);
  const img = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "L, G", color: "#fff", background: "#0e1a3a" }}>
        <img src={img(bg, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(14,26,58,0.88) 0%, rgba(14,26,58,0.75) 45%, rgba(14,26,58,0.94) 100%)" }} />
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "44px 56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img src={img(logo, "image/png")} width={84} height={84} style={{ background: "#fff", borderRadius: 16, padding: 6 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 36 }}>{d.clubFull}</div>
              <div style={{ fontSize: 24, color: "#8fd0f0" }}>{lang === "ka" ? "სიახლეები" : "News"}</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", fontSize: title.length > 60 ? 50 : 62, lineHeight: 1.2 }}>{title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#b9c2da" }}>
            <span>www.mertskhali1925.com</span>
            <span style={{ width: 120, height: 8, background: "#8fd0f0", borderRadius: 4 }} />
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "L", data: latin, weight: 800 as const },
        { name: "G", data: geo, weight: 800 as const },
      ],
    },
  );
}
