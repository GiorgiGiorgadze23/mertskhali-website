import Link from "next/link";
import { CONTACT } from "@/lib/club";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div>
          <strong>ს.კ მერცხალი 1925</strong>
          <div>{CONTACT.address}</div>
          <div>
            {CONTACT.phone} · {CONTACT.email}
          </div>
        </div>
        <nav aria-label="ქვედა მენიუ">
          <Link href="/contact">კონტაქტი</Link>
          <a href={CONTACT.facebook} target="_blank" rel="noopener">Facebook</a>
          <a href="https://liga.gff.ge/?season=44&league=4" target="_blank" rel="noopener">ლიგა 4 — GFF</a>
          <Link href="/admin">ადმინისტრატორი</Link>
        </nav>
      </div>
    </footer>
  );
}
