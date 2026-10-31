"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/contact";
import { t, type Lang } from "@/lib/i18n";

export default function ContactForm({ lang }: { lang: Lang }) {
  const f = t(lang).form;
  const [state, action, pending] = useActionState(sendMessage, { ok: false, error: "" });
  if (state.ok) return <p className="notice">{f.thanks}</p>;
  return (
    <form action={action} className="form">
      <input type="hidden" name="lang" value={lang} />
      <label className="field">{f.name}<input name="name" required maxLength={120} /></label>
      <label className="field">{f.email}<input name="email" type="email" required maxLength={200} /></label>
      <label className="field">{f.message}<textarea name="body" rows={5} required maxLength={5000} /></label>
      {/* honeypot: real visitors never fill this */}
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
      {state.error && <p className="notice error">{state.error}</p>}
      <button className="btn btn-dark" disabled={pending} style={{ alignSelf: "flex-start" }}>
        {pending ? f.sending : f.send}
      </button>
    </form>
  );
}
