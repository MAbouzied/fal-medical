export const DEFAULT_ADMIN_IMAGE_IMPORT_HOSTS = 'cdn.sanity.io';
export const ADMIN_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const ADMIN_IMAGE_MAX_REDIRECTS = 3;

const IMAGE_MAGIC: ReadonlyArray<{ mime: string; match: (bytes: Uint8Array) => boolean }> = [
  {
    mime: 'image/jpeg',
    match: (bytes) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    mime: 'image/png',
    match: (bytes) =>
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a,
  },
  {
    mime: 'image/gif',
    match: (bytes) =>
      bytes.length >= 6 &&
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) &&
      bytes[5] === 0x61,
  },
  {
    mime: 'image/webp',
    match: (bytes) =>
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50,
  },
];

export function parseAdminImageImportHosts(raw: string | undefined): Set<string> {
  const source = (raw ?? DEFAULT_ADMIN_IMAGE_IMPORT_HOSTS).trim() || DEFAULT_ADMIN_IMAGE_IMPORT_HOSTS;
  return new Set(
    source
      .split(',')
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function assertSafeRemoteImageUrl(
  raw: string,
  allowedHosts: ReadonlySet<string>,
): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error('رابط الصورة غير صالح.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('يجب أن يبدأ رابط الصورة بـ https.');
  }
  if (url.username || url.password) {
    throw new Error('لا يمكن استخدام رابط يحتوي بيانات دخول.');
  }
  if (url.port && url.port !== '443') {
    throw new Error('لا يمكن استخدام منفذ مخصص لاستيراد الصور.');
  }
  if (!allowedHosts.has(url.hostname.toLowerCase())) {
    throw new Error('لا يمكن استيراد صورة من هذا المضيف.');
  }

  url.hash = '';
  return url;
}

export function detectImageMime(bytes: Uint8Array): string | null {
  for (const candidate of IMAGE_MAGIC) {
    if (candidate.match(bytes)) return candidate.mime;
  }
  return null;
}

export function assertImageMimeMatches(declaredMime: string, bytes: Uint8Array): string {
  const magic = detectImageMime(bytes);
  if (!magic) throw new Error('الرابط لا يشير إلى صورة مدعومة.');
  const normalized = declaredMime.split(';')[0].trim().toLowerCase();
  if (normalized && normalized !== magic) {
    throw new Error('نوع الصورة لا يطابق محتوى الملف.');
  }
  return magic;
}

/** Stream response body and stop above maxBytes. */
export async function readLimitedArrayBuffer(
  response: Response,
  maxBytes: number,
): Promise<ArrayBuffer> {
  const contentLength = Number(response.headers.get('content-length') || NaN);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error('حجم الصورة يجب ألا يتجاوز 10 ميجابايت.');
  }
  if (!response.body) {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > maxBytes) throw new Error('حجم الصورة يجب ألا يتجاوز 10 ميجابايت.');
    return bytes;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new Error('حجم الصورة يجب ألا يتجاوز 10 ميجابايت.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged.buffer;
}
