"use client";

import { useActionState } from "react";
import { sendMessage } from "./actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, { ok: false, error: "" });
  if (state.ok) return <p className="notice">გმადლობთ! შეტყობინება გაიგზავნა.</p>;
  return (
    <form action={action} className="form">
      <label className="field">სახელი<input name="name" required maxLength={120} /></label>
      <label className="field">ელფოსტა<input name="email" type="email" required maxLength={200} /></label>
      <label className="field">შეტყობინება<textarea name="body" rows={5} required maxLength={5000} /></label>
      {/* honeypot: real visitors never fill this */}
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
      {state.error && <p className="notice error">{state.error}</p>}
      <button className="btn btn-dark" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {pending ? "იგზავნება…" : "გაგზავნა"}
      </button>
    </form>
  );
}
