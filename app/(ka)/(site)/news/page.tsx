import { NewsListPage } from "@/components/pages/NewsPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.ka.newsTitle };
export const revalidate = 120;

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <NewsListPage lang="ka" searchParams={searchParams} />;
}
