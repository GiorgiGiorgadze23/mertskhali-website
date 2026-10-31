import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate, getNewsBySlug } from "@/lib/data";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = await getNewsBySlug((await params).slug);
  if (!n) return { title: "სიახლე" };
  return { title: n.title, description: n.excerpt ?? undefined, openGraph: { title: n.title, description: n.excerpt ?? undefined, images: n.image_url ? [n.image_url] : undefined } };
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const n = await getNewsBySlug((await params).slug);
  if (!n) notFound();
  const share = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL ?? "") + "/news/" + n.slug)}`;
  return (
    <article className="article">
      <div className="meta-line" style={{ fontSize: 14 }}>
        <span className="cat">{n.category}</span>
        <span>{formatDate(n.published_at)}</span>
      </div>
      <h1 className="display" style={{ fontSize: "clamp(30px, 5vw, 40px)" }}>{n.title}</h1>
      {n.image_url && (
        <div className="cover">
          <img src={n.image_url} alt="" />
        </div>
      )}
      <div className="body">
        {(n.body ?? "").split(/\n{2,}/).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, borderTop: "1px solid #ecebe5", paddingTop: 20 }}>
        <a href={share} target="_blank" rel="noopener" className="btn btn-light">გაზიარება Facebook-ზე</a>
        <Link href="/news" className="btn" style={{ color: "var(--blue)" }}>← ყველა სიახლე</Link>
      </div>
    </article>
  );
}
