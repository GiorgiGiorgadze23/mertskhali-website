import { sessionClient } from "@/lib/supabase/clients";
import type { GalleryItem } from "@/lib/types";
import { deleteGallery } from "../../actions";
import ConfirmButton from "../ConfirmButton";
import UploadForm from "./UploadForm";

export default async function AdminGallery() {
  const db = await sessionClient();
  const { data } = await db.from("gallery").select("*").order("created_at", { ascending: false });
  const items = (data as GalleryItem[]) ?? [];
  return (
    <>
      <div>
        <div className="muted" style={{ fontSize: 13 }}>გალერეა</div>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>ფოტოები ({items.length})</h1>
      </div>
      <UploadForm />
      <div className="grid-cards" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {items.map((g) => (
          <div key={g.id} className="card" style={{ overflow: "hidden" }}>
            <img src={g.image_url} alt={g.caption ?? ""} style={{ width: "100%", height: 160, objectFit: "cover" }} />
            <div style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{g.caption ?? "—"}</span>
              <form action={deleteGallery}>
                <input type="hidden" name="id" value={g.id} />
                <ConfirmButton message="წავშალოთ ეს ფოტო?">წაშლა</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
