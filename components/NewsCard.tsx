import Link from "next/link";
import type { News } from "@/lib/types";
import { categoryName, formatDate, L, t, type Lang } from "@/lib/i18n";

export const newsTitle = (lang: Lang, n: News) => (lang === "en" && n.title_en ? n.title_en : n.title);
export const newsExcerpt = (lang: Lang, n: News) => (lang === "en" && n.title_en ? n.excerpt_en : n.excerpt);

export default function NewsCard({ n, lang }: { n: News; lang: Lang }) {
  const excerpt = newsExcerpt(lang, n);
  return (
    <Link href={L(lang, `/news/${n.slug}`)} className="card news-card">
      <div className="img">{n.image_url ? <img src={n.image_url} alt="" loading="lazy" /> : t(lang).clubShort}</div>
      <div className="body">
        <div className="meta-line">
          <span className="cat">{categoryName(lang, n.category)}</span>
          <span>{formatDate(lang, n.published_at)}</span>
        </div>
        <h3>{newsTitle(lang, n)}</h3>
        {excerpt && <p>{excerpt}</p>}
      </div>
    </Link>
  );
}
