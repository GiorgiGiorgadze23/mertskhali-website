import { MatchDetailPage, matchMetadata } from "@/components/pages/MatchPage";

export const revalidate = 300;

type P = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: P) {
  return matchMetadata("en", (await params).id);
}

export default async function Page({ params }: P) {
  return <MatchDetailPage lang="en" id={(await params).id} />;
}
