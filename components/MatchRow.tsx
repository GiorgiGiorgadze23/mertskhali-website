import type { Match } from "@/lib/types";
import { isUs, outcome, OUTCOME_LABEL } from "@/lib/data";
import { LEAGUE_LABEL } from "@/lib/club";

export default function MatchRow({ m }: { m: Match }) {
  const o = outcome(m);
  return (
    <div className="card match">
      <div className="when">
        <b>{m.date_label}</b>
        <span className="muted" style={{ fontSize: 13 }}>
          {LEAGUE_LABEL} · {m.round}
        </span>
      </div>
      <div className="teams">
        <span>{m.home}</span>
        <span className={m.played ? "box" : "box time"}>{m.played ? `${m.home_score} : ${m.away_score}` : m.kickoff ?? "–"}</span>
        <span>{m.away}</span>
      </div>
      {o ? <span className={`tag ${o}`}>{OUTCOME_LABEL[o]}</span> : <span className="tag">{isUs(m.home) ? "შინ" : "გასვლით"}</span>}
    </div>
  );
}
