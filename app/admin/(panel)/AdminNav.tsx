"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "სიახლეები" },
  { href: "/admin/matches", label: "მატჩები და ცხრილი" },
  { href: "/admin/squad", label: "შემადგენლობა" },
  { href: "/admin/gallery", label: "გალერეა" },
  { href: "/admin/messages", label: "შეტყობინებები" },
];

export default function AdminNav() {
  const path = usePathname();
  const active = (h: string) => (h === "/admin" ? path === "/admin" || path.startsWith("/admin/news") : path.startsWith(h));
  return (
    <nav aria-label="ადმინის მენიუ">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
