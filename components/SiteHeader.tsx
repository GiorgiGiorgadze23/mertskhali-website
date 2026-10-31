"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { L, t, type Lang } from "@/lib/i18n";

const KEYS = ["home", "news", "squad", "matches", "history", "gallery", "contact"] as const;
const PATHS: Record<(typeof KEYS)[number], string> = { home: "/", news: "/news", squad: "/squad", matches: "/matches", history: "/history", gallery: "/gallery", contact: "/contact" };

export default function SiteHeader({ lang }: { lang: Lang }) {
  const d = t(lang);
  const full = usePathname() || "/";
  const [open, setOpen] = useState(false);
  // Path without the /en prefix, used for "active" state and for the language switch.
  const path = lang === "en" ? full.replace(/^\/en(?=\/|$)/, "") || "/" : full;
  const active = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const other: Lang = lang === "ka" ? "en" : "ka";

  // Close the phone menu after navigating.
  useEffect(() => setOpen(false), [full]);

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
        <div className="header-tools">
          <a href={L(other, path)} className="lang-switch" hrefLang={other} aria-label={d.switchLabel}>
            {lang === "ka" ? "EN" : "ქარ"}
            <span className="lang-long">{lang === "ka" ? "glish" : "თული"}</span>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={lang === "ka" ? (open ? "მენიუს დახურვა" : "მენიუ") : open ? "Close menu" : "Menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <nav id="site-nav" className={`nav${open ? " open" : ""}`} aria-label={d.mainMenu}>
          {KEYS.map((k) => (
            <Link key={k} href={L(lang, PATHS[k])} aria-current={active(PATHS[k]) ? "page" : undefined}>
              {d.nav[k]}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
