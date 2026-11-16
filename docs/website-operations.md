# Website operations

## Enquiry forms

Contact, property/project, developer, valuation, sell and careers enquiries use the shared
`web/src/components/LeadForm.tsx` → `/api/lead` → `web/src/lib/lead-mail.ts` flow.
Search forms only navigate to search results; they do not send emails.

The server validates the submission and sends a plain-text email through Brevo SMTP.
The email contains the form name, page path and submitted fields. Property/developer
forms also include their identifying reference. Reply-To is the visitor's email when supplied.
There is currently no database or CRM copy of enquiries and no automatic visitor receipt.
Success means the SMTP server accepted the message, not verified inbox delivery.

Default recipient: `sumith@prestigeone.ae`. All enquiry forms share the same settings.

Local setup: copy `web/.env.example` to `web/.env` and set:

```dotenv
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=it@prestigeone.ae
SMTP_PASSWORD=replace_with_brevo_smtp_key
LEAD_FROM_EMAIL=it@prestigeone.ae
LEAD_TO_EMAIL=sumith@prestigeone.ae
LEAD_CC_EMAIL=
```

- Use a Brevo **SMTP key**, not a REST API key. Verify the sender in Brevo.
- Change `LEAD_TO_EMAIL` to change the receiver. Comma-separated addresses add receivers.
- Optional `LEAD_CC_EMAIL` accepts comma-separated addresses. Leave it blank for no CC.
- Restart the local server after updating environment variables.
- On Vercel, update **Project Settings → Environment Variables** for the desired environment,
  then redeploy. Editing a local `.env` does not change live Vercel settings.
- Keep credentials out of Git. Local files and Vercel environment values are separate.

`node --test tests/lead-mail.test.mjs` from `web/` checks SMTP configuration, recipients,
CC, Reply-To and rejection handling with mocked delivery. It does not send real emails.
A valid configured SMTP key and a real test submission are needed to verify inbox delivery.

## Currency display

Source: `web/src/lib/currency.ts` and `web/src/components/currency/store.ts`.
Prices are stored in AED. The browser fetches `https://open.er-api.com/v6/latest/AED`
without an API key. A successful table is cached in localStorage for 12 hours; a subsequent
page load refreshes an expired cache. If the API is unavailable, bundled fallback rates
are used. Conversions change the displayed price, not the stored AED asking price.

## Property and project data

- Property listings: `web/content/properties.json`, read by `web/src/lib/properties.ts`.
  These are local snapshots imported from Property Finder/Bayut, not a live visitor-time API.
- Developer profiles and Signature Projects: `web/content/developers.json`.
- Prestige One project names were checked against `https://prestigeone.ae/projects`
  on 16 November 2026: 22 projects, including the upcoming entries and Greece project.
  This is an editorial update, not an automatic connection to that website.
- Dedicated project landing-page descriptions, galleries and statistics are defined in
  `web/src/app/(landing)/` page configurations and rendered by shared landing components.
- Import helpers: `crawl/pf-to-properties.mjs` and `crawl/bayut-to-properties.mjs` consume
  collected snapshots. No scheduled live sync is configured in this repository.
- Developer available-property totals use matched known project/building names. Shared
  communities alone do not identify a property's developer. Results paginate at 12 per page.

Update the relevant local content/configuration and deploy it to change the live website.

## Directory photography

`web/content/neighbourhood-images.json` and `web/content/developer-images.json` contain
local image selections. Photographs are saved under `web/public/images/neighbourhoods/`
and `web/public/images/developers/`. Source records and import helpers are kept in `crawl/`.
Community photos are labelled as locations rather than asserted to be a developer's project.
