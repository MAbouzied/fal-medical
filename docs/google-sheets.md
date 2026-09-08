# Google Sheets Integration

This guide documents how booking and customer data is stored in Google Sheets, how to reproduce the
feature, and how to configure it safely for local development and Cloudflare production.

## Data flow

Submitting any booking form sends the validated name, phone, department, Arabic service, page, and
language to the server-only `POST /api/customers` endpoint. In one Google Sheets batch, the endpoint
appends the full record to `Bookings` and the raw timestamp, name, and phone to `Customers`.

WhatsApp still opens if Google Sheets is temporarily unavailable. The browser never receives the Google
service-account email, private key, or spreadsheet ID.

## Feature requirements

- Every valid booking submission creates one row in `Bookings`.
- The same submission creates one raw customer row in `Customers` with the customer's name and phone.
- `Customers` records every valid submission. It does not deduplicate repeated phone numbers.
- `Bookings` must not contain a `Form` column or store an internal form identifier.
- The stored service must always be the canonical Arabic title from `src/data/services.ts`, including
  submissions made through English pages. English service text is display-only.
- Both rows are appended in one Google `spreadsheets.batchUpdate` request so Google validates both tab
  operations before applying them.
- The spreadsheet stays private and is shared only with authorized clinic administrators and the service account.
- Customers cannot read either sheet through the website because the API is POST-only and no customer-list
  or booking-list endpoint exists.

## Sheet schemas

| Tab | Columns | Purpose |
| --- | --- | --- |
| `Bookings` | `Submitted At`, `Name`, `Phone`, `Department`, `Service`, `Page`, `Language` | Full booking record. Service is always Arabic. |
| `Customers` | `Registered At`, `Name`, `Phone` | Raw customer data captured from every valid booking. |

Do not add the removed `Form` column back to `Bookings` unless the API row structure and this documented
schema are deliberately changed together.

## Implementation map

- `src/pages/api/customers.ts` validates requests, resolves the Arabic service title, and builds both rows.
- `src/lib/google-sheets.ts` authenticates the service account and appends both rows in one batch.
- `src/lib/customer-leads.ts` is the browser client for the POST-only endpoint.
- `src/components/contact/BookingForm.astro`, `src/components/services/BookingSection.astro`,
  `src/pages/book.astro`, and `src/pages/en/book.astro` submit customer data before opening WhatsApp.
- `astro.config.mjs` declares server-only secrets and enables `@astrojs/cloudflare` for the live API route.
- `.dev.vars.example` documents the local secret names without containing real credentials.

When adding another booking form later, submit the canonical Arabic `service.title` as the option value.
An English page may render an English option label, but its value must remain Arabic so the API accepts it.

## Google setup

1. Create or select a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).
3. Open **IAM & Admin > Service Accounts**, create a service account, then create a JSON key under its **Keys** tab.
4. Create a private Google spreadsheet with tabs named `Bookings` and `Customers`.
5. Add this header row to `Bookings!A1:G1`:

```text
Submitted At | Name | Phone | Department | Service | Page | Language
```

6. Add this header row to `Customers!A1:C1`:

```text
Registered At | Name | Phone
```

7. Share only that spreadsheet with the JSON file's `client_email` as **Editor**. Do not publish the sheet or enable link sharing.
8. Read these values from the downloaded JSON key and the spreadsheet URL:

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL  = client_email
GOOGLE_PRIVATE_KEY            = private_key
GOOGLE_SHEET_ID               = the value between /d/ and /edit in the sheet URL
GOOGLE_BOOKINGS_SHEET_NAME    = Bookings
GOOGLE_CUSTOMERS_SHEET_NAME   = Customers
```

No Google Workspace domain-wide delegation or Google OAuth consent screen is required. Sharing this
single spreadsheet with the service account is enough.

## Local secrets

Copy `.dev.vars.example` to `.dev.vars` and replace its placeholders. Keep the private key on one line
with literal `\n` separators, as shown in the example. `.dev.vars` and the current demo credential JSON
are ignored by Git. Any differently named credential file must also be added to `.gitignore` before use.

Never expose the JSON credential, private key, spreadsheet ID, or `.dev.vars` through client code or a
`PUBLIC_` environment variable.

Start the development server with:

```sh
npx astro dev --background
```

## Manual test

1. Open `http://localhost:4321/book` or `http://localhost:4321/contact`.
2. Submit a valid Saudi mobile number, name, department, service, and consent.
3. Confirm WhatsApp opens with the booking message.
4. Confirm one new 7-column row appears in `Bookings`.
5. Confirm one matching 3-column row appears in `Customers`.
6. Confirm the service stored in `Bookings` is Arabic, even when testing `/en/book`.

Do not run `npm run build`, `npm run check`, or `npm run verify` while the background dev server is active.
These commands can regenerate Vite's `deps_ssr` cache while the running process still references old hashed
files, causing a `NonRunnablePipeline.getComponentByRoute` error. Use this sequence instead:

```sh
npx astro dev stop
npm run verify
npx astro dev --background
```

If the missing `node_modules/.vite/deps_ssr` error already appears, stopping and restarting the background
server after verification rebuilds the correct development cache.

## Cloudflare secrets

Add all five production values as encrypted Worker secrets in the Cloudflare dashboard, or run each
command and paste the requested value:

```sh
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_PRIVATE_KEY
npx wrangler secret put GOOGLE_SHEET_ID
npx wrangler secret put GOOGLE_BOOKINGS_SHEET_NAME
npx wrangler secret put GOOGLE_CUSTOMERS_SHEET_NAME
```

Then deploy with `npm run deploy`.

Do not deploy until the spreadsheet tabs, Editor sharing, production secrets, and manual two-tab test are
complete. Deployment requires explicit project-owner approval.

The remaining setup that cannot be completed from this repository is creating the Google service account,
privately sharing the spreadsheet, and adding the real secret values to local and Cloudflare environments.

## Security notes

- `@astrojs/cloudflare` provides the runtime required by the customer API route.
- The customer endpoint is POST-only, validates Saudi mobile numbers, checks same-origin browser requests,
  enforces an 8 KB body cap, derives department from the matched service, includes a honeypot, and applies
  a per-IP in-memory rate limit (10 requests / 60s per isolate).
- Optionally add a Cloudflare WAF rate-limiting rule for `/api/customers` for account-wide abuse protection.
- Security and cache headers are in `public/_headers`.

## Demo credential cleanup

The current service-account JSON and `.dev.vars` values are for demo testing only. Before production:

1. Delete the demo JSON file and local `.dev.vars` when they are no longer needed.
2. Open Google Cloud Console, go to the service account's **Keys** tab, and revoke/delete the demo key.
3. Create or select the approved production credential.
4. Keep the spreadsheet private and confirm the production service account has Editor access.
5. Add the production values as encrypted Cloudflare secrets.
6. Repeat the manual two-tab test before requesting deployment approval.

## References

- [Google Sheets API](https://developers.google.com/workspace/sheets/api/guides/values)
- [Google service accounts](https://developers.google.com/workspace/guides/create-credentials#service-account)
- [Astro Cloudflare adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
