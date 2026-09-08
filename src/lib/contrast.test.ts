import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { contrastRatio, meetsWcagAa } from './contrast.ts';

describe('WCAG contrast tokens', () => {
  it('badge teal text meets AA on mint and white', () => {
    assert.ok(meetsWcagAa('#087f76', '#ffffff'));
    assert.ok(meetsWcagAa('#087f76', '#f2fffe'));
    assert.ok(contrastRatio('#087f76', '#ffffff') >= 4.5);
  });

  it('white button text meets large-text AA on brand teal', () => {
    assert.ok(meetsWcagAa('#ffffff', '#12a394', true));
    assert.ok(contrastRatio('#ffffff', '#12a394') >= 3);
  });

  it('success text meets AA on white', () => {
    assert.ok(meetsWcagAa('#087f76', '#ffffff'));
  });

  it('placeholder meets AA on white', () => {
    assert.ok(meetsWcagAa('#686161', '#ffffff'));
  });

  it('muted text meets AA on white', () => {
    assert.ok(meetsWcagAa('#38445b', '#ffffff'));
    assert.ok(meetsWcagAa('#626873', '#ffffff'));
  });

  it('footer muted text meets AA on navy', () => {
    assert.ok(meetsWcagAa('#a8b0be', '#10182d'));
  });

  it('white heading text meets AA on navy consult band', () => {
    assert.ok(meetsWcagAa('#ffffff', '#10182d'));
    assert.ok(meetsWcagAa('#faf9f6', '#10182d'));
  });

  it('icon accent meets AA on navy', () => {
    assert.ok(meetsWcagAa('#68c9bf', '#10182d'));
  });
});
