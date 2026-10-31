"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveNews } from "../../actions";
import { CATEGORIES, type News } from "@/lib/types";

export default function NewsForm({ news }: { news?: News }) {
  const [state, action, pending] = useActionState(saveNews, { ok: false, error: "" });
  const [title, setTitle] = useState(news?.title ?? "");
  const [excerpt, setExcerpt] = useState(news?.excerpt ?? "");
  const [category, setCategory] = useState(news?.category ?? CATEGORIES[0]);
  const [preview, setPreview] = useState<string | null>(news?.image_url ?? null);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {news && <input type="hidden" name="id" value={news.id} />}
      <div className="row-between" style={{ alignItems: "center" }}>
        <div>
          <div className="muted" style={{ fontSize: 13 }}>სიახლეები / {news ? "რედაქტირება" : "ახალი"}</div>
          <h1 style={{ fontSize: 30, fontWeight: 800 }}>{news ? "სიახლის რედაქტირება" : "ახალი სიახლე"}</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link href="/admin" className="btn btn-light">გაუქმება</Link>
          <button name="intent" value="draft" className="btn btn-light" disabled={pending}>მონახაზად შენახვა</button>
          <button name="intent" value="publish" className="btn btn-dark" disabled={pending}>{pending ? "ინახება…" : "გამოქვეყნება"}</button>
        </div>
      </div>
      {state.error && <p className="notice error">{state.error}</p>}
      <div className="split">
        <div className="admin-card form main">
          <label className="field">სათაური
            <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="მაგ.: მერცხალმა შინ მოიგო" style={{ fontSize: 17 }} />
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <label className="field" style={{ flex: "1 1 200px" }}>კატეგორია
              <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="field" style={{ flex: "1 1 200px" }}>გამოქვეყნების თარიღი
              <input type="date" name="published_at" defaultValue={news?.published_at?.slice(0, 10)} />
            </label>
          </div>
          <label className="field">მთავარი ფოტო
            <input
              type="file"
              name="image"
              accept="image/*"
              style={{ paddingTop: 10 }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
            <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>JPG, PNG ან WEBP, მაქს. 5 MB</span>
          </label>
          {news?.image_url && (
            <label className="check"><input type="checkbox" name="remove_image" />ფოტოს წაშლა</label>
          )}
          <label className="field">მოკლე აღწერა
            <textarea name="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="ერთი-ორი წინადადება სიახლის ბარათისთვის" />
          </label>
          <label className="field">ტექსტი
            <textarea name="body" rows={12} defaultValue={news?.body ?? ""} placeholder="აბზაცები გამოყავით ცარიელი ხაზით." style={{ fontSize: 16, lineHeight: 1.7 }} />
          </label>
          <label className="check"><input type="checkbox" name="featured" defaultChecked={news?.featured} />მთავარ გვერდზე გამორჩეულად ჩვენება</label>
        </div>
        <aside className="side" style={{ display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 24 }}>
          <span className="muted" style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".08em" }}>წინასწარი ხედი</span>
          <div className="card news-card">
            <div className="img">{preview ? <img src={preview} alt="" /> : "ფოტო"}</div>
            <div className="body">
              <span className="cat" style={{ fontSize: 13 }}>{category}</span>
              <h3>{title || "სიახლის სათაური"}</h3>
              <p>{excerpt || "მოკლე აღწერა"}</p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
