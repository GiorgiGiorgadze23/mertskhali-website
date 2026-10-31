import { CONTACT } from "@/lib/club";
import type { Lang } from "@/lib/i18n";

// Facebook's official Page plugin: shows the latest public posts of the club page.
// Needs no admin access or token. Width is capped by Facebook at 500px.
export default function FacebookFeed({ lang, height = 720 }: { lang: Lang; height?: number }) {
  const src =
    "https://www.facebook.com/plugins/page.php?" +
    new URLSearchParams({
      href: CONTACT.facebook,
      tabs: "timeline",
      width: "500",
      height: String(height),
      small_header: "true",
      adapt_container_width: "true",
      hide_cover: "false",
      show_facepile: "false",
      locale: lang === "ka" ? "ka_GE" : "en_US",
    }).toString();
  return (
    <div className="fb-feed">
      <iframe
        title={lang === "ka" ? "სკ მერცხალი 1925 — Facebook" : "FC Mertskhali 1925 — Facebook"}
        src={src}
        width="500"
        height={height}
        style={{ border: 0, overflow: "hidden", width: "100%", maxWidth: 500, height }}
        scrolling="no"
        allow="encrypted-media; clipboard-write; web-share"
        loading="lazy"
      />
      <a href={CONTACT.facebook} target="_blank" rel="noopener" className="link-strong" style={{ fontSize: 14 }}>
        {lang === "ka" ? "Facebook-ზე გადასვლა →" : "Open on Facebook →"}
      </a>
    </div>
  );
}
