import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

const routesSource = await readFile(new URL('./routes.ts', import.meta.url), 'utf8');

describe('service detail routes', () => {
  it('registers each catalog service as an indexable bilingual pair', () => {
    assert.match(routesSource, /function buildServiceRoutePairs/);
    assert.match(routesSource, /clinicServices\.map/);
    assert.match(routesSource, /id: `service:\$\{service\.id\}`/);
    assert.match(routesSource, /ar: `\/services\/\$\{service\.id\}`/);
    assert.match(routesSource, /en: `\/en\/services\/\$\{service\.id\}`/);
    assert.doesNotMatch(routesSource, /return \[\];/);
  });
});

describe('form landing routes', () => {
  it('registers Arabic and English /form as a non-indexable pair', () => {
    assert.match(routesSource, /id:\s*'form'/);
    assert.match(routesSource, /ar:\s*'\/form'/);
    assert.match(routesSource, /en:\s*'\/en\/form'/);
    assert.match(
      routesSource,
      /id:\s*'form'[\s\S]*?indexable:\s*false[\s\S]*?inSitemap:\s*false/,
    );
  });
});
