import type { Match } from "@/lib/types";
import { isUs, outcome } from "@/lib/data";
import { dateLabel, roundName, t, teamName, type Lang } from "@/lib/i18n";

export default function MatchRow({ m, lang = "ka" }: { m: Match; lang?: Lang }) {
  const d = t(lang);
  const o = outcome(m);
  return (
    <div className="card match">
      <div className="when">
        <b>{dateLabel(lang, m.date_label)}</b>
        <span className="muted" style={{ fontSize: 13 }}>
          {d.league} · {roundName(lang, m.round)}
        </span>
      </div>
      <div className="teams">
        <span>{teamName(lang, m.home)}</span>
        <span className={m.played ? "box" : "box time"}>{m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–"}</span>
        <span>{teamName(lang, m.away)}</span>
      </div>
      {o ? <span className={`tag ${o}`}>{d.outcome[o]}</span> : <span className="tag">{isUs(m.home) ? d.home : d.away}</span>}
    </div>
  );
}
