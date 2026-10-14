/** Canonical production host. Indexing, robots, and sitemap allowlists use this. */
export const productionHost = 'falclinic.com';

/** Live public hostnames that may publish robots and sitemap. */
export const productionHosts = [
  productionHost,
  `www.${productionHost}`,
  'fal-ksa.com',
  'www.fal-ksa.com',
] as const;

export const siteOrigin = `https://${productionHost}`;

export function isProductionHost(host: string): boolean {
  return (productionHosts as readonly string[]).includes(host.toLowerCase());
}
