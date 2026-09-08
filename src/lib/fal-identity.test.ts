import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { doctors } from '../data/doctors.ts';
import { getFormLandingCopy } from '../data/form-landing.ts';
import { mockBlogPosts } from '../modules/blog/content/mock-posts.ts';
import { doctorsEn } from './i18n/content-en.ts';
import { resolveLegacyRedirect } from './seo/legacy-redirects.ts';

const srcRoot = fileURLToPath(new URL('..', import.meta.url));

const BEAUTY_CORNER_PINK = /#fff9f8|#fff8f9|#ffeff2|#bd5d7c|#ba5674|#f4b6c6|#e99fb3|#d9829b|#b85676|#ad5472|#a74667|#a94c6c|#f4d4dd|#fff6f7|#fff0f4/i;

const BEAUTY_CORNER_IDENTITY =
  /BeautyCorner|dentistry-fatima|dentistry-wissam|dermatology-hala|Fatima Nidal|Wissam Mandour|Hala Al-Badawy|فاطمة نضال|وسام مندور|هالة البدوي|doctor-hala|doctor-wissam/i;

async function readSrc(relativePath: string): Promise<string> {
  return readFile(new URL(relativePath, import.meta.url), 'utf8');
}

describe('Fal identity without Beauty Corner leftovers', () => {
  it('uses Fal Clinic doctor identities, not Beauty Corner names', () => {
    assert.deepEqual(
      doctors.map((doctor) => doctor.id),
      ['mohamed-tahhan', 'nibraj', 'hanan-helal'],
    );
    assert.deepEqual(Object.keys(doctorsEn).sort(), ['hanan-helal', 'mohamed-tahhan', 'nibraj']);
    assert.equal(doctors.every((doctor) => !/fatima|wissam|hala/i.test(doctor.id)), true);
    assert.equal(
      doctors.every((doctor) => !/doctor-hala|doctor-wissam/i.test(doctor.image)),
      true,
    );
    const serialized = `${JSON.stringify(doctors)}\n${JSON.stringify(doctorsEn)}`;
    assert.doesNotMatch(serialized, BEAUTY_CORNER_IDENTITY);
  });

  it('does not keep Beauty Corner device brand names in public copy', async () => {
    const english = await readSrc('./i18n/content-en.ts');
    const devices = await readSrc('../data/devices.ts');
    assert.doesNotMatch(english, /Beyond Polus|Woodpecker PT-B|CuRAS|Préime|NuEra|Splendor/i);
    assert.doesNotMatch(devices, /Beyond Polus|Woodpecker PT-B|CuRAS|Préime/i);
  });

  it('redirects old Beauty Corner doctor urls to Fal doctor profiles', () => {
    assert.equal(resolveLegacyRedirect('/doctors/dentistry-fatima'), '/doctors/mohamed-tahhan');
    assert.equal(resolveLegacyRedirect('/doctors/dentistry-wissam'), '/doctors/nibraj');
    assert.equal(resolveLegacyRedirect('/doctors/dermatology-hala'), '/doctors/hanan-helal');
    assert.equal(resolveLegacyRedirect('/en/doctors/dentistry-fatima'), '/en/doctors/mohamed-tahhan');
    assert.equal(resolveLegacyRedirect('/en/doctors/dentistry-wissam'), '/en/doctors/nibraj');
    assert.equal(resolveLegacyRedirect('/en/doctors/dermatology-hala'), '/en/doctors/hanan-helal');
    assert.equal(resolveLegacyRedirect('/doctors/dentistry'), '/doctors/mohamed-tahhan');
    assert.equal(resolveLegacyRedirect('/en/doctors/oral-surgery'), '/en/doctors/nibraj');
    assert.equal(resolveLegacyRedirect('/doctors/hanan-helal'), null);
  });

  it('does not keep Beauty Corner hafr-albatin slugs or editor namespace', async () => {
    const slugs = mockBlogPosts.flatMap((post) => [post.slug, ...(post.relatedSlugs ?? [])]);
    assert.equal(slugs.some((slug) => slug.includes('hafr-albatin')), false);
    assert.ok(slugs.includes('dalil-tabyid-alasnan-riyadh'));
    const editor = await readSrc('../components/admin/BlogEditorApp.tsx');
    assert.match(editor, /namespace:\s*'FalClinicBlog'/);
    assert.doesNotMatch(editor, /BeautyCornerBlog/);
  });

  it('styles admin, public blog, and login with Fal tokens instead of pink hex', async () => {
    const files = [
      '../components/admin/AdminShell.astro',
      '../components/admin/StaffUsers.astro',
      '../pages/admin/create.astro',
      '../pages/login.astro',
      '../modules/blog/styles/blog.css',
      '../modules/blog/components/BlogArticle.astro',
    ];
    for (const file of files) {
      const source = await readSrc(file);
      assert.doesNotMatch(source, BEAUTY_CORNER_PINK, file);
      assert.doesNotMatch(source, /blush\/pink|pink primary|pink, blush/i, file);
    }
    const blogCss = await readSrc('../modules/blog/styles/blog.css');
    assert.match(blogCss, /--blog-surface-soft:\s*var\(--color-surface-soft,\s*#ffffff\)/);
    assert.match(blogCss, /--blog-surface-accent:\s*var\(--color-surface-accent,\s*#f2fffe\)/);
    assert.match(blogCss, /--blog-text:\s*var\(--color-ink,\s*#10182d\)/);
    assert.match(blogCss, /border-radius:\s*var\(--radius-button\)/);
  });

  it('keeps the admin dashboard, public blog, and /form surfaces', async () => {
    const required = [
      `${srcRoot}/pages/admin/index.astro`,
      `${srcRoot}/pages/admin/create.astro`,
      `${srcRoot}/pages/admin/users.astro`,
      `${srcRoot}/pages/admin/[id]/edit.astro`,
      `${srcRoot}/pages/admin/[id]/preview.astro`,
      `${srcRoot}/pages/blogs.astro`,
      `${srcRoot}/pages/blogs/[slug].astro`,
      `${srcRoot}/pages/form.astro`,
      `${srcRoot}/pages/en/form.astro`,
      `${srcRoot}/pages/login.astro`,
    ];
    for (const file of required) {
      assert.equal(existsSync(file), true, file);
    }
    const routes = await readSrc('./i18n/routes.ts');
    assert.match(routes, /id:\s*'form'/);
    assert.match(routes, /id:\s*'blogs'/);
  });

  it('describes a single Hafar Al Batin clinic on /form, with Fal button radius', async () => {
    const ar = getFormLandingCopy('ar');
    const en = getFormLandingCopy('en');
    assert.match(ar.pageTitle, /فال/);
    assert.match(en.pageTitle, /Fal/);
    assert.doesNotMatch(ar.branchesHeading, /أقرب فرع/);
    assert.doesNotMatch(en.branchesHeading, /nearest branch/i);
    assert.match(ar.branchesHeading, /عيادت/);
    const form = await readSrc('../components/contact/FormLandingPage.astro');
    assert.match(form, /rounded-\[var\(--radius-button\)\]/);
    assert.doesNotMatch(form, /rounded-full/);
  });

  it('does not publish Beauty Corner identity copy or the dummy F logo', async () => {
    const services = await readSrc('../data/services.ts');
    const logo = await readSrc('../components/site/BrandLogo.astro');
    const dummy = await readFile(new URL('../../public/assets/logo.svg', import.meta.url), 'utf8').catch(
      () => '',
    );
    assert.match(services, /filler-botox|hydrafacial|body-contouring/);
    assert.doesNotMatch(services, BEAUTY_CORNER_IDENTITY);
    assert.doesNotMatch(services, /بيوتي كورنر/);
    assert.match(logo, /\/assets\/logo\.png/);
    assert.doesNotMatch(logo, /logo\.svg/);
    assert.doesNotMatch(dummy, /M14 31V11h12\.2/);
  });
});
