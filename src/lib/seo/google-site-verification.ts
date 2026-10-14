/** Google Search Console HTML-file token. The `.html` suffix is required. */
export const GOOGLE_SITE_VERIFICATION_FILE = 'googleb1cfedf0fc1535b8.html';

export const GOOGLE_SITE_VERIFICATION_PATH = `/${GOOGLE_SITE_VERIFICATION_FILE}`;

const EXTENSIONLESS_PATH = GOOGLE_SITE_VERIFICATION_PATH.replace(/\.html$/, '');

export const GOOGLE_SITE_VERIFICATION_BODY = `google-site-verification: ${GOOGLE_SITE_VERIFICATION_FILE}\n`;

/**
 * Cloudflare `html_handling: drop-trailing-slash` redirects `*.html` to the
 * extensionless path. Search Console requires the `.html` URL to return 200.
 * Requests without the suffix are sent back to the `.html` path.
 */
export function googleSiteVerificationResponse(pathname: string): Response | null {
  if (pathname === EXTENSIONLESS_PATH || pathname === `${EXTENSIONLESS_PATH}/`) {
    return new Response(null, {
      status: 301,
      headers: {
        Location: GOOGLE_SITE_VERIFICATION_PATH,
        'Cache-Control': 'no-store',
      },
    });
  }

  if (pathname === GOOGLE_SITE_VERIFICATION_PATH) {
    return new Response(GOOGLE_SITE_VERIFICATION_BODY, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  return null;
}
