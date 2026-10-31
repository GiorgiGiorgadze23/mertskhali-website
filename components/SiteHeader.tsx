"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "მთავარი" },
  { href: "/news", label: "სიახლეები" },
  { href: "/squad", label: "შემადგენლობა" },
  { href: "/matches", label: "მატჩები" },
  { href: "/history", label: "ისტორია" },
  { href: "/gallery", label: "გალერეა" },
  { href: "/contact", label: "კონტაქტი" },
];

export default function SiteHeader() {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="brand">
          <img src="/logo.png" alt="ს.კ მერცხალი 1925" width={52} height={52} />
          <span>
            <span className="brand-name">მერცხალი</span>
            <span className="brand-sub">ოზურგეთი · 1925</span>
          </span>
        </Link>
        <nav className="nav" aria-label="მთავარი მენიუ">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
