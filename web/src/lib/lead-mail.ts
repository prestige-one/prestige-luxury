import nodemailer from "nodemailer";

export class SmtpNotConfiguredError extends Error {
  constructor() {
    super("SMTP credentials are not configured.");
  }
}

/** Shared server-side mail delivery for every enquiry form. No connection pool stays open. */
export async function sendLeadEmail(fields: Record<string, string>) {
  const password = process.env.SMTP_PASSWORD?.trim();
  if (!password || password.startsWith("replace_with_")) {
    throw new SmtpNotConfiguredError();
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "it@prestigeone.ae";
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  const name = fields.name || [fields.first_name, fields.last_name].filter(Boolean).join(" ");

  const result = await transport.sendMail({
    from: { name: "Prestige Luxury Website", address: process.env.LEAD_FROM_EMAIL || user },
    to: (process.env.LEAD_TO_EMAIL || "sumith@prestigeone.ae").split(",").map((email) => email.trim()).filter(Boolean),
    replyTo: fields.email ? { name, address: fields.email } : undefined,
    subject: `Website enquiry: ${fields.form || "Contact"} – ${name}`.replace(/[\r\n]/g, " "),
    text: Object.entries(fields).map(([key, value]) => `${key.replace(/_/g, " ")}: ${value}`).join("\n"),
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  if (!result.accepted?.length) throw new Error("SMTP did not accept any recipients.");
}
