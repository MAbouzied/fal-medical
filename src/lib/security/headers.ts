const FRAME_ANCESTORS_NONE = "frame-ancestors 'none'";

/**
 * Keep an existing CSP (e.g. Astro hashed policy) and only add
 * frame-ancestors when the directive is missing.
 */
export function mergeContentSecurityPolicy(existing: string | null): string {
  const current = existing?.trim() ?? '';
  if (!current) return FRAME_ANCESTORS_NONE;
  if (/(?:^|;)\s*frame-ancestors\b/i.test(current)) return current;
  return `${current.replace(/;?\s*$/, '')}; ${FRAME_ANCESTORS_NONE}`;
}

/** Apply baseline security headers to Worker/SSR responses. */
export function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );
  headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  headers.set(
    'Content-Security-Policy',
    mergeContentSecurityPolicy(headers.get('Content-Security-Policy')),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function withPrivateSecurityHeaders(response: Response): Response {
  const secured = withSecurityHeaders(response);
  const headers = new Headers(secured.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(secured.body, {
    status: secured.status,
    statusText: secured.statusText,
    headers,
  });
}
