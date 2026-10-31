"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { ok: false, error: "" });
  return (
    <form action={action} className="form">
      <label className="field">ელფოსტა<input name="email" type="email" autoComplete="username" required /></label>
      <label className="field">პაროლი<input name="password" type="password" autoComplete="current-password" required /></label>
      {state.error && <p className="notice error">{state.error}</p>}
      <button className="btn btn-dark" disabled={pending}>{pending ? "შესვლა…" : "შესვლა"}</button>
    </form>
  );
}
