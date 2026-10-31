import { getNews } from "@/lib/data";
import { CATEGORIES } from "@/lib/types";
import { json } from "../_json";

export const dynamic = "force-dynamic";

// GET /api/v1/news?page=1&cat=მატჩი&limit=10
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const cat = q.get("cat") ?? undefined;
  const { items, total } = await getNews({
    page: Math.max(1, Number(q.get("page")) || 1),
    limit: Math.min(30, Math.max(1, Number(q.get("limit")) || 10)),
    category: cat && (CATEGORIES as readonly string[]).includes(cat) ? cat : undefined,
    featuredFirst: q.get("featured") === "1",
  });
  return json({ items, total }, 60);
}
