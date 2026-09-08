/** Canonical production host. Indexing, robots, and sitemap allowlists use this. */
export const productionHost = 'falclinic.com';

export const productionHosts = [productionHost, `www.${productionHost}`] as const;

export const siteOrigin = `https://${productionHost}`;

export function isProductionHost(host: string): boolean {
  return (productionHosts as readonly string[]).includes(host.toLowerCase());
}
