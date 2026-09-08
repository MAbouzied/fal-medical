import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { clinicServices } from './services.ts';
import {
  resolveServiceFeatureBlocks,
  serviceFeatureBlocks,
} from './service-features.ts';

const featureImages = [
  '/assets/services/dentistry.jpg',
  '/assets/services/dermatology.jpg',
  '/assets/services/laser.jpg',
];

describe('service feature blocks', () => {
  it('keeps the Figma specialty rows as overview copy above the Beauty Corner catalog', () => {
    assert.deepEqual(
      serviceFeatureBlocks.map((block) => block.id),
      ['dentistry', 'skin', 'laser'],
    );
    assert.ok(clinicServices.some((service) => service.id === 'dental-implants'));
    assert.ok(clinicServices.some((service) => service.id === 'hydrafacial'));
    assert.equal(clinicServices.some((service) => service.id === 'dentistry'), false);

    for (const block of serviceFeatureBlocks) {
      assert.ok(block.bulletsAr.length >= 2, `${block.id} needs Figma bullets`);
      assert.equal(block.bulletsAr.length, block.bulletsEn.length);
      assert.ok(featureImages.includes(block.imageSrc), `unexpected feature image: ${block.imageSrc}`);
    }

    assert.deepEqual(serviceFeatureBlocks[0]?.bulletsAr, [
      'تبييض الاسنان بالليزر',
      'زراعة الاسنان الفورية',
      'تقويم الاسنان الشفاف',
    ]);
    assert.deepEqual(serviceFeatureBlocks[1]?.bulletsAr, [
      'تنظيف البشرة العميق (هايدرافيشيل)',
      'علاج التصبغات وآثار الحبوب',
    ]);
    assert.deepEqual(serviceFeatureBlocks[2]?.bulletsAr, [
      'جلسات آمنة للبشرة الحساسة',
      'علاج الشعر تحت الجلد',
    ]);
  });

  it('localizes Figma specialty copy without inventing clinic service pages', () => {
    const ar = resolveServiceFeatureBlocks('ar');
    const en = resolveServiceFeatureBlocks('en');

    assert.equal(ar[0]?.badge, 'طب الأسنان');
    assert.equal(ar[0]?.title, 'ابتسامة تغيّر كل شيء');
    assert.match(ar[0]?.text ?? '', /التبييض الفوري/);
    assert.equal(ar[1]?.badge, 'الجلدية والتجميل');
    assert.equal(ar[1]?.title, 'نضارة تدوم بلمسات احترافية');
    assert.match(ar[1]?.text ?? '', /التقنيات الحديثة/);
    assert.equal(ar[2]?.badge, 'الليزر');
    assert.equal(ar[2]?.title, 'نعومة تدوم وراحة أكبر');
    assert.match(ar[2]?.text ?? '', /ليزر مبرّدة/);

    assert.equal(en[0]?.badge, 'Dentistry');
    assert.equal(en[1]?.badge, 'Dermatology & aesthetics');
    assert.equal(en[2]?.badge, 'Laser');

    assert.equal(ar[0]?.imageStart, false);
    assert.equal(ar[1]?.imageStart, true);
    assert.equal(ar[2]?.imageStart, false);

    assert.deepEqual(ar[0]?.bullets, serviceFeatureBlocks[0]?.bulletsAr);
    assert.equal(en[0]?.bullets[0], 'Laser teeth whitening');
    assert.ok(ar.every((block) => featureImages.includes(block.imageSrc)));
  });
});

describe('services page Figma layout', () => {
  it('matches the Services frame: three specialty rows, catalog, consult, and FAQ', async () => {
    const page = await readFile(
      new URL('../components/services/ServicesPage.astro', import.meta.url),
      'utf8',
    );
    const consult = await readFile(
      new URL('../components/services/ServicesConsultBand.astro', import.meta.url),
      'utf8',
    );
    const row = await readFile(
      new URL('../components/services/ServiceFeatureRow.astro', import.meta.url),
      'utf8',
    );
    const header = await readFile(
      new URL('../components/site/SiteHeader.astro', import.meta.url),
      'utf8',
    );
    const footer = await readFile(
      new URL('../components/site/SiteFooter.astro', import.meta.url),
      'utf8',
    );
    const logo = await readFile(
      new URL('../components/site/BrandLogo.astro', import.meta.url),
      'utf8',
    );
    const dummyLogo = await readFile(new URL('../../public/assets/logo.svg', import.meta.url), 'utf8').catch(
      () => '',
    );
    const form = await readFile(
      new URL('../components/contact/ContactInquiryForm.astro', import.meta.url),
      'utf8',
    );
    const faq = await readFile(
      new URL('../components/sections/FaqSection.astro', import.meta.url),
      'utf8',
    );
    const pill = await readFile(
      new URL('../components/ui/PillLabel.astro', import.meta.url),
      'utf8',
    );
    const button = await readFile(
      new URL('../components/ui/ButtonLink.astro', import.meta.url),
      'utf8',
    );
    const arRoute = await readFile(new URL('../pages/services.astro', import.meta.url), 'utf8');
    const enRoute = await readFile(
      new URL('../pages/en/services/index.astro', import.meta.url),
      'utf8',
    );

    assert.match(page, /تخصصاتنا/);
    assert.match(page, /خدمات مصمّمة لإطلالة مميزة/);
    assert.match(page, /من تفاصيل الابتسامة/);
    assert.match(page, /إجابات على أهم استفساراتك/);
    assert.match(page, /ServicesConsultBand/);
    assert.match(page, /ServiceFeatureRow/);
    assert.match(page, /ServicesCatalog/);
    assert.doesNotMatch(page, /showEyebrow=\{false\}/);
    assert.doesNotMatch(page, /BookingSection/);
    assert.doesNotMatch(page, /DoctorCard/);

    assert.match(consult, /احجز استشارتك المجانية/);
    assert.match(consult, /تأكيد الحجز/);
    assert.match(consult, /ابدأ الآن/);
    assert.match(consult, /املأ النموذج/);
    assert.match(consult, /اتصال مباشر/);
    assert.match(consult, /border-white\/15/);
    assert.match(consult, /ContactInquiryForm/);
    assert.match(consult, /rounded-\[var\(--radius-section\)\]/);

    assert.match(row, /✦/);
    assert.match(row, /rounded-\[var\(--radius-section\)\]/);
    assert.match(row, /shadow-\[var\(--shadow-card\)\]/);
    assert.match(row, /text-muted-soft/);
    assert.match(row, /h-\[27\.1875rem\]/);
    assert.match(row, /max-w-\[30\.0625rem\]/);
    assert.doesNotMatch(row, /\/services\/\$\{/);
    assert.doesNotMatch(row, /serviceHref/);

    assert.doesNotMatch(header, /تغذية/);
    assert.doesNotMatch(header, /نساء وولادة/);
    assert.doesNotMatch(header, /علاج طبيعي/);
    assert.match(header, /servicesCatalogPath/);
    assert.match(header, /department/);

    assert.match(footer, /teeth-whitening/);
    assert.match(footer, /filler-botox/);
    assert.match(footer, /\/services\/laser/);

    assert.match(logo, /\/assets\/logo\.png/);
    assert.doesNotMatch(logo, /logo\.svg/);
    assert.doesNotMatch(dummyLogo, /M14 31V11h12\.2/);

    assert.match(form, /submitLabel/);
    assert.match(form, /rounded-\[var\(--radius-button\)\]/);
    assert.match(form, /text-xs font-bold/);

    assert.match(faq, /variant/);
    assert.match(faq, /chevron-down/);
    assert.match(faq, /rounded-\[1\.625rem\]/);

    assert.match(pill, /uppercase/);
    assert.match(pill, /tracking-\[0\.05em\]/);
    assert.match(pill, /bg-surface-accent/);

    assert.match(button, /radius-button/);

    assert.match(arRoute, /ServicesPage/);
    assert.match(enRoute, /ServicesPage/);
    assert.match(arRoute, /\/services\/\$\{service\.id\}/);
    assert.match(enRoute, /\/en\/services\/\$\{service\.id\}/);
  });
});
