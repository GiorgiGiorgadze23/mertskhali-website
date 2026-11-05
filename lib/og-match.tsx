import { ImageResponse } from "next/og";
import { getMatch } from "@/lib/data";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dateLabel, roundName, t, teamName, type Lang } from "@/lib/i18n";

export const OG_SIZE = { width: 1200, height: 630 };

// Fonts and crest ship with the code (lib/fonts) so the image never depends on another server.
const asset = (f: string) => readFile(join(process.cwd(), "lib/fonts", f));

/** Social-media preview card for a match: crest, teams and the score (or kick-off time). */
export async function matchOgImage(lang: Lang, id: string) {
  const d = t(lang);
  const m = await getMatch(id);
  const home = m ? teamName(lang, m.home) : d.clubFull;
  const away = m ? teamName(lang, m.away) : "";
  const center = m ? (m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–") : "";
  const meta = m ? `${d.league} · ${roundName(lang, m.round)} · ${dateLabel(lang, m.date_label)}` : d.league;
  const [geo, latin, logo] = await Promise.all([asset("noto-sans-georgian-georgian-800-normal.woff"), asset("noto-sans-georgian-latin-800-normal.woff"), asset("logo.png")]);
  const fonts = [
    { name: "G", data: geo, weight: 800 as const },
    { name: "L", data: latin, weight: 800 as const },
  ];
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const nameStyle = { flex: 1, display: "flex", fontSize: 46, color: "#fff", lineHeight: 1.15 };
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0e1a3a", padding: "56px 64px", fontFamily: "L, G", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img src={logoSrc} width={92} height={92} style={{ background: "#fff", borderRadius: 18, padding: 6 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40 }}>{d.clubFull}</div>
            <div style={{ fontSize: 26, color: "#8fd0f0" }}>{meta}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ ...nameStyle, justifyContent: "flex-end", textAlign: "right" }}>{home}</div>
          <div style={{ display: "flex", background: m?.played ? "#fff" : "#16244b", color: m?.played ? "#0e1a3a" : "#fff", fontSize: 96, padding: "10px 40px", borderRadius: 20 }}>{center}</div>
          <div style={{ ...nameStyle }}>{away}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#b9c2da" }}>
          <span>www.mertskhali1925.com</span>
          <span style={{ width: 120, height: 8, background: "#8fd0f0", borderRadius: 4, alignSelf: "center" }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
