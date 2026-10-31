import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import { getMatches, getNews, getStandings, isUs, ourMatches, outcome, OUTCOME_LABEL } from "@/lib/data";
import { LEAGUE_LABEL, SEASON_LABEL } from "@/lib/club";

export const revalidate = 300;

export default async function Home() {
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
              {LEAGUE_LABEL} · {SEASON_LABEL}
            </span>
            <h1>ოზურგეთის მერცხალი</h1>
            <p>გურიის საფეხბურთო კლუბი 1925 წლიდან. სახლი — კოტე გოგატაძის სახელობის სტადიონი, ოზურგეთი.</p>
            <div className="hero-actions">
              <Link href="/matches" className="btn btn-primary">მატჩების კალენდარი</Link>
              <Link href="/news" className="btn btn-outline">ყველა სიახლე</Link>
            </div>
          </div>
          {next && (
            <div className="next-match">
              <span className="label">შემდეგი მატჩი</span>
              <div className="versus">
                <div className="team">{next.home}</div>
                <span className="vs">VS</span>
                <div className="team">{next.away}</div>
              </div>
              <div className="meta">
                <span>
                  {next.date_label} · {next.kickoff} · {next.round}
                </span>
                {next.venue && <span>{next.venue}</span>}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container section" style={{ paddingBottom: 24 }}>
        <div className="row-between" style={{ marginBottom: 28 }}>
          <h2 className="h2">ბოლო სიახლეები</h2>
          <Link href="/news" className="link-strong">ყველა სიახლე →</Link>
        </div>
        {news.length ? (
          <div className="grid-cards">
            {news.map((n) => (
              <NewsCard key={n.id} n={n} />
            ))}
          </div>
        ) : (
          <p className="muted">სიახლეები მალე დაემატება.</p>
        )}
      </section>

      <section className="container section">
        <div className="split">
          {last && (
            <div className="card score-card side">
              <h2 style={{ fontSize: 22 }}>ბოლო შედეგი</h2>
              <div className="score-line">
                <span>{last.home}</span>
                <span className="score">
                  {last.home_score} : {last.away_score}
                </span>
                <span>{last.away}</span>
              </div>
              <span className="muted" style={{ fontSize: 14 }}>
                {LEAGUE_LABEL} · {last.round} · {last.date_label} · {isUs(last.home) ? "შინ" : "გასვლით"}
              </span>
              {lastOutcome && <span className={`tag ${lastOutcome}`} style={{ alignSelf: "flex-start" }}>{OUTCOME_LABEL[lastOutcome]}</span>}
              <Link href="/matches?tab=results" className="link-strong">ყველა შედეგი →</Link>
            </div>
          )}
          <div className="card main" style={{ padding: 28 }}>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 22 }}>{LEAGUE_LABEL} — ცხრილი</h2>
              <Link href="/matches" className="link-strong">სრული ცხრილი →</Link>
            </div>
            <LeagueTable rows={around} compact />
          </div>
        </div>
      </section>

      <section className="facts">
        <div className="inner">
          <div><b>1925</b><span className="muted">დაარსების წელი</span></div>
          <div><b>3 500</b><span className="muted">ადგილი სტადიონზე</span></div>
          <div><b>4</b><span className="muted">სეზონი უმაღლეს ლიგაში</span></div>
          <div><b>1982–87</b><span className="muted">ხუთი მედალი ბახვა გიორგაძესთან</span></div>
        </div>
      </section>
    </>
  );
}
