import Link from "next/link";
import type { News } from "@/lib/types";
import { formatDate } from "@/lib/data";

export default function NewsCard({ n }: { n: News }) {
  return (
    <Link href={`/news/${n.slug}`} className="card news-card">
      <div className="img">{n.image_url ? <img src={n.image_url} alt="" loading="lazy" /> : "მერცხალი"}</div>
      <div className="body">
        <div className="meta-line">
          <span className="cat">{n.category}</span>
          <span>{formatDate(n.published_at)}</span>
        </div>
        <h3>{n.title}</h3>
        {n.excerpt && <p>{n.excerpt}</p>}
      </div>
    </Link>
  );
}
