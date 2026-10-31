import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NewsCard, { newsExcerpt, newsTitle } from "@/components/NewsCard";
import { getNews, getNewsBySlug } from "@/lib/data";
import { CATEGORIES } from "@/lib/types";
import { categoryName, formatDate, L, t, type Lang } from "@/lib/i18n";

const PER_PAGE = 9;

export async function NewsListPage({ lang, searchParams }: { lang: Lang; searchParams: Promise<{ cat?: string; page?: string }> }) {
  const d = t(lang);
  const sp = await searchParams;
  const cat = (CATEGORIES as readonly string[]).includes(sp.cat ?? "") ? sp.cat : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { items, total } = await getNews({ category: cat, page, limit: PER_PAGE });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const href = (c?: string, p?: number) => {
    const q = new URLSearchParams();
    if (c) q.set("cat", c);
    if (p && p > 1) q.set("page", String(p));
    const s = q.toString();
    return L(lang, "/news") + (s ? `?${s}` : "");
  };

  return (
    <section className="container section">
      <h1 className="h1" style={{ marginBottom: 24 }}>{d.newsTitle}</h1>
      <nav aria-label={d.categories} style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {[undefined, ...CATEGORIES].map((c) => (
          <Link key={c ?? "all"} href={href(c)} className={`btn btn-sm ${c === cat ? "btn-dark" : "btn-light"}`} style={{ borderRadius: 999 }} aria-current={c === cat ? "page" : undefined}>
            {c ? categoryName(lang, c) : d.all}
          </Link>
        ))}
      </nav>
      {items.length ? (
        <div className="grid-cards">
          {items.map((n) => (
            <NewsCard key={n.id} n={n} lang={lang} />
          ))}
        </div>
      ) : (
        <p className="muted">{d.noNewsInCat}</p>
      )}
      {pages > 1 && (
        <nav aria-label={d.pages} style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={href(cat, p)} className={`btn btn-sm ${p === page ? "btn-dark" : "btn-light"}`} aria-current={p === page ? "page" : undefined}>
              {p}
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}

export async function articleMetadata(lang: Lang, slug: string): Promise<Metadata> {
  const n = await getNewsBySlug(slug);
  if (!n) return { title: t(lang).newsFallback };
  const title = newsTitle(lang, n);
  const description = newsExcerpt(lang, n) ?? undefined;
  return { title, description, openGraph: { title, description, images: n.image_url ? [n.image_url] : undefined } };
}

export async function ArticlePage({ lang, slug }: { lang: Lang; slug: string }) {
  const d = t(lang);
  const n = await getNewsBySlug(slug);
  if (!n) notFound();
  const english = lang === "en" && !!n.title_en;
  const body = (english ? n.body_en : n.body) ?? "";
  const share = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL ?? "") + L(lang, "/news/" + n.slug))}`;
  return (
    <article className="article" lang={lang === "en" && !english ? "ka" : undefined}>
      <div className="meta-line" style={{ fontSize: 14 }}>
        <span className="cat">{categoryName(lang, n.category)}</span>
        <span>{formatDate(lang, n.published_at)}</span>
      </div>
      <h1 className="display" style={{ fontSize: "clamp(30px, 5vw, 40px)" }}>{newsTitle(lang, n)}</h1>
      {n.image_url && (
        <div className="cover">
          <img src={n.image_url} alt="" />
        </div>
      )}
      <div className="body">
        {body.split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, borderTop: "1px solid #ecebe5", paddingTop: 20 }}>
        <a href={share} target="_blank" rel="noopener" className="btn btn-light">{d.shareFb}</a>
        <Link href={L(lang, "/news")} className="btn" style={{ color: "var(--blue)" }}>{d.backToNews}</Link>
      </div>
    </article>
  );
}
