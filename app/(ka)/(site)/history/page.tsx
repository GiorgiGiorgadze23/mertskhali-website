import { HistoryPage } from "@/components/pages/OtherPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.ka.historyTitle };

export default function Page() {
  return <HistoryPage lang="ka" />;
}
