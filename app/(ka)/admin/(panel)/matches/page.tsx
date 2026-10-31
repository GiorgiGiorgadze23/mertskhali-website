import { getMatches, getStandings, ourMatches } from "@/lib/data";
import LeagueTable from "@/components/LeagueTable";
import MatchRow from "@/components/MatchRow";
import SyncButton from "./SyncButton";

export default async function AdminMatches() {
  const [standings, matches] = await Promise.all([getStandings(), getMatches()]);
  const { upcoming, results } = ourMatches(matches);
  return (
    <>
      <div className="row-between" style={{ alignItems: "center" }}>
        <div>
          <div className="muted" style={{ fontSize: 13 }}>მატჩები და ცხრილი</div>
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>GFF-იდან ავტომატურად</h1>
        </div>
        <SyncButton />
      </div>
      <p className="muted">ცხრილი, კალენდარი და შედეგები liga.gff.ge-დან ყოველდღე, დილის 8 საათზე (თბილისის დროით) ახლდება. ღილაკით ახლავე განახლებაც შეიძლება.</p>
      <div className="split">
        <div className="main match-list">
          <h2 style={{ fontSize: 20 }}>მომავალი ({upcoming.length})</h2>
          {upcoming.map((m) => <MatchRow key={m.id} m={m} />)}
          <h2 style={{ fontSize: 20, marginTop: 12 }}>შედეგები ({results.length})</h2>
          {results.slice(0, 5).map((m) => <MatchRow key={m.id} m={m} />)}
        </div>
        <div className="side admin-card"><LeagueTable rows={standings} compact /></div>
      </div>
    </>
  );
}
