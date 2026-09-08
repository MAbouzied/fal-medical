import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';

async function readHeaderSource() {
  return readFile(new URL('./SiteHeader.astro', import.meta.url), 'utf8');
}

describe('site header Figma contact nav', () => {
  it('adds Contact Us next to Services in desktop and mobile nav', async () => {
    const header = await readHeaderSource();
    const english = await readFile(new URL('../../lib/i18n/content-en.ts', import.meta.url), 'utf8');
    const desktopNavStart = header.indexOf('aria-label={en ? \'Main navigation\'');
    const mobileNavStart = header.indexOf('data-mobile-nav');
    const desktopNav = header.slice(desktopNavStart, mobileNavStart);
    const mobileNav = header.slice(mobileNavStart);

    assert.match(english, /contact:\s*'Contact Us'/);
    assert.match(header, /contactHref = en \? '\/en\/contact' : '\/contact'/);
    assert.match(header, /تواصل معنا/);
    assert.match(header, /data-header-brand/);
    assert.match(desktopNav, /href=\{contactHref\}/);
    assert.match(desktopNav, /\{contactLabel\}/);
    assert.match(desktopNav, /data-nav="contact"/);
    assert.match(mobileNav, /href=\{contactHref\}/);
    assert.match(mobileNav, /\{contactLabel\}/);
    assert.match(mobileNav, /data-nav="contact"/);
    assert.doesNotMatch(desktopNav, /href=\{contactHref\}[\s\S]*href=\{servicesHref\}/);
  });

  it('sends department dropdown links to the services catalog with the matching tab', async () => {
    const header = await readHeaderSource();
    const catalog = await readFile(
      new URL('../services/ServicesCatalog.astro', import.meta.url),
      'utf8',
    );

    assert.match(header, /servicesCatalogPath\('كل الخدمات'/);
    assert.match(header, /servicesCatalogPath\(department/);
    assert.match(header, /href=\{item\.href\}/);
    assert.match(catalog, /serviceDepartmentFromSlug/);
    assert.match(catalog, /selectedDepartment/);
    assert.match(catalog, /departmentFromLocation/);
  });
});
