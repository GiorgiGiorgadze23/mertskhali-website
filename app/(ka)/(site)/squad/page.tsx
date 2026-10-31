import { SquadPage } from "@/components/pages/OtherPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.ka.squadTitle };
export const revalidate = 600;

export default function Page() {
  return <SquadPage lang="ka" />;
}
