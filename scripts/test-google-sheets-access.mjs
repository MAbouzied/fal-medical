/**
 * External Google Sheets probe. Reads a service-account JSON and tries the
 * same OAuth + tab lookup + append path the Worker uses.
 *
 * Usage:
 *   node scripts/test-google-sheets-access.mjs --json <path> --sheet-id <id>
 */
import { readFile } from 'node:fs/promises';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const DEFAULT_BOOKINGS = 'Bookings';
const DEFAULT_CUSTOMERS = 'Customers';

function arg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) {
    throw new Error(`Missing ${name}`);
  }
  return process.argv[index + 1];
}

function encodeBase64Url(value) {
  const bytes = typeof value === 'string' ? Buffer.from(value, 'utf8') : Buffer.from(value);
  return bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodePrivateKey(pem) {
  const normalized = pem.replace(/\\n/g, '\n');
  const base64 = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  if (!base64) throw new Error('The Google private key is empty or invalid.');
  return Buffer.from(base64, 'base64');
}

async function createAssertion(email, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = encodeBase64Url(JSON.stringify({
    iss: email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    decodePrivateKey(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken),
  );
  return `${unsignedToken}.${encodeBase64Url(signature)}`;
}

async function getAccessToken(email, privateKey) {
  const assertion = await createAssertion(email, privateKey);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`OAuth failed ${response.status}: ${text}`);
  }
  const token = JSON.parse(text);
  if (!token.access_token) throw new Error('OAuth did not return an access token.');
  return token.access_token;
}

async function listSheets(spreadsheetId, accessToken) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties(sheetId,title)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Sheets metadata failed ${response.status}: ${text}`);
  }
  return JSON.parse(text);
}

function rowData(values) {
  return {
    values: values.map((value) => ({ userEnteredValue: { stringValue: value } })),
  };
}

async function appendProbeRows(spreadsheetId, accessToken, bookingsId, customersId) {
  const stamp = new Date().toISOString();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            appendCells: {
              sheetId: bookingsId,
              rows: [rowData([stamp, 'sheets-probe', '0500000000', 'أسنان', 'زراعة الأسنان', '/probe', 'ar'])],
              fields: 'userEnteredValue',
            },
          },
          {
            appendCells: {
              sheetId: customersId,
              rows: [rowData([stamp, 'sheets-probe', '0500000000'])],
              fields: 'userEnteredValue',
            },
          },
        ],
      }),
    },
  );
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Sheets append failed ${response.status}: ${text}`);
  }
  return stamp;
}

const jsonPath = arg('--json');
const spreadsheetId = arg('--sheet-id');
const credentials = JSON.parse(await readFile(jsonPath, 'utf8'));

const email = credentials.client_email;
const privateKey = credentials.private_key;
if (!email || !privateKey) {
  throw new Error('JSON is missing client_email or private_key.');
}

console.log(`Email: ${email}`);
console.log(`Sheet: ${spreadsheetId}`);
console.log('Getting access token...');
const accessToken = await getAccessToken(email, privateKey);
console.log('OAuth: ok');

const meta = await listSheets(spreadsheetId, accessToken);
const tabs = (meta.sheets ?? []).map((sheet) => sheet.properties).filter(Boolean);
console.log(`Spreadsheet title: ${meta.properties?.title ?? '(unknown)'}`);
console.log('Tabs:');
for (const tab of tabs) {
  console.log(`- ${tab.title} (sheetId=${tab.sheetId})`);
}

const bookings = tabs.find((tab) => tab.title === DEFAULT_BOOKINGS);
const customers = tabs.find((tab) => tab.title === DEFAULT_CUSTOMERS);
if (!bookings || !customers) {
  throw new Error(
    `Need tabs named "${DEFAULT_BOOKINGS}" and "${DEFAULT_CUSTOMERS}". Found: ${tabs.map((tab) => tab.title).join(', ') || '(none)'}`,
  );
}

console.log('Appending probe rows...');
const stamp = await appendProbeRows(spreadsheetId, accessToken, bookings.sheetId, customers.sheetId);
console.log(`Append: ok (${stamp})`);
console.log('RESULT=SUCCESS');
