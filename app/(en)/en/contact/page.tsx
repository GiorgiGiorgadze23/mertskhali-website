import { ContactPage } from "@/components/pages/OtherPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.en.contactTitle };

export default function Page() {
  return <ContactPage lang="en" />;
}
