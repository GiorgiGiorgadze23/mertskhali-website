import type { Standing } from "@/lib/types";
import { isUs } from "@/lib/data";
import { t, teamName, type Lang } from "@/lib/i18n";
import { zoneOf } from "@/lib/club";

export default function LeagueTable({ rows, compact = false, lang = "ka", total, legend = !compact }: { rows: Standing[]; compact?: boolean; lang?: Lang; total?: number; legend?: boolean }) {
  const d = t(lang);
  const h = d.tableHead;
  const n = total ?? rows.length;
  return (
    <div className="table-wrap">
      <table className="league">
        <thead>
          <tr>
            <th>{h.pos}</th>
            <th>{h.team}</th>
            <th className="num">{h.p}</th>
            {!compact && (
              <>
                <th className="num wdl">{h.w}</th>
                <th className="num wdl">{h.d}</th>
                <th className="num wdl">{h.l}</th>
              </>
            )}
            <th className="num">{h.g}</th>
            <th className="num">{h.pts}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.pos} className={[isUs(r.team) ? "us" : "", zoneOf(r.pos, n) ? `zone-${zoneOf(r.pos, n)}` : ""].join(" ").trim() || undefined}>
              <td className="pos">{r.pos}</td>
              <td className="team">
                {r.logo_url && <img src={r.logo_url} alt="" width={22} height={22} loading="lazy" />}
                {teamName(lang, r.team)}
              </td>
              <td className="num">{r.played}</td>
              {!compact && (
                <>
                  <td className="num wdl">{r.won}</td>
                  <td className="num wdl">{r.drawn}</td>
                  <td className="num wdl">{r.lost}</td>
                </>
              )}
              <td className="num">
                {r.goals_for}-{r.goals_against}
              </td>
              <td className="num">
                <b>{r.points}</b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {legend && (
        <div className="zone-legend">
          <span><i className="zl up" aria-hidden="true" />{d.zoneUp}</span>
          <span><i className="zl down" aria-hidden="true" />{d.zoneDown}</span>
        </div>
      )}
    </div>
  );
}
