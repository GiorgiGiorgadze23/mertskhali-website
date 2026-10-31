import { ArticlePage, articleMetadata } from "@/components/pages/NewsPages";

export const revalidate = 120;

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  return articleMetadata("ka", (await params).slug);
}

export default async function Page({ params }: P) {
  return <ArticlePage lang="ka" slug={(await params).slug} />;
}
