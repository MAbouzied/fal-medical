import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

function readJsonc(relativePath: string): Record<string, unknown> {
  const raw = readFileSync(join(repoRoot, relativePath), 'utf8')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(raw) as Record<string, unknown>;
}

describe('Wrangler deploy config', () => {
  it('points Wrangler at the Astro Cloudflare Worker entry and dist assets', () => {
    const wrangler = readJsonc('wrangler.jsonc');
    const assets = wrangler.assets as Record<string, unknown>;
    const kv = wrangler.kv_namespaces as Array<{ binding: string }>;
    const images = wrangler.images as { binding: string };
    const cache = wrangler.cache as { enabled: boolean };
    const flags = wrangler.compatibility_flags as string[];
    const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
      scripts: Record<string, string>;
    };

    assert.equal(wrangler.main, '@astrojs/cloudflare/entrypoints/server');
    assert.equal(assets.binding, 'ASSETS');
    assert.equal(assets.directory, './dist');
    assert.equal(assets.not_found_handling, 'none');
    assert.equal(assets.run_worker_first, false);
    assert.equal(assets.html_handling, 'drop-trailing-slash');
    assert.ok(kv.some((item) => item.binding === 'SESSION'));
    assert.equal(images.binding, 'IMAGES');
    assert.equal(cache.enabled, true);
    assert.ok(flags.includes('nodejs_compat'));
    assert.ok(flags.includes('global_fetch_strictly_public'));
    assert.equal(existsSync(join(repoRoot, 'public/.assetsignore')), true);
    assert.match(pkg.scripts['preview:cf'] ?? '', /wrangler dev/);
    assert.match(pkg.scripts.deploy ?? '', /wrangler deploy/);
    assert.doesNotMatch(pkg.scripts['preview:cf'] ?? '', /dist\/server\/wrangler/);
    assert.doesNotMatch(pkg.scripts.deploy ?? '', /dist\/server\/wrangler/);
  });
});
