import Link from "next/link";
import type { News } from "@/lib/types";
import { categoryName, formatDate, L, t, type Lang } from "@/lib/i18n";

export const newsTitle = (lang: Lang, n: News) => (lang === "en" && n.title_en ? n.title_en : n.title);
export const newsExcerpt = (lang: Lang, n: News) => (lang === "en" && n.title_en ? n.excerpt_en : n.excerpt);

/** Shown when a post has no photo: dark-blue cover with the club logo. */
export function BrandCover({ label, className = "img" }: { label: string; className?: string }) {
  return (
    <div className={`${className} brand-cover`} aria-hidden="true">
      <span className="badge"><img src="/logo.png" alt="" /></span>
      <span className="name">{label}</span>
    </div>
  );
}

export default function NewsCard({ n, lang }: { n: News; lang: Lang }) {
  const excerpt = newsExcerpt(lang, n);
  return (
    <Link href={L(lang, `/news/${n.slug}`)} className="card news-card">
      {n.image_url ? (
        <div className="img"><img src={n.image_url} alt="" loading="lazy" /></div>
      ) : (
        <BrandCover label={t(lang).clubShort} />
      )}
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
