import { GalleryPage } from "@/components/pages/OtherPages";
import { dict } from "@/lib/i18n";

export const metadata = { title: dict.en.galleryTitle };
export const revalidate = 300;

export default function Page() {
  return <GalleryPage lang="en" />;
}
