import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { clinicFacts } from './clinic-facts.ts';
import { resolveLandingPage } from './landing.ts';

const invented = [
  '٢٬٩٠٠',
  '٤٬٢٠٠',
  '2900',
  '4200',
  'تأسست ٢٠١٢',
  '2012',
  'الياسمين',
  'Yasmin',
  'ابدئي',
  'املئي',
  'اعرفي',
  'لكِ',
  'معكِ',
  'موعدكِ',
  'موافقتكِ',
  'راحتكِ',
  'خصوصيتكِ',
  'بقربكِ',
  'وجهكِ',
  'سنّكِ',
  'ترين',
  'تعرفين',
  'تفصلكِ',
  'رحلتكِ',
];

async function readLandingSources() {
  const files = [
    '../components/landing/LandingHero.astro',
    '../components/landing/LandingAbout.astro',
    '../components/landing/LandingSpecialties.astro',
    '../components/landing/LandingFeatured.astro',
    '../components/landing/LandingOffer.astro',
    '../components/landing/LandingSteps.astro',
    '../components/landing/LandingSections.astro',
    '../components/site/SiteHeader.astro',
    '../pages/index.astro',
    '../pages/en/index.astro',
    '../../astro.config.mjs',
  ];
  const contents = await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), 'utf8')),
  );
  return Object.fromEntries(files.map((file, index) => [file, contents[index] ?? '']));
}

describe('landing Figma content', () => {
  it('uses the captured hero, about, specialties, and journey copy', () => {
    const ar = resolveLandingPage('ar');
    const en = resolveLandingPage('en');

    assert.equal(ar.hero.badge, 'عروض الصيف');
    assert.equal(ar.hero.headline, `أفضل عيادة للأسنان والجلدية في ${clinicFacts.cityAr}`);
    assert.equal(ar.hero.titleAccent, 'فال');
    assert.match(ar.hero.titleBefore, /خلّ نهاية سنتك جمال/);
    assert.match(ar.hero.text, /خدمات الأسنان والجلدية والليزر/);
    assert.equal(ar.hero.cta, 'احجز استشارتك الآن');
    assert.match(ar.hero.quote, /نصمم ابتسامات وإطلالات طبيعية تمنحك ثقة تدوم/);

    assert.equal(ar.about.eyebrow, 'من نحن');
    assert.equal(ar.about.title, 'فال تقدم تجربة كاملة');
    assert.match(ar.about.intro, /تبدأ بالاستماع لك وتنتهي بابتسامة/);
    assert.deepEqual(
      ar.about.features.map((item) => item.title),
      ['تشخيص رقمي', 'فريق متخصص', 'مساحة آمنة', 'متابعة بعد العلاج'],
    );
    assert.ok(ar.about.photoBadge.includes(clinicFacts.districtAr));
    assert.doesNotMatch(ar.about.photoBadge, /٢٠١٢|2012/);

    assert.equal(ar.specialties.eyebrow, 'تخصصاتنا');
    assert.equal(ar.specialties.title, 'خدمات مصمّمة لإطلالة مميزة');
    assert.equal(ar.specialties.more, 'اعرف المزيد');
    assert.deepEqual(
      ar.specialties.items.map((item) => item.id),
      ['dentistry', 'skin', 'laser'],
    );

    assert.equal(ar.featured.eyebrow, 'الأكثر طلباً');
    assert.equal(ar.featured.title, 'ابتسامة بلمسة طبيعية');
    assert.match(ar.featured.serviceHref, /\/services\/dental-veneers/);

    assert.equal(ar.offer.eyebrow, 'عرض الموسم');
    assert.equal(ar.offer.title, 'باقة لابتسامة متكاملة');
    assert.equal(ar.offer.items.length, 4);

    assert.equal(ar.steps.eyebrow, 'رحلتك معنا');
    assert.equal(ar.steps.title, 'أربع خطوات تفصلك عن ابتسامة جديدة');
    assert.deepEqual(
      ar.steps.items.map((item) => item.title),
      ['الحجز', 'الفحص', 'الخطة', 'النتيجة'],
    );

    assert.equal(en.hero.titleAccent, 'Fal');
    assert.equal(
      en.hero.headline,
      `The best dentistry and dermatology clinic in ${clinicFacts.cityEn}`,
    );
    assert.equal(en.specialties.more, 'Learn more');
    assert.equal(en.about.photoBadge.includes(clinicFacts.districtEn), true);
  });

  it('does not invent prices, founding years, or feminine Beauty Corner copy', () => {
    const ar = JSON.stringify(resolveLandingPage('ar'));
    const en = JSON.stringify(resolveLandingPage('en'));
    for (const value of invented) {
      assert.equal(ar.includes(value), false, `Arabic landing data still has "${value}"`);
      assert.equal(en.includes(value), false, `English landing data still has "${value}"`);
    }
  });
});

describe('landing Figma layout', () => {
  it('restyles home to the captured landing frame and reuses shared Fal UI', async () => {
    const sources = await readLandingSources();
    const hero = sources['../components/landing/LandingHero.astro'] ?? '';
    const about = sources['../components/landing/LandingAbout.astro'] ?? '';
    const specialties = sources['../components/landing/LandingSpecialties.astro'] ?? '';
    const featured = sources['../components/landing/LandingFeatured.astro'] ?? '';
    const offer = sources['../components/landing/LandingOffer.astro'] ?? '';
    const steps = sources['../components/landing/LandingSteps.astro'] ?? '';
    const sections = sources['../components/landing/LandingSections.astro'] ?? '';
    const header = sources['../components/site/SiteHeader.astro'] ?? '';
    const astroConfig = sources['../../astro.config.mjs'] ?? '';
    const arRoute = sources['../pages/index.astro'] ?? '';
    const enRoute = sources['../pages/en/index.astro'] ?? '';

    assert.match(hero, /resolveLandingPage/);
    assert.match(hero, /quoteIconSrc/);
    assert.match(hero, /PillLabel/);
    assert.match(hero, /ButtonLink/);
    assert.match(hero, /page\.hero\.headline/);
    assert.match(hero, /page\.hero\.titleBefore/);
    assert.match(hero, /rounded-\[var\(--radius-card\)\]/);
    assert.match(hero, /from-surface-accent/);

    assert.match(about, /id="about"/);
    assert.match(about, /✦/);
    assert.match(about, /photoBadge/);
    assert.match(about, /bg-on-dark/);
    assert.match(about, /lg:col-start-2/);
    assert.match(about, /lg:col-start-1 lg:row-start-1/);
    assert.doesNotMatch(about, /تأسست ٢٠١٢/);

    assert.match(specialties, /id="services"/);
    assert.match(specialties, /bg-footer/);
    assert.match(specialties, /text-icon-accent/);
    assert.match(specialties, /<li>\s*<a\s+href=\{item\.href\}/);
    assert.match(specialties, /specialties\.more/);
    assert.match(specialties, /h-\[15\.0625rem\]/);
    assert.doesNotMatch(specialties, /<article/);
    assert.doesNotMatch(specialties, /specialty-photo absolute inset-0/);

    assert.match(featured, /bg-footer/);
    assert.match(featured, /rounded-\[var\(--radius-section\)\]/);
    assert.match(featured, /lg:col-start-2/);
    assert.match(featured, /lg:col-start-1 lg:row-start-1/);
    assert.doesNotMatch(featured, /تفاصيل عدسات|View veneers/);

    assert.match(offer, /id="season-offer"/);
    assert.match(offer, /offer\.imageSrc/);
    assert.doesNotMatch(offer, /٢٬٩٠٠|٤٬٢٠٠|2900|4200/);

    assert.match(steps, /size-16/);
    assert.match(steps, /text-gold-text/);

    assert.match(
      sections,
      /LandingAbout[\s\S]*LandingSpecialties[\s\S]*LandingFeatured[\s\S]*LandingOffer[\s\S]*LandingSteps[\s\S]*ServicesConsultBand[\s\S]*FaqSection/,
    );
    assert.doesNotMatch(sections, /DevicesSection/);
    assert.match(sections, /variant="list"/);
    assert.match(sections, /id="contact"/);
    assert.doesNotMatch(sections, /<iframe/);
    assert.doesNotMatch(sections, /DoctorCard/);
    assert.doesNotMatch(sections, /ClinicGallerySlider/);
    assert.doesNotMatch(sections, /ServiceDepartmentTabs/);

    assert.doesNotMatch(header, /#devices/);
    assert.doesNotMatch(header, /الأجهزة/);
    assert.doesNotMatch(header, /nav\.devices/);

    assert.doesNotMatch(astroConfig, /#devices/);
    assert.doesNotMatch(astroConfig, /destination:\s*'\/#services'/);
    assert.doesNotMatch(astroConfig, /destination:\s*'\/en#services'/);

    assert.match(arRoute, /LandingHero/);
    assert.match(arRoute, /LandingSections/);
    assert.match(enRoute, /LandingHero/);
    assert.match(enRoute, /LandingSections/);
    assert.doesNotMatch(enRoute, /ServiceDepartmentTabs/);
  });
});
