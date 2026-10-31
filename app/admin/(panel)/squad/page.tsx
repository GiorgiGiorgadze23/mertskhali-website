import { sessionClient } from "@/lib/supabase/clients";
import type { Player } from "@/lib/types";
import { deletePlayer, savePlayer } from "../../actions";
import ConfirmButton from "../ConfirmButton";

const POS = [
  ["GK", "მეკარე"],
  ["DF", "მცველი"],
  ["MF", "ნახევარმცველი"],
  ["FW", "თავდამსხმელი"],
];

function PosSelect({ value }: { value?: string }) {
  return (
    <select name="position" defaultValue={value ?? "MF"}>
      {POS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

export default async function AdminSquad() {
  const db = await sessionClient();
  const { data } = await db.from("players").select("*").order("position").order("sort");
  const players = (data as Player[]) ?? [];
  const cell = { padding: 0, minHeight: 40 } as const;
  return (
    <>
      <div>
        <div className="muted" style={{ fontSize: 13 }}>შემადგენლობა</div>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>მოთამაშეები ({players.length})</h1>
      </div>
      <form action={savePlayer} className="admin-card" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        <label className="field" style={{ flex: "2 1 220px" }}>სახელი გვარი<input name="name" required /></label>
        <label className="field" style={{ flex: "1 1 150px" }}>პოზიცია<PosSelect /></label>
        <label className="field" style={{ flex: "0 1 90px" }}>ნომერი<input name="number" /></label>
        <label className="field" style={{ flex: "0 1 110px" }}>დაბ. წელი<input name="birth_year" type="number" min={1950} max={2020} /></label>
        <label className="field" style={{ flex: "1 1 200px" }}>ფოტო<input name="photo" type="file" accept="image/*" style={{ paddingTop: 10 }} /></label>
        <button className="btn btn-dark">+ დამატება</button>
      </form>
      <div className="admin-card" style={{ padding: 0, overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>სახელი გვარი</th><th>პოზიცია</th><th>№</th><th>წელი</th><th>ფოტო</th><th></th></tr></thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id}>
                <td colSpan={6} style={{ padding: "8px 16px" }}>
                  <form action={savePlayer} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }} className="inline-edit">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="name" defaultValue={p.name} style={{ ...cell, flex: "2 1 200px", padding: "0 10px" }} aria-label="სახელი" />
                    <span style={{ flex: "1 1 150px" }}><PosSelect value={p.position} /></span>
                    <input name="number" defaultValue={p.number ?? ""} style={{ ...cell, width: 70, padding: "0 10px" }} aria-label="ნომერი" />
                    <input name="birth_year" type="number" defaultValue={p.birth_year ?? ""} style={{ ...cell, width: 100, padding: "0 10px" }} aria-label="წელი" />
                    <input name="photo" type="file" accept="image/*" style={{ ...cell, flex: "1 1 180px", border: 0 }} aria-label="ფოტო" />
                    <button className="btn btn-light btn-sm">შენახვა</button>
                  </form>
                  <form action={deletePlayer} style={{ display: "inline" }}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton message={`წავშალოთ ${p.name}?`}>წაშლა</ConfirmButton>
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
