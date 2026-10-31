import type { Metadata } from "next";
import "../globals.css";
import FontLinks from "@/components/FontLinks";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mertskhali-website.vercel.app"),
  title: { default: dict.ka.metaTitle, template: "%s · მერცხალი" },
  description: dict.ka.metaDesc,
  openGraph: { images: ["/logo-512.png"], locale: "ka_GE" },
  alternates: { languages: { en: "/en" } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <head>
        <FontLinks />
      </head>
      <body>{children}</body>
    </html>
  );
}
