import { MatchDetailPage, matchMetadata } from "@/components/pages/MatchPage";

export const revalidate = 300;

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P) {
  return matchMetadata("ka", (await params).id);
}

export default async function Page({ params }: P) {
  return <MatchDetailPage lang="ka" id={(await params).id} />;
}
