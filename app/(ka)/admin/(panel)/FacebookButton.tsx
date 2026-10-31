"use client";

import { useActionState } from "react";
import { facebookNow } from "../actions";

export default function FacebookButton() {
  const [state, action, pending] = useActionState(facebookNow, { ok: false, error: "" });
  return (
    <form action={action} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      {state.error && <span className={state.ok ? "notice" : "notice error"}>{state.error}</span>}
      <button className="btn btn-light" disabled={pending}>{pending ? "მოწმდება…" : "Facebook-დან განახლება"}</button>
    </form>
  );
}
