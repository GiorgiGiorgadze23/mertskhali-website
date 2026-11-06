import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import FontLinks from "@/components/FontLinks";
import { dict } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: dict.ka.metaTitle, template: "%s · სკ მერცხალი 1925" },
  description: dict.ka.metaDesc,
  openGraph: { images: ["/logo-512.png"], locale: "ka_GE", siteName: "სკ მერცხალი 1925", type: "website" },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <head>
        <FontLinks />
      </head>
      <body>{children}  <Analytics />
      </body>
    </html>
  );
}
