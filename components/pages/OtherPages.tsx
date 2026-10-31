import Link from "next/link";
import LeagueTable from "@/components/LeagueTable";
import MatchRow from "@/components/MatchRow";
import ContactForm from "@/components/ContactForm";
import { getGallery, getMatches, getPlayers, getStandings, ourMatches } from "@/lib/data";
import { CONTACT } from "@/lib/club";
import { L, t, translit, type Lang } from "@/lib/i18n";
import type { Player } from "@/lib/types";

const POSITIONS: Player["position"][] = ["GK", "DF", "MF", "FW"];

export async function SquadPage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const players = await getPlayers();
  const name = (p: Player) => (lang === "en" ? p.name_en || translit(p.name) : p.name);
  return (
    <section className="container section" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div className="row-between">
        <h1 className="h1">{d.squadTitle}</h1>
        <span className="muted">
          {d.season} · {d.league}
        </span>
      </div>
      <div className="coach">
        <div className="avatar" aria-hidden="true" />
        <div>
          <div className="eyebrow" style={{ fontSize: 13 }}>{d.headCoach}</div>
          <div className="display" style={{ fontSize: 28 }}>{d.coachName}</div>
        </div>
      </div>
      {POSITIONS.map((pos) => {
        const list = players.filter((p) => p.position === pos);
        if (!list.length) return null;
        const [title, role] = d.groups[pos];
        return (
          <div key={pos} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 className="group-title">{title}</h2>
            <div className="players">
              {list.map((p) => (
                <div key={p.id} className="card player">
                  <div className="photo">
                    {p.photo_url && <img src={p.photo_url} alt={name(p)} loading="lazy" />}
                    {p.number && <span className="num">{p.number}</span>}
                  </div>
                  <div className="info">
                    <b>{name(p)}</b>
                    <span className="muted" style={{ fontSize: 13 }}>
                      {role}
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

export async function MatchesPage({ lang, searchParams }: { lang: Lang; searchParams: Promise<{ tab?: string }> }) {
  const d = t(lang);
  const tab = (await searchParams).tab === "results" ? "results" : "upcoming";
  const [standings, matches] = await Promise.all([getStandings(), getMatches()]);
  const { upcoming, results } = ourMatches(matches);
  const list = tab === "results" ? results : upcoming;
  return (
    <section className="container section">
      <div className="split">
        <div className="main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 className="h1">{d.matchesTitle}</h1>
          <nav className="tabs" aria-label={d.matchesFilter} style={{ alignSelf: "flex-start" }}>
            <Link href={L(lang, "/matches")} aria-current={tab === "upcoming" ? "page" : undefined}>{d.upcoming}</Link>
            <Link href={L(lang, "/matches?tab=results")} aria-current={tab === "results" ? "page" : undefined}>{d.results}</Link>
          </nav>
          <div className="match-list">
            {list.length ? list.map((m) => <MatchRow key={m.id} m={m} lang={lang} />) : <p className="muted">{d.noMatches}</p>}
          </div>
        </div>
        <aside className="card side" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ fontSize: 22 }}>
            {d.league} — {d.leagueTable}
          </h2>
          <LeagueTable rows={standings} lang={lang} />
          <span className="muted" style={{ fontSize: 12 }}>{d.tableLegend}</span>
          <span className="muted" style={{ fontSize: 12 }}>
            {d.source}: <a href="https://liga.gff.ge/?season=44&league=4" target="_blank" rel="noopener">liga.gff.ge</a> · {d.autoUpdated}
          </span>
        </aside>
      </div>
    </section>
  );
}

export function HistoryPage({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <>
      <section className="hero">
        <div className="inner" style={{ maxWidth: 900, padding: "64px 24px 72px" }}>
          <div className="hero-copy">
            <span className="eyebrow">{d.historyEyebrow}</span>
            <h1>{d.historyHeading}</h1>
            <p style={{ maxWidth: "none" }}>{d.historyIntro}</p>
          </div>
        </div>
      </section>
      <section className="container section" style={{ maxWidth: 900 }}>
        <ol className="timeline">
          {d.events.map(([y, title, text]) => (
            <li key={y}>
              <span className="year">{y}</span>
              <h2 style={{ fontSize: 21 }}>{title}</h2>
              <p style={{ color: "var(--text-2)" }}>{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="card" style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
          <div className="ph" style={{ flex: "1 1 420px", minHeight: 300, borderRadius: 0 }}>{d.stadiumName}</div>
          <div style={{ flex: "1 1 380px", padding: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="muted" style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".1em" }}>{d.stadiumEyebrow}</span>
            <h2 className="display" style={{ fontSize: 30 }}>{d.stadiumName}</h2>
            <p style={{ color: "var(--text-2)" }}>{d.stadiumText}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export async function GalleryPage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const items = await getGallery();
  return (
    <section className="container section">
      <h1 className="h1" style={{ marginBottom: 24 }}>{d.galleryTitle}</h1>
      {items.length ? (
        <div className="gallery">
          {items.map((g) => (
            <figure key={g.id}>
              <img src={g.image_url} alt={g.caption ?? ""} loading="lazy" />
              {g.caption && <figcaption>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <p className="muted">{d.photosSoon}</p>
      )}
    </section>
  );
}

export function ContactPage({ lang }: { lang: Lang }) {
  const d = t(lang);
  const label = { fontSize: 13, fontWeight: 700 } as const;
  return (
    <section className="container section">
      <div className="split">
        <div className="main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 className="h1">{d.contactTitle}</h1>
          <div><div className="muted" style={label}>{d.addressLabel}</div><div style={{ fontSize: 17 }}>{d.address}</div></div>
          <div><div className="muted" style={label}>{d.phoneLabel}</div><a href={`tel:+995${CONTACT.phone.replace(/\s/g, "")}`} style={{ fontSize: 17 }}>{CONTACT.phone}</a></div>
          <div><div className="muted" style={label}>{d.emailLabel}</div><a href={`mailto:${CONTACT.email}`} style={{ fontSize: 17 }}>{CONTACT.email}</a></div>
          <div><div className="muted" style={label}>{d.socialLabel}</div><a href={CONTACT.facebook} target="_blank" rel="noopener" style={{ fontSize: 17, fontWeight: 700 }}>Facebook — {d.clubFull}</a></div>
          <iframe
            title={d.mapTitle}
            src="https://www.openstreetmap.org/export/embed.html?bbox=41.98%2C41.91%2C42.02%2C41.93&layer=mapnik"
            style={{ width: "100%", height: 260, border: 0, borderRadius: 10 }}
            loading="lazy"
          />
        </div>
        <div className="side card" style={{ padding: 28, background: "var(--paper)" }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>{d.writeUs}</h2>
          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
