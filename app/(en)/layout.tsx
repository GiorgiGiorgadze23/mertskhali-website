import type { Metadata } from "next";
import "../globals.css";
import FontLinks from "@/components/FontLinks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mertskhali-website.vercel.app"),
  title: { default: dict.en.metaTitle, template: "%s · FC Mertskhali" },
  description: dict.en.metaDesc,
  openGraph: { images: ["/logo-512.png"], locale: "en_US" },
  alternates: { languages: { ka: "/" } },
};

export default function EnglishRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <FontLinks />
      </head>
      <body>
        <div className="page">
          <SiteHeader lang="en" />
          <main>{children}</main>
          <SiteFooter lang="en" />
        </div>
      </body>
    </html>
  );
}
