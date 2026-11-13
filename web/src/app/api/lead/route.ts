import { NextResponse } from "next/server";

/**
 * Receives every enquiry form on the site (contact, sell, careers, project landing pages, property enquiries).
 * Sends it by email through Resend when RESEND_API_KEY is set; otherwise it is only logged
 * (visible in Vercel → Logs) so no lead is silently dropped while email is being set up.
 *
 * Env: RESEND_API_KEY, LEAD_TO_EMAIL (default info@prestigeluxury.ae), LEAD_FROM_EMAIL
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
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

  const subject = `Website enquiry: ${fields.form || "Contact"} – ${name}`;
  const text = Object.entries(fields)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[lead] ${subject}\n${text}`);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "Prestige Luxury Website <website@prestigeluxury.ae>",
      to: (process.env.LEAD_TO_EMAIL || "info@prestigeluxury.ae").split(","),
      reply_to: fields.email || undefined,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    console.error(`[lead] email failed ${res.status}: ${await res.text()}\n${subject}\n${text}`);
    return NextResponse.json({ ok: false, error: "Sorry, something went wrong. Please call or email us." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
