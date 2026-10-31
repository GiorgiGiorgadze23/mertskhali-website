"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { L, t, type Lang } from "@/lib/i18n";

const KEYS = ["home", "news", "squad", "matches", "history", "gallery", "contact"] as const;
const PATHS: Record<(typeof KEYS)[number], string> = { home: "/", news: "/news", squad: "/squad", matches: "/matches", history: "/history", gallery: "/gallery", contact: "/contact" };

export default function SiteHeader({ lang }: { lang: Lang }) {
  const d = t(lang);
  const full = usePathname() || "/";
  // Path without the /en prefix, used for "active" state and for the language switch.
  const path = lang === "en" ? full.replace(/^\/en(?=\/|$)/, "") || "/" : full;
  const active = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const other: Lang = lang === "ka" ? "en" : "ka";
  return (
    <header className="site-header">
      <div className="inner">
        <Link href={L(lang, "/")} className="brand">
          <img src="/logo.png" alt={d.clubFull} width={52} height={52} />
          <span>
            <span className="brand-name">{d.clubShort}</span>
            <span className="brand-sub">{d.clubSub}</span>
          </span>
        </Link>
        <nav className="nav" aria-label={d.mainMenu}>
          {KEYS.map((k) => (
            <Link key={k} href={L(lang, PATHS[k])} aria-current={active(PATHS[k]) ? "page" : undefined}>
              {d.nav[k]}
            </Link>
          ))}
          <a href={L(other, path)} className="lang-switch" hrefLang={other} aria-label={d.switchLabel}>
            {d.switchTo}
          </a>
        </nav>
      </div>
    </header>
  );
}
