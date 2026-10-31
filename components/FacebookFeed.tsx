import { CONTACT } from "@/lib/club";
import type { Lang } from "@/lib/i18n";

// Facebook's official Page plugin as a compact "follow" card (logo, name, follow button).
// The post timeline is left out: Facebook hides it from visitors who are not logged in,
// which leaves a large empty box. Posts reach the site through the automatic import instead.
export default function FacebookFeed({ lang, height = 130 }: { lang: Lang; height?: number }) {
  const src =
    "https://www.facebook.com/plugins/page.php?" +
    new URLSearchParams({
      href: CONTACT.facebook,
      tabs: "",
      width: "500",
      height: String(height),
      small_header: "false",
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
