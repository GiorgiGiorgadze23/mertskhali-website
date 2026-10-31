import { sessionClient } from "@/lib/supabase/clients";
import { formatDate } from "@/lib/data";
import { deleteMessage } from "../../actions";
import ConfirmButton from "../ConfirmButton";

type Msg = { id: string; name: string; email: string; body: string; created_at: string };

export default async function AdminMessages() {
  const db = await sessionClient();
  const { data } = await db.from("messages").select("*").order("created_at", { ascending: false }).limit(200);
  const items = (data as Msg[]) ?? [];
  return (
    <>
      <div>
        <div className="muted" style={{ fontSize: 13 }}>შეტყობინებები</div>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>საკონტაქტო ფორმიდან ({items.length})</h1>
      </div>
      {items.length === 0 && <p className="muted">ჯერ შეტყობინება არ არის.</p>}
      {items.map((m) => (
        <div key={m.id} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="row-between" style={{ alignItems: "center" }}>
            <div>
              <b>{m.name}</b> · <a href={`mailto:${m.email}`}>{m.email}</a>
              <div className="muted" style={{ fontSize: 13 }}>{formatDate(m.created_at)}</div>
            </div>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton message="წავშალოთ ეს შეტყობინება?">წაშლა</ConfirmButton>
            </form>
          </div>
          <p style={{ whiteSpace: "pre-line" }}>{m.body}</p>
        </div>
      ))}
    </>
  );
}
