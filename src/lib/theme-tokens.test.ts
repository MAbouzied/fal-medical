import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

describe('Fal Figma theme tokens', () => {
  it('replaces Beauty Corner cream/navy leftovers with the services-frame tokens', async () => {
    const css = await readFile(new URL('../styles/global.css', import.meta.url), 'utf8');

    assert.match(css, /--color-surface:\s*#ffffff/);
    assert.match(css, /--color-surface-accent:\s*#f2fffe/);
    assert.match(css, /--color-surface-soft:\s*#ffffff/);
    assert.match(css, /--color-ink:\s*#10182d/);
    assert.match(css, /--color-muted:\s*#38445b/);
    assert.match(css, /--color-muted-soft:\s*#626873/);
    assert.match(css, /--color-placeholder:\s*#686161/);
    assert.match(css, /--color-primary:\s*#12a394/);
    assert.match(css, /--color-border:\s*#eae3e2/);
    assert.match(css, /--color-success:\s*#087f76/);
    assert.match(css, /--color-gold-text:\s*#087f76/);
    assert.match(css, /--color-gold:\s*#12a394/);
    assert.match(css, /--color-footer:\s*#10182d/);
    assert.match(css, /--color-on-dark:\s*#faf9f6/);
    assert.match(css, /--color-icon-accent:\s*#68c9bf/);
    assert.match(css, /--radius-button:\s*0\.5rem/);
    assert.match(css, /--radius-control:\s*1\.25rem/);
    assert.match(css, /--radius-card:\s*1\.5rem/);
    assert.match(css, /--radius-section:\s*2rem/);
    assert.match(css, /--shadow-card:\s*0 20px 60px/);

    assert.doesNotMatch(css, /--color-surface-soft:\s*#fcfaf6/);
    assert.doesNotMatch(css, /--color-footer:\s*#0c1428/);
    assert.doesNotMatch(css, /--color-ink:\s*#101828/);
  });
});
