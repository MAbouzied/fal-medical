/** Exact same-origin Origin plus Fetch Metadata cross-site rejection. */
export function isAllowedCustomerOrigin(
  requestOrigin: string | null,
  requestUrlOrigin: string,
  fetchSite: string | null,
): boolean {
  if (requestOrigin !== requestUrlOrigin) return false;
  if (fetchSite === 'cross-site') return false;
  return true;
}
