import { newsOgImage } from "@/lib/og-news";

export const revalidate = 300;

/** Preview image for an article: /api/og/news/<slug>?lang=en */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "ka";
  return newsOgImage(lang, decodeURIComponent((await params).slug));
}
