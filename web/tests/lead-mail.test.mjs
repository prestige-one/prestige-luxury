import assert from "node:assert/strict";
import { test, mock } from "node:test";
import nodemailer from "nodemailer";
import { sendLeadEmail, SmtpNotConfiguredError } from "../src/lib/lead-mail.ts";

test("shared enquiry SMTP delivery", async (t) => {
  const keys = ["SMTP_PASSWORD", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "LEAD_FROM_EMAIL", "LEAD_TO_EMAIL"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  t.after(() => {
    mock.restoreAll();
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });
  for (const key of keys) delete process.env[key];

  let options, message;
  let accepted = true;
  mock.method(nodemailer, "createTransport", (config) => {
    options = config;
    return { sendMail: async (mail) => {
      message = mail;
      return { accepted: accepted ? mail.to : [] };
    } };
  });

  await t.test("missing or placeholder credentials cannot report success", async () => {
    await assert.rejects(sendLeadEmail({ name: "Test" }), SmtpNotConfiguredError);
    process.env.SMTP_PASSWORD = "replace_with_brevo_smtp_key";
    await assert.rejects(sendLeadEmail({ name: "Test" }), SmtpNotConfiguredError);
    assert.equal(options, undefined);
  });

  process.env.SMTP_PASSWORD = "test-only-smtp-secret";
  await t.test("all form sources share recipient, STARTTLS and visitor reply-to", async () => {
    for (const form of ["Contact", "Sell", "Careers", "Property enquiry", "Project landing"] ) {
      await sendLeadEmail({ first_name: "Test", last_name: "Visitor", email: "visitor@example.com", form, message: "Test enquiry" });
      assert.equal(options.host, "smtp-relay.brevo.com");
      assert.equal(options.port, 587);
      assert.equal(options.secure, false);
      assert.equal(options.requireTLS, true);
      assert.equal(options.auth.user, "it@prestigeone.ae");
      assert.deepEqual(message.to, ["sumith@prestigeone.ae"]);
      assert.equal(message.from.address, "it@prestigeone.ae");
      assert.equal(message.replyTo.address, "visitor@example.com");
      assert.match(message.subject, new RegExp(form));
      assert.match(message.text, /message: Test enquiry/);
    }
  });

  await t.test("recipient can be changed through the environment", async () => {
    process.env.LEAD_TO_EMAIL = "new@example.com, second@example.com";
    await sendLeadEmail({ name: "Test", phone: "+971523702269" });
    assert.deepEqual(message.to, ["new@example.com", "second@example.com"]);
    assert.equal(message.replyTo, undefined);
  });

  await t.test("SMTP rejection cannot report success", async () => {
    accepted = false;
    await assert.rejects(sendLeadEmail({ name: "Test" }), /did not accept/);
  });
});
