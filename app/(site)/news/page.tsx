import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/data";
import { CATEGORIES } from "@/lib/types";

export const metadata = { title: "სიახლეები" };
export const revalidate = 120;

const PER_PAGE = 9;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ cat?: string; page?: string }> }) {
  const sp = await searchParams;
  const cat = CATEGORIES.includes(sp.cat as (typeof CATEGORIES)[number]) ? sp.cat : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { items, total } = await getNews({ category: cat, page, limit: PER_PAGE });
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const href = (c?: string, p?: number) => {
    const q = new URLSearchParams();
    if (c) q.set("cat", c);
    if (p && p > 1) q.set("page", String(p));
    const s = q.toString();
    return s ? `/news?${s}` : "/news";
  };

  return (
    <section className="container section">
      <h1 className="h1" style={{ marginBottom: 24 }}>სიახლეები</h1>
      <nav aria-label="კატეგორიები" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {[undefined, ...CATEGORIES].map((c) => (
          <Link key={c ?? "all"} href={href(c)} className={`btn btn-sm ${c === cat ? "btn-dark" : "btn-light"}`} style={{ borderRadius: 999 }} aria-current={c === cat ? "page" : undefined}>
            {c ?? "ყველა"}
          </Link>
        ))}
      </nav>
      {items.length ? (
        <div className="grid-cards">
          {items.map((n) => (
            <NewsCard key={n.id} n={n} />
          ))}
        </div>
      ) : (
        <p className="muted">ამ კატეგორიაში სიახლე ჯერ არ არის.</p>
      )}
      {pages > 1 && (
        <nav aria-label="გვერდები" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
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
