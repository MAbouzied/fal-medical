import {
  GOOGLE_BOOKINGS_SHEET_NAME,
  GOOGLE_CUSTOMERS_SHEET_NAME,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SHEET_ID,
} from 'astro:env/server';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

let cachedToken: { value: string; expiresAt: number } | undefined;
let cachedSheetIds: { spreadsheetId: string; bookings: number; customers: number } | undefined;

export class GoogleSheetsConfigurationError extends Error {}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
    && GOOGLE_PRIVATE_KEY?.trim()
    && GOOGLE_SHEET_ID?.trim(),
  );
}

function encodeBase64Url(value: string | ArrayBuffer): string {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodePrivateKey(pem: string): ArrayBuffer {
  const normalized = pem.replace(/\\n/g, '\n');
  const base64 = normalized
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');

  if (!base64) throw new GoogleSheetsConfigurationError('The Google private key is invalid.');

  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

async function createAssertion(email: string, privateKey: string): Promise<string> {
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

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const assertion = await createAssertion(email, privateKey);
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google OAuth returned ${response.status}: ${await response.text()}`);
  }

  const token = await response.json() as { access_token?: string; expires_in?: number };
  if (!token.access_token) throw new Error('Google OAuth did not return an access token.');

  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + (token.expires_in ?? 3600) * 1000,
  };
  return token.access_token;
}

async function getSheetIds(
  spreadsheetId: string,
  accessToken: string,
  bookingsSheetName: string,
  customersSheetName: string,
): Promise<{ bookings: number; customers: number }> {
  if (cachedSheetIds?.spreadsheetId === spreadsheetId) return cachedSheetIds;

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties(sheetId,title)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    throw new Error(`Google Sheets metadata returned ${response.status}: ${await response.text()}`);
  }

  const data = await response.json() as {
    sheets?: { properties?: { sheetId?: number; title?: string } }[];
  };
  const sheets = data.sheets?.map((sheet) => sheet.properties) ?? [];
  const bookings = sheets.find((sheet) => sheet?.title === bookingsSheetName)?.sheetId;
  const customers = sheets.find((sheet) => sheet?.title === customersSheetName)?.sheetId;

  if (bookings === undefined || customers === undefined) {
    throw new GoogleSheetsConfigurationError(
      `The spreadsheet must contain "${bookingsSheetName}" and "${customersSheetName}" tabs.`,
    );
  }

  cachedSheetIds = { spreadsheetId, bookings, customers };
  return cachedSheetIds;
}

const rowData = (values: string[]) => ({
  values: values.map((value) => ({ userEnteredValue: { stringValue: value } })),
});

export async function appendBookingAndCustomer(
  bookingValues: string[],
  customerValues: string[],
): Promise<void> {
  const email = GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = GOOGLE_PRIVATE_KEY?.trim();
  const spreadsheetId = GOOGLE_SHEET_ID?.trim();
  const bookingsSheetName = GOOGLE_BOOKINGS_SHEET_NAME?.trim() || 'Bookings';
  const customersSheetName = GOOGLE_CUSTOMERS_SHEET_NAME?.trim() || 'Customers';

  if (!email || !privateKey || !spreadsheetId) {
    throw new GoogleSheetsConfigurationError('Google Sheets environment variables are not configured.');
  }

  const accessToken = await getAccessToken(email, privateKey);
  const sheetIds = await getSheetIds(
    spreadsheetId,
    accessToken,
    bookingsSheetName,
    customersSheetName,
  );

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
              sheetId: sheetIds.bookings,
              rows: [rowData(bookingValues)],
              fields: 'userEnteredValue',
            },
          },
          {
            appendCells: {
              sheetId: sheetIds.customers,
              rows: [rowData(customerValues)],
              fields: 'userEnteredValue',
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Sheets batch update returned ${response.status}: ${await response.text()}`);
  }
}
