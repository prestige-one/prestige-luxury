"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type LeadField = {
  name: string; // sent as the field key, e.g. "name", "email", "phone", "message"
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  half?: boolean; // take half the row on desktop
};

export const defaultLeadFields: LeadField[] = [
  { name: "name", label: "Name", required: true, half: true },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", half: true },
  { name: "subject", label: "Subject", half: true },
  { name: "message", label: "Message", type: "textarea" },
];

/**
 * One enquiry form for the whole site. Posts to /api/lead.
 * `form` names the form in the email subject ("Contact", "Sell", "Orra Embankment", ...).
 * `redirectTo` sends the visitor to a thank-you page after a successful submit.
 */
export default function LeadForm({
  form,
  fields = defaultLeadFields,
  submitLabel = "Submit",
  redirectTo,
  extra,
  dark = false,
}: {
  form: string;
  fields?: LeadField[];
  submitLabel?: string;
  redirectTo?: string;
  extra?: Record<string, string>; // hidden values, e.g. { property: "REF-123" }
  dark?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, ...extra, form, page: window.location.pathname }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok && json.ok) {
      if (redirectTo) return router.push(redirectTo);
      setState("sent");
      e.currentTarget?.reset();
    } else {
      setState("error");
      setError(json.error || "Sorry, something went wrong. Please try again.");
    }
  }

  const input = `w-full rounded-[2px] border px-4 py-3 text-[14px] outline-none focus:border-accent ${
    dark ? "border-white/30 bg-white/10 text-white placeholder:text-white/60" : "border-line bg-white text-ink placeholder:text-muted"
  }`;

  if (state === "sent") {
    return (
      <div className={`rounded-[2px] border p-6 text-center ${dark ? "border-white/30 text-white" : "border-line"}`} role="status">
        <p className="text-[18px] font-medium">Thank you!</p>
        <p className="mt-1 text-[14px] opacity-80">Your message has been sent. Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
      {fields.map((f) => (
        <label key={f.name} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
          <span className="sr-only">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea name={f.name} placeholder={f.label} required={f.required} rows={5} className={input} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} className={input} defaultValue="">
              <option value="" disabled>
                {f.label}
              </option>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? "text"} placeholder={f.label} required={f.required} className={input} />
          )}
        </label>
      ))}
      {/* honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className={`px-8 py-3 text-[14px] font-medium transition-colors disabled:opacity-60 ${
            dark ? "bg-white text-ink hover:bg-accent hover:text-white" : "bg-black text-white hover:bg-accent"
          }`}
        >
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
        {state === "error" && (
          <p className="mt-3 text-[13px] text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
