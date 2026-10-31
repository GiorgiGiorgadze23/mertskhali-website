import { parse, type HTMLElement } from "node-html-parser";
import type { SupabaseClient } from "@supabase/supabase-js";

// Reads the public league pages on liga.gff.ge and stores the table and every match of the league.
// The markup (class names like c-pos, rb-item, cb-item) was checked on 31 Oct 2026; if GFF
// redesigns their site the parser throws and the old data simply stays on our site.

const BASE = "https://liga.gff.ge";

const txt = (el: HTMLElement | null | undefined) => (el?.text ?? "").replace(/\s+/g, " ").trim();
const num = (el: HTMLElement | null | undefined) => Number(txt(el).replace(/[^\d-]/g, "")) || 0;

async function get(path: string) {
  const res = await fetch(BASE + path, { headers: { "user-agent": "mertskhali-site/1.0 (+club website)" }, cache: "no-store" });
  if (!res.ok) throw new Error(`GFF ${path} → ${res.status}`);
  return parse(await res.text());
}

export function parseTable(doc: HTMLElement) {
  return doc
    .querySelectorAll("tr")
    .filter((tr) => tr.querySelector("td.c-clb"))
    .map((tr) => {
      const logo = tr.querySelector("td.c-clb img")?.getAttribute("src") ?? null;
      return {
        pos: num(tr.querySelector("td.c-pos")),
        team: txt(tr.querySelector("td.c-clb")),
        played: num(tr.querySelector("td.c-pls")),
        won: num(tr.querySelector("td.c-win")),
        drawn: num(tr.querySelector("td.c-dra")),
        lost: num(tr.querySelector("td.c-los")),
        goals_for: num(tr.querySelector("td.c-gfo")),
        goals_against: num(tr.querySelector("td.c-gag")),
        points: num(tr.querySelector("td.c-pts")),
        logo_url: logo,
        updated_at: new Date().toISOString(),
      };
    })
    .filter((r) => r.pos > 0 && r.team);
}

/** prefix "rb" = results page, "cb" = calendar page (same structure). */
export function parseMatches(doc: HTMLElement, prefix: "rb" | "cb") {
  const out: Record<string, unknown>[] = [];
  for (const tour of doc.querySelectorAll(`.${prefix}-tour-wrap`)) {
    const round = txt(tour.querySelector(`.${prefix}-tour-name`));
    const n = Number(round.replace(/\D/g, "")) || 0;
    let date = "";
    for (const el of tour.querySelectorAll(`.${prefix}-date, .${prefix}-item`)) {
      if (el.classList.contains(`${prefix}-date`)) {
        date = txt(el).split(",").pop()!.trim();
        continue;
      }
      const home = txt(el.querySelector(".name-1"));
      const away = txt(el.querySelector(".name-2"));
      if (!home || !away) continue;
      const href = el.getAttribute("href") ?? "";
      const id = "g" + (href.match(/\/game\/(\d+)/)?.[1] ?? `${n}-${home}-${away}`);
      const s1 = el.querySelector(".llgt-score-1");
      const s2 = el.querySelector(".llgt-score-2");
      const played = prefix === "rb" && !!s1 && !!s2 && txt(s1) !== "";
      out.push({
        id,
        round,
        date_label: date,
        home,
        away,
        home_score: played ? num(s1) : null,
        away_score: played ? num(s2) : null,
        kickoff: played ? null : txt(el.querySelector(`.${prefix}-time`)) || null,
        venue: el.querySelector(`.${prefix}-misc-item`)?.getAttribute("title")?.trim() || null,
        played,
        sort: n,
        updated_at: new Date().toISOString(),
      });
    }
  }
  return out;
}

export async function syncGff(db: SupabaseClient) {
  const season = process.env.GFF_SEASON || "44";
  const league = process.env.GFF_LEAGUE || "4";
  const q = `?season=${season}&league=${league}`;
  const [tableDoc, resDoc, calDoc] = await Promise.all([get(`/table${q}`), get(`/results${q}`), get(`/calendar${q}`)]);
  const standings = parseTable(tableDoc);
  // A game can appear on both pages (e.g. just played); the results page wins.
  const byId = new Map<string, Record<string, unknown>>();
  for (const m of [...parseMatches(calDoc, "cb"), ...parseMatches(resDoc, "rb")]) byId.set(String(m.id), m);
  const matches = [...byId.values()];
  if (standings.length < 4) throw new Error("ცხრილი ვერ წავიკითხე (GFF-ის საიტი შეიცვალა?)");

  // Replace the table in one go; keep matches by id so results overwrite fixtures.
  const del = await db.from("standings").delete().gte("pos", 0);
  if (del.error) throw new Error(del.error.message);
  const ins = await db.from("standings").insert(standings);
  if (ins.error) throw new Error(ins.error.message);
  if (matches.length) {
    // Remove the hand-entered seed rows (ids r1…r30) once real GFF ids arrive.
    await db.from("matches").delete().like("id", "r%");
    const up = await db.from("matches").upsert(matches, { onConflict: "id" });
    if (up.error) throw new Error(up.error.message);
  }
  return { standings: standings.length, matches: matches.length };
}
