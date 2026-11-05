import { parse, type HTMLElement } from "node-html-parser";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lineup, MatchDetails, MatchEvent } from "./types";

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
        gff_path: href.startsWith("/game/") ? href : null,
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
  const stamp = new Date().toISOString();
  const ins = await db.from("standings").upsert(standings.map((r) => ({ ...r, updated_at: stamp })), { onConflict: "pos" });
  if (ins.error) throw new Error(ins.error.message);
  await db.from("standings").delete().gt("pos", standings.length);
  if (matches.length) {
    // Remove the hand-entered seed rows (ids r1…r30) once real GFF ids arrive.
    await db.from("matches").delete().like("id", "r%");
    let up = await db.from("matches").upsert(matches, { onConflict: "id" });
    if (up.error?.message.includes("gff_path")) {
      // 006_match_details.sql not run yet: save without the match-page link.
      up = await db.from("matches").upsert(matches.map(({ gff_path, ...m }) => m), { onConflict: "id" });
    }
    if (up.error) throw new Error(up.error.message);
  }
  const details = await syncDetails(db).catch(() => 0);
  return { standings: standings.length, matches: matches.length, details };
}

// ---------- single match page (/game/…) ----------
const isUs = (t: string) => t.startsWith("მერცხალი");
const titleCase = (s: string) => s.replace(/(^|[\s\-/])(\p{Ll})/gu, (_, a, b) => a + b.toUpperCase());

function parseLineup(el: HTMLElement | null): Lineup {
  const empty: Lineup = { starters: [], subs: [], coach: null };
  if (!el) return empty;
  const paras = el.querySelectorAll("p");
  let mode: "starters" | "subs" = "starters";
  for (const p of paras) {
    const head = txt(p.querySelector("strong"));
    if (/სათადარიგო/.test(head)) {
      mode = "subs";
      continue;
    }
    if (/მწვრთნელი/.test(head)) {
      empty.coach = p.text.replace(head, "").trim() || null;
      continue;
    }
    const lines = p.innerHTML.split(/<br\s*\/?>/i).map((h) => parse(h)).filter((n) => txt(n));
    for (const n of lines) {
      const line = txt(n);
      const m = line.match(/^(\d+)\.\s*(.+?)(\s+C)?$/);
      const captain = !!n.querySelector(".badge-c");
      const name = (m ? m[2] : line).replace(/\s+C$/, "").trim();
      empty[mode].push({ num: m ? m[1] : "", name, captain });
    }
  }
  return empty;
}

export function parseGame(doc: HTMLElement): MatchDetails {
  let events: MatchEvent[] = [];
  const raw = doc.querySelector("[data-events]")?.getAttribute("data-events");
  if (raw) {
    try {
      const list = JSON.parse(raw.replace(/&quot;/g, '"').replace(/&amp;/g, "&")) as { minute: number | string; minute_addit: number | string; side: string; type: string; text_en?: string; text_ka?: string }[];
      events = list.map((e) => ({
        minute: Number(e.minute) || 0,
        extra: Number(e.minute_addit) || null,
        side: e.side === "club_2" ? "away" : "home",
        type: String(e.type || ""),
        ka: String(e.text_ka || "").trim(),
        en: titleCase(String(e.text_en || "").trim()),
      }));
    } catch {}
  }
  const referees: { role: string; name: string }[] = [];
  for (const li of doc.querySelectorAll(".ar-body li")) {
    const role = txt(li.querySelector("strong"));
    if (!role) continue;
    const name = txt(li).replace(role, "").replace(/^[\s\u00a0-]+/, "").trim();
    if (name) referees.push({ role, name });
  }
  return {
    events,
    home: parseLineup(doc.querySelector(".gf-line-up-1 .gf-line-ups-text")),
    away: parseLineup(doc.querySelector(".gf-line-up-2 .gf-line-ups-text")),
    referees,
    kickoffAt: doc.querySelector("time.gf-game-date")?.getAttribute("datetime") ?? null,
  };
}

/** Fetches match pages for our club's games that have no details yet (and re-checks games of the last 3 days). */
export async function syncDetails(db: SupabaseClient) {
  const { data, error } = await db.from("matches").select("id, home, away, played, gff_path, details_at, updated_at").not("gff_path", "is", null);
  if (error || !data) return 0;
  const recent = Date.now() - 3 * 864e5;
  const todo = data
    .filter((m) => (isUs(m.home) || isUs(m.away)) && m.played && (!m.details_at || new Date(m.details_at).getTime() > recent))
    .slice(0, 40);
  let done = 0;
  for (let i = 0; i < todo.length; i += 5) {
    await Promise.all(
      todo.slice(i, i + 5).map(async (m) => {
        try {
          const details = parseGame(await get(m.gff_path!));
          if (!details.events.length && !details.home.starters.length) return;
          const r = await db.from("matches").update({ details, details_at: new Date().toISOString() }).eq("id", m.id);
          if (!r.error) done++;
        } catch {}
      }),
    );
  }
  return done;
}
