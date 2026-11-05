import { matchOgImage, OG_SIZE } from "@/lib/og-match";

export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 300;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  return matchOgImage("en", (await params).id);
}
