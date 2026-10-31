import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import FacebookFeed from "@/components/FacebookFeed";
import { getMatches, getNews, getStandings, isUs, ourMatches, outcome } from "@/lib/data";
import { dateLabel, L, placeName, roundName, t, teamName, type Lang } from "@/lib/i18n";

export default async function HomePage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const [{ items: news }, standings, matches] = await Promise.all([getNews({ limit: 3, featuredFirst: true }), getStandings(), getMatches()]);
  const { upcoming, results } = ourMatches(matches);
  const next = upcoming[0];
  const last = results[0];
  const ourIdx = standings.findIndex((s) => isUs(s.team));
  const start = Math.max(0, Math.min(ourIdx - 2, standings.length - 5));
  const around = standings.slice(start, start + 5);
  const lastOutcome = last ? outcome(last) : null;

  return (
    <>
      <section className="hero">
        <div className="inner">
          <div className="hero-copy">
            <span className="eyebrow">
              {d.league} · {d.season}
            </span>
            <h1>{d.heroTitle}</h1>
            <p>{d.heroText}</p>
            <div className="hero-actions">
              <Link href={L(lang, "/matches")} className="btn btn-primary">{d.fixtures}</Link>
              <Link href={L(lang, "/news")} className="btn btn-outline">{d.allNews}</Link>
            </div>
          </div>
          {next && (
            <div className="next-match">
              <span className="label">{d.nextMatch}</span>
              <div className="versus">
                <div className="team">{teamName(lang, next.home)}</div>
                <span className="vs">VS</span>
                <div className="team">{teamName(lang, next.away)}</div>
              </div>
              <div className="meta">
                <span>
                  {dateLabel(lang, next.date_label)} · {next.kickoff} · {roundName(lang, next.round)}
                </span>
                {next.venue && <span>{placeName(lang, next.venue)}</span>}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container section" style={{ paddingBottom: 24 }}>
        <div className="row-between" style={{ marginBottom: 28 }}>
          <h2 className="h2">{d.latestNews}</h2>
          <Link href={L(lang, "/news")} className="link-strong">{d.allNews} →</Link>
        </div>
        <div className="news-with-fb">
          <div className="news-col">
            {news.length ? (
              <div className="grid-cards">
                {news.map((n) => (
                  <NewsCard key={n.id} n={n} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="muted">{d.newsSoon}</p>
            )}
          </div>
          <aside className="fb-col" aria-label="Facebook">
            <FacebookFeed lang={lang} />
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          {last && (
            <div className="card score-card side">
              <h2 style={{ fontSize: 22 }}>{d.lastResult}</h2>
              <div className="score-line">
                <span className="team-l">{teamName(lang, last.home)}</span>
                <span className="score">
                  {last.home_score} : {last.away_score}
                </span>
                <span className="team-r">{teamName(lang, last.away)}</span>
              </div>
              <span className="muted" style={{ fontSize: 14 }}>
                {d.league} · {roundName(lang, last.round)} · {dateLabel(lang, last.date_label)} · {isUs(last.home) ? d.home : d.away}
              </span>
              {lastOutcome && (
                <span className={`tag ${lastOutcome}`} style={{ alignSelf: "flex-start" }}>
                  {d.outcome[lastOutcome]}
                </span>
              )}
              <Link href={L(lang, "/matches?tab=results")} className="link-strong">{d.allResults}</Link>
            </div>
          )}
          <div className="card main" style={{ padding: 28 }}>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 22 }}>
                {d.league} — {d.table}
              </h2>
              <Link href={L(lang, "/matches")} className="link-strong">{d.fullTable}</Link>
            </div>
            <LeagueTable rows={around} compact lang={lang} />
          </div>
        </div>
      </section>

      <section className="facts">
        <div className="inner">
          {d.facts.map(([n, l]) => (
            <div key={l}>
              <b>{n}</b>
              <span className="muted">{l}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
