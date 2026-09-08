/** Bypass admin auth only when explicitly requested in local development. */
export function resolveAdminAuthBypass(
  requested: boolean,
  isDevelopment: boolean,
): boolean {
  return requested === true && isDevelopment;
}
