import { isProductionHost } from '../../data/site.ts';

export function buildRobotsTxt(options: {
  indexable: boolean;
  host: string;
  sitemapUrl: string;
}): string {
  if (!options.indexable || !isProductionHost(options.host)) {
    return [
      'User-agent: *',
      'Disallow: /',
      '',
      '# Non-indexable or non-production host.',
      '',
    ].join('\n');
  }

  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Keep API and tooling out of discovery crawls when possible.',
    'Disallow: /api/',
    'Disallow: /admin',
    'Disallow: /login',
    '',
    `Sitemap: ${options.sitemapUrl}`,
    '',
  ].join('\n');
}
