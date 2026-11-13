"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

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
  const uid = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  // Per-field validation messages, shown under the field and linked to it with aria-describedby.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    // Validation runs here (the form is `noValidate`) so every message can be shown in the page
    // and tied to its field, instead of only in a native bubble.
    const controls = Array.from(formEl.elements).filter(
      (el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
        (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) &&
        Boolean(el.name) &&
        el.name !== "company_website",
    );
    const invalid = controls.filter((el) => !el.checkValidity());
    if (invalid.length) {
      setFieldErrors(Object.fromEntries(invalid.map((el) => [el.name, el.validationMessage])));
      invalid[0].focus();
      return;
    }
    setFieldErrors({});

    setState("sending");
    const data = Object.fromEntries(new FormData(formEl).entries());
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, ...extra, form, page: window.location.pathname }),
    }).catch(() => null);
    const json = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok && json.ok) {
      if (redirectTo) return router.push(redirectTo);
      setState("sent");
      formEl.reset();
    } else {
      setState("error");
      setError(json.error || "Sorry, something went wrong. Please try again.");
    }
  }

  const input = `w-full min-h-[48px] rounded-[2px] border px-4 py-3 text-[14px] outline-none transition-[border-color,box-shadow,background-color] duration-200 focus-visible:outline-none ${
    dark
      ? "border-white/30 bg-white/10 text-white placeholder:text-white/65 hover:border-white/50 focus:border-white focus:bg-white/[0.14] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)] [&>option]:text-ink"
      : "border-line bg-white text-ink placeholder:text-[#8a8a8a] hover:border-[#cfcfcf] focus:border-accent focus:shadow-[0_0_0_3px_rgba(131,90,90,0.14)]"
  }`;
  const errorRing = dark ? " !border-red-300" : " !border-red-600";

  if (state === "sent") {
    return (
      <div
        className={`rounded-[2px] border p-8 text-center animate-[img-fade-in_0.4s_ease-out] ${dark ? "border-white/30 text-white" : "border-line bg-cream text-ink"}`}
        role="status"
      >
        <span
          className={`mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full ${dark ? "bg-white/15 text-white" : "bg-accent text-white"}`}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="text-[18px] font-medium">Thank you!</p>
        <p className="mt-1 text-[14px] opacity-80">Your message has been sent. Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 gap-4">
      {fields.map((f) => {
        const fieldError = fieldErrors[f.name];
        // A phone number is typed left-to-right even in an RTL page, but its placeholder/value
        // stay aligned with the other fields.
        const tel = f.type === "tel";
        const common = {
          id: fieldId(f.name),
          name: f.name,
          required: f.required,
          "aria-invalid": fieldError ? (true as const) : undefined,
          "aria-describedby": fieldError ? errorId(f.name) : undefined,
          onInput: () =>
            setFieldErrors((prev) => {
              if (!prev[f.name]) return prev;
              const next = { ...prev };
              delete next[f.name];
              return next;
            }),
          className: `${input}${fieldError ? errorRing : ""}`,
        };
        return (
          <div key={f.name} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
            {/* visually hidden: the placeholder carries the design, the label the accessible name.
                Required fields are announced from the `required` attribute (in the reader's own language). */}
            <label htmlFor={fieldId(f.name)} className="sr-only">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} placeholder={f.label} rows={5} />
            ) : f.type === "select" ? (
              <select {...common} defaultValue="">
                <option value="" disabled>
                  {f.label}
                </option>
                {f.options?.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={f.type ?? "text"}
                placeholder={f.label}
                dir={tel ? "ltr" : undefined}
                className={`${common.className}${tel ? " rtl:text-right" : ""}`}
              />
            )}
            {fieldError && (
              <p id={errorId(f.name)} className={`mt-1.5 text-[12.5px] ${dark ? "text-red-200" : "text-red-700"}`}>
                {fieldError}
              </p>
            )}
          </div>
        );
      })}
      {/* honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[2px] px-8 py-3 text-[14px] font-medium tracking-[0.02em] transition-colors duration-300 active:translate-y-px disabled:cursor-wait disabled:opacity-60 max-sm:w-full ${
            dark ? "bg-white text-ink hover:bg-accent hover:text-white" : "bg-black text-white hover:bg-accent"
          }`}
        >
          {state === "sending" && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
          )}
          {state === "sending" ? "Sending…" : submitLabel}
        </button>
        {state === "error" && (
          <p
            className={`mt-3 flex items-start gap-2 rounded-[2px] border-l-2 px-3 py-2 text-[13px] ${
              dark ? "border-red-300 bg-red-500/10 text-red-200" : "border-red-600 bg-red-50 text-red-700"
            }`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
