import { ADMIN_AUTH_DISABLED } from 'astro:env/server';
import { resolveAdminAuthBypass } from './admin-auth-bypass.ts';
import { adminApiError } from './http.ts';

export { resolveAdminAuthBypass } from './admin-auth-bypass.ts';

const requestedBypass = ADMIN_AUTH_DISABLED === true;
export const adminAuthBypassEnabled = resolveAdminAuthBypass(
  requestedBypass,
  import.meta.env.DEV,
);

if (requestedBypass && !import.meta.env.DEV) {
  console.error('ADMIN_AUTH_DISABLED was ignored outside development.');
}

/** Defense-in-depth for API handlers; middleware performs the live Sanity check. */
export function requireAdminApiAccess(locals: App.Locals): Response | null {
  if (adminAuthBypassEnabled) return null;
  if (!locals.user) return adminApiError('UNAUTHENTICATED');
  if (!locals.staffAccess) return adminApiError('FORBIDDEN');
  return null;
}
