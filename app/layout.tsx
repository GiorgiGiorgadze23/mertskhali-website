import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ს.კ მერცხალი 1925 — ოზურგეთი", template: "%s · მერცხალი" },
  description: "ოზურგეთის მერცხლის ოფიციალური საიტი: სიახლეები, შემადგენლობა, მატჩები და ტურნირის ცხრილი.",
  openGraph: { images: ["/logo-512.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;500;700&family=Noto+Serif+Georgian:wght@600;800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
