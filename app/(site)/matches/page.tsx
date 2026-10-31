import Link from "next/link";
import LeagueTable from "@/components/LeagueTable";
import MatchRow from "@/components/MatchRow";
import { getMatches, getStandings, ourMatches } from "@/lib/data";
import { LEAGUE_LABEL } from "@/lib/club";

export const metadata = { title: "მატჩები და ცხრილი" };
export const revalidate = 300;

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const tab = (await searchParams).tab === "results" ? "results" : "upcoming";
  const [standings, matches] = await Promise.all([getStandings(), getMatches()]);
  const { upcoming, results } = ourMatches(matches);
  const list = tab === "results" ? results : upcoming;
  return (
    <section className="container section">
      <div className="split">
        <div className="main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 className="h1">მატჩები</h1>
          <nav className="tabs" aria-label="მატჩების ფილტრი" style={{ alignSelf: "flex-start" }}>
            <Link href="/matches" aria-current={tab === "upcoming" ? "page" : undefined}>მომავალი</Link>
            <Link href="/matches?tab=results" aria-current={tab === "results" ? "page" : undefined}>შედეგები</Link>
          </nav>
          <div className="match-list">
            {list.length ? list.map((m) => <MatchRow key={m.id} m={m} />) : <p className="muted">მატჩები არ არის.</p>}
          </div>
        </div>
        <aside className="card side" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 22 }}>{LEAGUE_LABEL} — ტურნირის ცხრილი</h2>
          <LeagueTable rows={standings} />
          <span className="muted" style={{ fontSize: 12 }}>თ — თამაში · მ — მოგება · ფ — ფრე · წ — წაგება · გ — გოლები · ქ — ქულა</span>
          <span className="muted" style={{ fontSize: 12 }}>
            წყარო: <a href="https://liga.gff.ge/?season=44&league=4" target="_blank" rel="noopener">liga.gff.ge</a> · ახლდება ავტომატურად
          </span>
        </aside>
      </div>
    </section>
  );
}
