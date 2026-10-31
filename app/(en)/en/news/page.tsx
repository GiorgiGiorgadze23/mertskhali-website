import { NewsListPage } from "@/components/pages/NewsPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.en.newsTitle };
export const revalidate = 120;

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <NewsListPage lang="en" searchParams={searchParams} />;
}
