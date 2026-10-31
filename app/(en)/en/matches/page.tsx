import { MatchesPage } from "@/components/pages/OtherPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.en.matchesTitle };
export const revalidate = 300;

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <MatchesPage lang="en" searchParams={searchParams} />;
}
