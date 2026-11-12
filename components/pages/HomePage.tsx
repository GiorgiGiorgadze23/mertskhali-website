import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import LeagueTable from "@/components/LeagueTable";
import FacebookFeed from "@/components/FacebookFeed";
import { getLatestVideo, getMatches, getNews, getStandings, isUs, ourMatches, outcome } from "@/lib/data";
import ShareFb from "@/components/ShareFb";
import { newsExcerpt, newsTitle } from "@/components/NewsCard";
import { SITE } from "@/lib/site";
import { importInboxInBackground, refreshIfStale } from "@/lib/autosync";
import { CONTACT, FEATURED_VIDEO } from "@/lib/club";
import { goalLines } from "@/lib/goals";
import { dateLabel, L, placeName, roundName, t, teamName, type Lang } from "@/lib/i18n";

export default async function HomePage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const [{ items: topNews }, standings, matches, video, { items: recent }] = await Promise.all([
    getNews({ limit: 4, featuredFirst: true }),
    getStandings(),
    getMatches(),
    getLatestVideo().catch(() => null),
    getNews({ limit: 15 }),
  ]);
  refreshIfStale(standings);
  importInboxInBackground();
  const { upcoming, results } = ourMatches(matches);
  const next = upcoming[0];
  const last = results[0];
  const ourIdx = standings.findIndex((s) => isUs(s.team));
  const start = Math.max(0, Math.min(ourIdx - 2, standings.length - 5));
  const around = standings.slice(start, start + 5);
  const lastOutcome = last ? outcome(last) : null;
  // A newer result than the lead video's match takes the lead spot (with its article, once published).
  const videoIsCurrent = !!video && !!last && (video.match?.id === last.id || !!video.news?.body?.includes(`/matches/${last.id}`));
  const leadMatch = last && !videoIsCurrent ? last : null;
  const leadNews = leadMatch ? recent.find((n) => n.body?.includes(`/matches/${leadMatch.id}`)) ?? null : null;
  const news = topNews.filter((n) => n.id !== leadNews?.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "სკ მერცხალი 1925",
    alternateName: ["ოზურგეთის მერცხალი", "მერცხალი ოზურგეთი", "FC Mertskhali 1925", "Mertskhali Ozurgeti", "FC Mertskhali"],
    sport: "Soccer",
    foundingDate: "1925",
    url: lang === "en" ? `${SITE}/en` : SITE,
    logo: `${SITE}/logo-512.png`,
    image: `${SITE}/stadium.jpg`,
    email: CONTACT.email,
    sameAs: [CONTACT.facebook],
    location: {
      "@type": "StadiumOrArena",
      name: "კოტე გოგატაძის სახელობის სტადიონი",
      address: { "@type": "PostalAddress", addressLocality: "ოზურგეთი", addressRegion: "გურია", addressCountry: "GE" },
    },
    memberOf: { "@type": "SportsOrganization", name: "ლიგა 4", url: "https://liga.gff.ge" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero">
        <div className="inner">
          <div className="hero-copy">
            <span className="eyebrow">
              {d.league} · {d.season}
            </span>
            <h1 className="hero-title">
              <span className="accent">{d.heroTitle.split(" ")[0]}</span> {d.heroTitle.split(" ").slice(1).join(" ")}
            </h1>
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
            {leadMatch ? (
              <article className="lead-video card">
                <div className="lead-video-body lv-top">
                  <div className="lv-head">
                    <span className="cat">{lang === "ka" ? "მთავარი" : "Top story"}</span>
                    <span className="muted">
                      {d.league} · {roundName(lang, leadMatch.round)} · {dateLabel(lang, leadMatch.date_label)}
                      {leadMatch.venue ? ` · ${placeName(lang, leadMatch.venue)}` : ""}
                    </span>
                  </div>
                  <Link href={L(lang, `/matches/${leadMatch.id}`)} className="lv-score">
                    <span className={isUs(leadMatch.home) ? "us" : ""}>{teamName(lang, leadMatch.home)}</span>
                    <b>
                      {leadMatch.home_score} : {leadMatch.away_score}
                    </b>
                    <span className={isUs(leadMatch.away) ? "us" : ""}>{teamName(lang, leadMatch.away)}</span>
                  </Link>
                  {goalLines(leadMatch, lang).map(([side, text]) => (
                    <p key={side} className="lv-goals">
                      <span aria-hidden="true">⚽</span> {text}
                    </p>
                  ))}
                  {leadNews && (
                    <>
                      <Link href={L(lang, `/news/${leadNews.slug}`)} className="lead-video-title">{newsTitle(lang, leadNews)}</Link>
                      {newsExcerpt(lang, leadNews) && <p className="lv-goals">{newsExcerpt(lang, leadNews)}</p>}
                    </>
                  )}
                  <div className="lv-actions">
                    <ShareFb path={L(lang, leadNews ? `/news/${leadNews.slug}` : `/matches/${leadMatch.id}`)} lang={lang} small />
                    {leadNews && (
                      <Link href={L(lang, `/news/${leadNews.slug}`)} className="link-strong">
                        {lang === "ka" ? "სრულად წაკითხვა →" : "Read more →"}
                      </Link>
                    )}
                    <Link href={L(lang, `/matches/${leadMatch.id}`)} className="link-strong">
                      {lang === "ka" ? "მატჩის დეტალები →" : "Match details →"}
                    </Link>
                  </div>
                </div>
              </article>
            ) : video && (
              <article className="lead-video card">
                {video.match?.played && (
                  <div className="lead-video-body lv-top">
                    <div className="lv-head">
                      <span className="cat">{lang === "ka" ? "ვიდეო" : "Video"}</span>
                      <span className="muted">
                        {d.league} · {roundName(lang, video.match.round)} · {dateLabel(lang, video.match.date_label)}
                        {video.match.venue ? ` · ${placeName(lang, video.match.venue)}` : ""}
                      </span>
                    </div>
                    <Link href={L(lang, `/matches/${video.match.id}`)} className="lv-score">
                      <span className={isUs(video.match.home) ? "us" : ""}>{teamName(lang, video.match.home)}</span>
                      <b>
                        {video.match.home_score} : {video.match.away_score}
                      </b>
                      <span className={isUs(video.match.away) ? "us" : ""}>{teamName(lang, video.match.away)}</span>
                    </Link>
                    {goalLines(video.match, lang).map(([side, text]) => (
                      <p key={side} className="lv-goals">
                        <span aria-hidden="true">⚽</span> {text}
                      </p>
                    ))}
                  </div>
                )}
                <div className="video-embed" style={{ margin: 0, borderRadius: 0 }}>
                  <iframe
                    src={video.embed.src}
                    title={video.news ? newsTitle(lang, video.news) : d.clubFull}
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="lead-video-body">
                  {video.match?.played ? (
                    <>
                      <ShareFb path={L(lang, `/matches/${video.match.id}`)} lang={lang} small />
                      <Link href={L(lang, `/matches/${video.match.id}`)} className="link-strong">
                        {lang === "ka" ? "მატჩის დეტალები →" : "Match details →"}
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="cat">{lang === "ka" ? "ვიდეო" : "Video"}</span>
                      {video.news && (
                        <Link href={L(lang, `/news/${video.news.slug}`)} className="lead-video-title">{newsTitle(lang, video.news)}</Link>
                      )}
                      {video.news ? (
                        <ShareFb path={L(lang, `/news/${video.news.slug}`)} lang={lang} small />
                      ) : (
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(FEATURED_VIDEO?.url ?? "")}`} target="_blank" rel="noopener" className="btn btn-fb btn-sm">
                          {d.shareFb}
                        </a>
                      )}
                    </>
                  )}
                </div>
              </article>
            )}
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
              <div className="scoreboard">
                {([
                  [last.home, last.home_score],
                  [last.away, last.away_score],
                ] as const).map(([team, goals]) => (
                  <div key={team} className={`sb-row${isUs(team) ? " us" : ""}`}>
                    <span className="sb-team">{teamName(lang, team)}</span>
                    <span className="sb-goals">{goals}</span>
                  </div>
                ))}
              </div>
              <span className="muted" style={{ fontSize: 14 }}>
                {d.league} · {roundName(lang, last.round)} · {dateLabel(lang, last.date_label)} · {isUs(last.home) ? d.home : d.away}
              </span>
              {lastOutcome && (
                <span className={`tag ${lastOutcome}`} style={{ alignSelf: "flex-start" }}>
                  {d.outcome[lastOutcome]}
                </span>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
                <ShareFb path={L(lang, `/matches/${last.id}`)} lang={lang} small />
                <Link href={L(lang, "/matches?tab=results")} className="link-strong">{d.allResults}</Link>
              </div>
            </div>
          )}
          <div className="card main" style={{ padding: 28 }}>
            <div className="row-between" style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 22 }}>
                {d.league} — {d.table}
              </h2>
              <Link href={L(lang, "/matches")} className="link-strong">{d.fullTable}</Link>
            </div>
            <LeagueTable rows={around} compact lang={lang} total={standings.length} />
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
