import type { Standing } from "@/lib/types";
import { isUs } from "@/lib/data";
import { t, teamName, type Lang } from "@/lib/i18n";

export default function LeagueTable({ rows, compact = false, lang = "ka" }: { rows: Standing[]; compact?: boolean; lang?: Lang }) {
  const h = t(lang).tableHead;
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
                <th className="num">{h.w}</th>
                <th className="num">{h.d}</th>
                <th className="num">{h.l}</th>
              </>
            )}
            <th className="num">{h.g}</th>
            <th className="num">{h.pts}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.pos} className={isUs(r.team) ? "us" : undefined}>
              <td>{r.pos}</td>
              <td className="team">
                {r.logo_url && <img src={r.logo_url} alt="" width={22} height={22} loading="lazy" />}
                {teamName(lang, r.team)}
              </td>
              <td className="num">{r.played}</td>
              {!compact && (
                <>
                  <td className="num">{r.won}</td>
                  <td className="num">{r.drawn}</td>
                  <td className="num">{r.lost}</td>
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
    </div>
  );
}
