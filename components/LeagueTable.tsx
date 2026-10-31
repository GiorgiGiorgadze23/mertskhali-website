import type { Standing } from "@/lib/types";
import { isUs } from "@/lib/data";

export default function LeagueTable({ rows, compact = false }: { rows: Standing[]; compact?: boolean }) {
  return (
    <div className="table-wrap">
      <table className="league">
        <thead>
          <tr>
            <th>#</th>
            <th>გუნდი</th>
            <th className="num">თ</th>
            {!compact && (
              <>
                <th className="num">მ</th>
                <th className="num">ფ</th>
                <th className="num">წ</th>
              </>
            )}
            <th className="num">გ</th>
            <th className="num">ქ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.pos} className={isUs(r.team) ? "us" : undefined}>
              <td>{r.pos}</td>
              <td className="team">
                {r.logo_url && <img src={r.logo_url} alt="" width={22} height={22} loading="lazy" />}
                {r.team}
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
