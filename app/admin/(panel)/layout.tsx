import Link from "next/link";
import { redirect } from "next/navigation";
import { sessionClient, supabaseConfigured } from "@/lib/supabase/clients";
import { signOut } from "../actions";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";
export const metadata = { title: "ადმინ პანელი", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured) {
    return (
      <div className="login">
        <div className="admin-card">
          <h1 style={{ fontSize: 22, marginBottom: 12 }}>ბაზა ჯერ არ არის დაკავშირებული</h1>
          <p className="muted">Vercel-ში დაამატეთ NEXT_PUBLIC_SUPABASE_URL და NEXT_PUBLIC_SUPABASE_ANON_KEY (იხ. README).</p>
        </div>
      </div>
    );
  }
  const db = await sessionClient();
  const { data } = await db.auth.getUser();
  if (!data.user) redirect("/admin/login");

  return (
    <div className="admin">
      <aside className="admin-side">
        <div style={{ padding: "0 8px" }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>მერცხალი</div>
          <div style={{ fontSize: 12, color: "var(--on-dark-2)" }}>{data.user.email}</div>
        </div>
        <AdminNav />
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          <Link href="/">← საიტზე დაბრუნება</Link>
          <form action={signOut}>
            <button type="submit">გასვლა</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
