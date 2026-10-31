"use client";

import { useActionState, useRef } from "react";
import { addGallery } from "../../actions";

export default function UploadForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (s: { ok: boolean; error: string }, f: FormData) => {
    const r = await addGallery(s, f);
    if (r.ok) ref.current?.reset();
    return r;
  }, { ok: false, error: "" });
  return (
    <form ref={ref} action={action} className="admin-card" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
      <label className="field" style={{ flex: "2 1 260px" }}>ფოტოები (რამდენიმეც შეიძლება)<input name="images" type="file" accept="image/*" multiple required style={{ paddingTop: 10 }} /></label>
      <label className="field" style={{ flex: "2 1 220px" }}>წარწერა<input name="caption" placeholder="მაგ.: მერცხალი — ბორჯომი, 5 ნოემბერი" /></label>
      <button className="btn btn-dark" disabled={pending}>{pending ? "იტვირთება…" : "ატვირთვა"}</button>
      {state.error && <p className="notice error" style={{ flexBasis: "100%" }}>{state.error}</p>}
      {state.ok && !pending && <p className="notice" style={{ flexBasis: "100%" }}>აიტვირთა.</p>}
    </form>
  );
}
