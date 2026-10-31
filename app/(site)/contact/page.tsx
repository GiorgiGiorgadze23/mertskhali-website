import { CONTACT } from "@/lib/club";
import ContactForm from "./ContactForm";

export const metadata = { title: "კონტაქტი" };

export default function ContactPage() {
  return (
    <section className="container section">
      <div className="split">
        <div className="main" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h1 className="h1">კონტაქტი</h1>
          <div><div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>მისამართი</div><div style={{ fontSize: 17 }}>{CONTACT.address}</div></div>
          <div><div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>ტელეფონი</div><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} style={{ fontSize: 17 }}>{CONTACT.phone}</a></div>
          <div><div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>ელფოსტა</div><a href={`mailto:${CONTACT.email}`} style={{ fontSize: 17 }}>{CONTACT.email}</a></div>
          <div><div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>სოციალური ქსელი</div><a href={CONTACT.facebook} target="_blank" rel="noopener" style={{ fontSize: 17, fontWeight: 700 }}>Facebook — ს.კ მერცხალი 1925</a></div>
          <iframe
            title="რუკა — ოზურგეთი"
            src="https://www.openstreetmap.org/export/embed.html?bbox=41.98%2C41.91%2C42.02%2C41.93&layer=mapnik"
            style={{ width: "100%", height: 260, border: 0, borderRadius: 10 }}
            loading="lazy"
          />
        </div>
        <div className="side card" style={{ padding: 28, background: "var(--paper)" }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>მოგვწერეთ</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
