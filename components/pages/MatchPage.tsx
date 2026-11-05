import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareFb from "@/components/ShareFb";
import { getMatch, isUs, outcome } from "@/lib/data";
import { dateLabel, L, placeName, roundName, t, teamName, translit, type Lang } from "@/lib/i18n";
import type { Lineup, MatchEvent } from "@/lib/types";

const SOFASCORE = "https://www.sofascore.com/football/team/mertskhali-ozurgeti/37304";

export async function matchMetadata(lang: Lang, id: string): Promise<Metadata> {
  const m = await getMatch(id);
  if (!m) return { title: t(lang).matchesTitle };
  const score = m.played ? ` ${m.home_score}:${m.away_score}` : "";
  const title = `${teamName(lang, m.home)} – ${teamName(lang, m.away)}${score}`;
  const description = `${t(lang).league} · ${roundName(lang, m.round)} · ${dateLabel(lang, m.date_label)}`;
  return { title, description, openGraph: { title, description, type: "article" } };
}

function EventIcon({ type }: { type: string }) {
  if (type === "goal" || type === "penalty" || type === "own_goal")
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7l3.5 2.5-1.3 4h-4.4l-1.3-4z" fill="currentColor" />
      </svg>
    );
  if (type.includes("yellow")) return <span className="card-ico yellow" aria-hidden="true" />;
  if (type.includes("red")) return <span className="card-ico red" aria-hidden="true" />;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 4v14M7 18l-3-3M7 18l3-3M17 20V6M17 6l-3 3M17 6l3 3" />
    </svg>
  );
}

function eventLabel(lang: Lang, type: string) {
  const md = t(lang).md;
  if (type === "goal") return md.goal;
  if (type === "own_goal") return md.ownGoal;
  if (type === "penalty") return md.penalty;
  if (type.includes("yellow")) return md.yellow;
  if (type.includes("red")) return md.red;
  if (type.startsWith("substitution")) return md.sub;
  return type;
}

function EventText({ e, lang }: { e: MatchEvent; lang: Lang }) {
  const text = lang === "en" ? e.en || translit(e.ka) : e.ka || e.en;
  if (e.type.startsWith("substitution") && text.includes("/")) {
    const [off, on] = text.split("/");
    return (
      <span>
        <span className="sub-on">↑ {on.trim()}</span> <span className="sub-off">↓ {off.trim()}</span>
      </span>
    );
  }
  return <span>{text}</span>;
}

function LineupBlock({ team, lu, lang }: { team: string; lu: Lineup; lang: Lang }) {
  const md = t(lang).md;
  const name = (n: string) => (lang === "en" ? translit(n) : n);
  return (
    <div className="card lineup">
      <h3>{teamName(lang, team)}</h3>
      {lu.starters.length > 0 && (
        <>
          <div className="lu-head">{md.starters}</div>
          <ol>
            {lu.starters.map((p, i) => (
              <li key={i}>
                <span className="lu-num">{p.num}</span>
                {name(p.name)}
                {p.captain && <abbr className="lu-c" title={md.captain}>C</abbr>}
              </li>
            ))}
          </ol>
        </>
      )}
      {lu.subs.length > 0 && (
        <>
          <div className="lu-head">{md.subs}</div>
          <ol>
            {lu.subs.map((p, i) => (
              <li key={i}>
                <span className="lu-num">{p.num}</span>
                {name(p.name)}
              </li>
            ))}
          </ol>
        </>
      )}
      {lu.coach && (
        <p className="muted" style={{ fontSize: 14, marginTop: 10 }}>
          {md.coach}: <b style={{ color: "var(--ink)" }}>{name(lu.coach)}</b>
        </p>
      )}
    </div>
  );
}

export async function MatchDetailPage({ lang, id }: { lang: Lang; id: string }) {
  const d = t(lang);
  const md = d.md;
  const m = await getMatch(id);
  if (!m) notFound();
  const o = outcome(m);
  const det = m.details;
  const events = [...(det?.events ?? [])].sort((a, b) => a.minute - b.minute || (a.extra ?? 0) - (b.extra ?? 0));
  const hasLineups = !!det && (det.home.starters.length > 0 || det.away.starters.length > 0);

  return (
    <section className="container section" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Link href={L(lang, m.played ? "/matches?tab=results" : "/matches")} className="link-strong" style={{ alignSelf: "flex-start" }}>
        {md.back}
      </Link>

      <div className="match-hero">
        <div className="mh-meta">
          {d.league} · {roundName(lang, m.round)} · {dateLabel(lang, m.date_label)}
          {!m.played && m.kickoff ? ` · ${m.kickoff}` : ""}
        </div>
        <div className="mh-score">
          <span className={`mh-team left${isUs(m.home) ? " us" : ""}`}>{teamName(lang, m.home)}</span>
          <span className="mh-box">{m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–"}</span>
          <span className={`mh-team right${isUs(m.away) ? " us" : ""}`}>{teamName(lang, m.away)}</span>
        </div>
        <div className="mh-foot">
          {o && <span className={`tag ${o}`}>{d.outcome[o]}</span>}
          {m.venue && <span>{placeName(lang, m.venue)}</span>}
        </div>
      </div>

      {!m.played && <p className="muted">{md.upcoming}</p>}
      {m.played && !det && <p className="muted">{md.noDetails}</p>}

      {events.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>{md.events}</h2>
          <ol className="events">
            {events.map((e, i) => (
              <li key={i} className={`ev ${e.side}`}>
                <span className="ev-min">
                  {e.minute}
                  {e.extra ? `+${e.extra}` : ""}′
                </span>
                <span className={`ev-ico ${e.type}`} title={eventLabel(lang, e.type)}>
                  <EventIcon type={e.type} />
                  <span className="sr-only">{eventLabel(lang, e.type)}</span>
                </span>
                <span className="ev-text">
                  <EventText e={e} lang={lang} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {hasLineups && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 12 }}>{md.lineups}</h2>
          <div className="lineups">
            <LineupBlock team={m.home} lu={det!.home} lang={lang} />
            <LineupBlock team={m.away} lu={det!.away} lang={lang} />
          </div>
        </div>
      )}

      {det && det.referees.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 20, marginBottom: 10 }}>{md.referees}</h2>
          <ul className="refs">
            {det.referees.map((r, i) => (
              <li key={i}>
                <span className="muted">{lang === "en" ? translit(r.role) : r.role}</span> — {lang === "en" ? translit(r.name) : r.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <ShareFb path={L(lang, `/matches/${m.id}`)} lang={lang} />
        {m.gff_path && (
          <a href={`https://liga.gff.ge${m.gff_path}`} target="_blank" rel="noopener" className="btn btn-light">
            {md.source}: liga.gff.ge
          </a>
        )}
        <a href={SOFASCORE} target="_blank" rel="noopener" className="btn btn-light">
          {md.sofascore}
        </a>
      </div>
    </section>
  );
}
