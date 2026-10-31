import Link from "next/link";
import { CONTACT } from "@/lib/club";
import { L, t, type Lang } from "@/lib/i18n";

export default function SiteFooter({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <strong>{d.clubFull}</strong>
          <div>{d.address}</div>
          <div>
            {CONTACT.phone} · {CONTACT.email}
          </div>
        </div>
        <nav aria-label={d.footerMenu}>
          <Link href={L(lang, "/contact")}>{d.nav.contact}</Link>
          <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
          <a href="https://liga.gff.ge/?season=44&league=4" target="_blank" rel="noopener">{d.league} — GFF</a>
          <Link href="/admin">{d.admin}</Link>
        </nav>
      </div>
    </footer>
  );
}
