import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import FontLinks from "@/components/FontLinks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { dict } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: dict.en.metaTitle, template: "%s · FC Mertskhali 1925" },
  description: dict.en.metaDesc,
  openGraph: { images: ["/logo-512.png"], locale: "en_US", siteName: "FC Mertskhali 1925", type: "website" },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
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
        <Analytics />
      </body>
    </html>
  );
}
