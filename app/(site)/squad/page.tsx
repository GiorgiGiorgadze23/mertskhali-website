import { getPlayers } from "@/lib/data";
import { HEAD_COACH, LEAGUE_LABEL, SEASON_LABEL } from "@/lib/club";
import type { Player } from "@/lib/types";

export const metadata = { title: "შემადგენლობა" };
export const revalidate = 600;

const GROUPS: { pos: Player["position"]; title: string; role: string }[] = [
  { pos: "GK", title: "მეკარეები", role: "მეკარე" },
  { pos: "DF", title: "მცველები", role: "მცველი" },
  { pos: "MF", title: "ნახევარმცველები", role: "ნახევარმცველი" },
  { pos: "FW", title: "თავდამსხმელები", role: "თავდამსხმელი" },
];

export default async function SquadPage() {
  const players = await getPlayers();
  return (
    <section className="container section" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div className="row-between">
        <h1 className="h1">შემადგენლობა</h1>
        <span className="muted">
          {SEASON_LABEL} · {LEAGUE_LABEL}
        </span>
      </div>
      <div className="coach">
        <div className="avatar" aria-hidden="true" />
        <div>
          <div className="eyebrow" style={{ fontSize: 13 }}>მთავარი მწვრთნელი</div>
          <div className="display" style={{ fontSize: 28 }}>{HEAD_COACH}</div>
        </div>
      </div>
      {GROUPS.map((g) => {
        const list = players.filter((p) => p.position === g.pos);
        if (!list.length) return null;
        return (
          <div key={g.pos} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 className="group-title">{g.title}</h2>
            <div className="players">
              {list.map((p) => (
                <div key={p.id} className="card player">
                  <div className="photo">
                    {p.photo_url && <img src={p.photo_url} alt={p.name} loading="lazy" />}
                    {p.number && <span className="num">{p.number}</span>}
                  </div>
                  <div className="info">
                    <b>{p.name}</b>
                    <span className="muted" style={{ fontSize: 13 }}>
                      {g.role}
                      {p.birth_year ? ` · ${p.birth_year}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
