import { NextResponse } from "next/server";
import { sendLeadEmail, SmtpNotConfiguredError } from "@/lib/lead-mail";
import { propertyTypeOptions } from "@/components/info/options";
import { normalizePhone } from "@/lib/phone";
import { isSupportedCountry, type CountryCode } from "libphonenumber-js/min";

export const runtime = "nodejs";

/** Receives every enquiry form and reports success only after SMTP accepts the email. */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot field: real people never fill it in
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const fields = Object.fromEntries(
    Object.entries(body)
      .filter(([k, v]) => k !== "company_website" && v != null && String(v).trim() !== "")
      .map(([k, v]) => [k, String(v).slice(0, 5000)]),
  );
  const name = fields.name || [fields.first_name, fields.last_name].filter(Boolean).join(" ");
  if (!name || !(fields.email || fields.phone)) {
    return NextResponse.json({ ok: false, error: "Please enter your name and an email or phone number." }, { status: 422 });
  }
  if (fields.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 422 });
  }

  if (fields.phone) {
    const country = fields.phone_country || "AE";
    const phone = isSupportedCountry(country) ? normalizePhone(fields.phone, country as CountryCode) : undefined;
    if (!phone) return NextResponse.json({ ok: false, error: "Please enter a valid phone number for the selected country." }, { status: 422 });
    fields.phone = phone;
  }

  if (fields.form === "Property Valuation") {
    const required = ["name", "email", "phone", "community"];
    const choices: Record<string, string[]> = {
      valuation_purpose: ["Selling", "Renting", "Selling and renting"],
      property_type: propertyTypeOptions,
      bedrooms: ["Studio", "1", "2", "3", "4", "5", "6+", "Not applicable"],
      contact_preference: ["Phone call", "WhatsApp", "Email"],
    };
    if (required.some((key) => !fields[key]?.trim()) || Object.entries(choices).some(([key, values]) => !values.includes(fields[key]))) {
      return NextResponse.json({ ok: false, error: "Please complete your contact details, property details and valuation preferences." }, { status: 422 });
    }
  }

  try {
    await sendLeadEmail(fields);
  } catch (error) {
    // Never log credentials or the visitor's personal details.
    console.error("[lead] SMTP delivery failed", error instanceof SmtpNotConfiguredError ? "not configured" : "send failed");
    return NextResponse.json(
      { ok: false, error: "Your message could not be sent. Please call or email us." },
      { status: error instanceof SmtpNotConfiguredError ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
