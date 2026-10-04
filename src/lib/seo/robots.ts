import { isProductionHost } from '../../data/site.ts';

const PRIVATE_PREFIXES = ['/api/', '/admin', '/login', '/form', '/en/form'] as const;

export function buildRobotsTxt(options: {
  indexable: boolean;
  host: string;
  sitemapUrl: string;
}): string {
  if (!options.indexable || !isProductionHost(options.host)) {
    return [
      'User-agent: facebookexternalhit',
      'User-agent: Facebot',
      'User-agent: WhatsApp',
      'Allow: /',
      '',
      'User-agent: *',
      'Disallow: /',
      '',
      '# Non-indexable or non-production host. Link-preview bots may still read pages.',
      '',
    ].join('\n');
  }

  const hostUrl = new URL(options.sitemapUrl).origin;
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Keep private and conversion-tooling paths out of discovery crawls.',
    ...PRIVATE_PREFIXES.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${options.sitemapUrl}`,
    `Host: ${hostUrl}`,
    '',
  ].join('\n');
}
