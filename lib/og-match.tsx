import { ImageResponse } from "next/og";
import { getMatch } from "@/lib/data";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dateLabel, roundName, t, teamName, type Lang } from "@/lib/i18n";
import { goalLines } from "@/lib/goals";
import { matchVideoUrls } from "@/lib/club";

export const OG_SIZE = { width: 1200, height: 630 };

// Fonts and crest ship with the code (lib/fonts) so the image never depends on another server.
const asset = (f: string) => readFile(join(process.cwd(), "lib/fonts", f));

/** Social-media preview card for a match: stadium photo, crest, teams, score, scorers, and a play badge when there is a video. */
export async function matchOgImage(lang: Lang, id: string) {
  const d = t(lang);
  const m = await getMatch(id);
  const home = m ? teamName(lang, m.home) : d.clubFull;
  const away = m ? teamName(lang, m.away) : "";
  const center = m ? (m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–") : "";
  const meta = m ? `${d.league} · ${roundName(lang, m.round)} · ${dateLabel(lang, m.date_label)}` : d.league;
  const goals = m ? goalLines(m, lang).map(([, g]) => g).join("  ·  ") : "";
  const hasVideo = !!(m && matchVideoUrls(m).length);
  const [geo, latin, logo, bg] = await Promise.all([
    asset("noto-sans-georgian-georgian-800-normal.woff"),
    asset("noto-sans-georgian-latin-800-normal.woff"),
    asset("logo.png"),
    asset("stadium-og.jpg"),
  ]);
  const fonts = [
    { name: "L", data: latin, weight: 800 as const },
    { name: "G", data: geo, weight: 800 as const },
  ];
  const img = (b: Buffer, type: string) => `data:${type};base64,${b.toString("base64")}`;
  const nameStyle = { flex: 1, display: "flex", fontSize: 46, color: "#fff", lineHeight: 1.1 };
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", fontFamily: "L, G", color: "#fff", background: "#0e1a3a" }}>
        <img src={img(bg, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(14,26,58,0.88) 0%, rgba(14,26,58,0.7) 45%, rgba(14,26,58,0.94) 100%)" }} />
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "44px 56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img src={img(logo, "image/png")} width={84} height={84} style={{ background: "#fff", borderRadius: 16, padding: 6 }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 36 }}>{d.clubFull}</div>
              <div style={{ fontSize: 24, color: "#8fd0f0" }}>{meta}</div>
            </div>
            {hasVideo && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, background: "#e0262b", borderRadius: 999, padding: "8px 20px 8px 14px", fontSize: 26 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                {lang === "ka" ? "ვიდეო" : "VIDEO"}
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 36 }}>
            <div style={{ ...nameStyle, justifyContent: "flex-end", textAlign: "right" }}>{home}</div>
            <div style={{ display: "flex", background: m?.played ? "#fff" : "#16244b", color: m?.played ? "#0e1a3a" : "#fff", fontSize: 92, padding: "6px 36px", borderRadius: 18 }}>{center}</div>
            <div style={{ ...nameStyle }}>{away}</div>
          </div>
          {goals && <div style={{ display: "flex", justifyContent: "center", fontSize: 26, color: "#e6ecf7", marginBottom: 22, textAlign: "center" }}>⚽ {goals}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#b9c2da" }}>
            <span>www.mertskhali1925.com</span>
            <span style={{ width: 120, height: 8, background: "#8fd0f0", borderRadius: 4 }} />
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
