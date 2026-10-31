import { getNewsBySlug } from "@/lib/data";
import { json } from "../../_json";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const item = await getNewsBySlug((await params).slug);
  if (!item) return json({ error: "not_found" }, 30);
  return json({ item }, 120);
}
