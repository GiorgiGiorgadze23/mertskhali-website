import Link from "next/link";
import { sessionClient } from "@/lib/supabase/clients";
import { formatDate } from "@/lib/data";
import type { News } from "@/lib/types";
import { deleteNews } from "../actions";
import ConfirmButton from "./ConfirmButton";
import FacebookButton from "./FacebookButton";
import { facebookConfigured } from "@/lib/facebook";

export default async function AdminNews({ searchParams }: { searchParams: Promise<{ saved?: string; q?: string }> }) {
  const sp = await searchParams;
  const db = await sessionClient();
  let query = db.from("news").select("*").order("created_at", { ascending: false }).limit(100);
  if (sp.q) query = query.ilike("title", `%${sp.q}%`);
  const { data } = await query;
  const rows = (data as News[]) ?? [];
  return (
    <>
      <div className="row-between" style={{ alignItems: "center" }}>
        <div>
          <div className="muted" style={{ fontSize: 13 }}>სიახლეები</div>
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>სიახლეების მართვა</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          {facebookConfigured() && <FacebookButton />}
          <Link href="/admin/news/new" className="btn btn-dark">+ ახალი სიახლე</Link>
        </div>
      </div>
      {sp.saved && <p className="notice">შენახულია.</p>}
      <form className="field" style={{ maxWidth: 360 }}>
        ძებნა
        <input type="search" name="q" defaultValue={sp.q} placeholder="სათაურით…" />
      </form>
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr><th>სათაური</th><th>კატეგორია</th><th>თარიღი</th><th>სტატუსი</th><th style={{ textAlign: "right" }}>მოქმედება</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="muted">ჯერ სიახლე არ არის — დააჭირეთ „ახალი სიახლე“.</td></tr>
            )}
            {rows.map((n) => (
              <tr key={n.id}>
                <td style={{ fontWeight: 700 }}>
                  {n.title}
                  {n.source === "facebook" && (
                    <a href={n.fb_url ?? "#"} target="_blank" rel="noopener" className="status" style={{ marginLeft: 8, background: "#e7efff", color: "#1d4fb3", textDecoration: "none" }}>Facebook</a>
                  )}
                </td>
                <td>{n.category}</td>
                <td className="muted">{formatDate(n.published_at ?? n.created_at)}</td>
                <td><span className={`status ${n.published ? "pub" : "draft"}`}>{n.published ? "გამოქვეყნებული" : "მონახაზი"}</span></td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/news/${n.id}`} className="btn btn-light btn-sm">რედაქტირება</Link>{" "}
                  <form action={deleteNews} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={n.id} />
                    <ConfirmButton message="წავშალოთ ეს სიახლე?">წაშლა</ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
