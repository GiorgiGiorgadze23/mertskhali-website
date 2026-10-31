"use client";

import { useActionState } from "react";
import { syncNow } from "../../actions";

export default function SyncButton() {
  const [state, action, pending] = useActionState(syncNow, { ok: false, error: "" });
  return (
    <form action={action} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      {state.error && <span className={state.ok ? "notice" : "notice error"}>{state.error}</span>}
      <button className="btn btn-dark" disabled={pending}>{pending ? "ახლდება…" : "ახლავე განახლება"}</button>
    </form>
  );
}
