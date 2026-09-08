import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { clinicServices } from './services.ts';
import {
  acceptedLeadDepartments,
  getFormLandingCopy,
  getFormServiceGroups,
  OTHER_FORM_SERVICE,
} from './form-landing.ts';
import { bookingDepartments } from './booking-departments.ts';

describe('form landing copy', () => {
  it('keeps the landing bilingual without chrome or WhatsApp CTA copy', () => {
    const ar = getFormLandingCopy('ar');
    const en = getFormLandingCopy('en');

    assert.equal(ar.formHref, '/form');
    assert.equal(en.formHref, '/en/form');
    assert.equal(ar.submit, 'أرسل الآن');
    assert.equal(en.submit, 'Send now');
    assert.doesNotMatch(ar.submit, /واتساب|WhatsApp/i);
    assert.doesNotMatch(en.submit, /واتساب|WhatsApp/i);
    assert.doesNotMatch(ar.pageTitle, /نجم/);
    assert.match(ar.pageTitle, /فال/);
    assert.equal(ar.specialty, 'التخصص');
    assert.equal(en.specialty, 'Specialty');
    assert.equal(ar.callAction, 'اتصال');
    assert.equal(ar.locationAction, 'الموقع');
    assert.doesNotMatch(ar.branchesHeading, /أقرب فرع/);
    assert.doesNotMatch(en.branchesHeading, /nearest branch/i);
  });

  it('groups services from the services page by department', () => {
    const arGroups = getFormServiceGroups('ar');
    const enGroups = getFormServiceGroups('en');
    const ar = getFormLandingCopy('ar');
    const en = getFormLandingCopy('en');

    assert.deepEqual(arGroups.map((group) => group.department), [
      'أسنان',
      'جلدية',
      'تغذية',
      'نساء وولادة',
      'علاج طبيعي',
    ]);
    assert.equal(arGroups[0]?.label, 'أسنان');
    assert.equal(enGroups[0]?.label, 'Dentistry');
    assert.equal(enGroups[1]?.label, 'Dermatology');
    assert.equal(enGroups[2]?.label, 'Nutrition');

    const arValues = arGroups.flatMap((group) => group.services.map((service) => service.value));
    const serviceTitles = clinicServices.map((service) => service.title);
    const expectedValues = [
      ...serviceTitles,
      OTHER_FORM_SERVICE,
      OTHER_FORM_SERVICE,
      OTHER_FORM_SERVICE,
      OTHER_FORM_SERVICE,
      OTHER_FORM_SERVICE,
    ];
    assert.deepEqual([...arValues].sort(), [...expectedValues].sort());
    assert.equal(ar.departments.length, clinicServices.length + 5);
    assert.ok(arGroups.every((group) => group.services.at(-1)?.value === OTHER_FORM_SERVICE));
    assert.equal(arGroups[0]?.services.at(-1)?.label, 'خدمات أخرى');
    assert.equal(enGroups[0]?.services.at(-1)?.label, 'Other services');
    assert.notEqual(en.departments[0]?.label, en.departments[0]?.value);
    assert.ok(acceptedLeadDepartments.includes('أسنان'));
    assert.ok(acceptedLeadDepartments.includes(bookingDepartments[0]));
    assert.ok(acceptedLeadDepartments.includes(clinicServices[0]!.title));
    assert.equal(arValues.includes('الفيلر والبوتوكس'), true);
    assert.equal(arValues.includes('النحت'), true);
    assert.equal(arValues.includes('تنظيف البشرة الهيدرافيشل'), true);
  });

  it('posts landing leads to the customers API without home chrome or extra message', async () => {
    const source = await readFile(
      new URL('../components/contact/FormLandingPage.astro', import.meta.url),
      'utf8',
    );

    assert.match(source, /method="post"/);
    assert.match(source, /action="\/api\/customers"/);
    assert.match(source, /data-astro-reload/);
    assert.match(source, /name="consent"/);
    assert.match(source, /name="locale"/);
    assert.match(source, /BookingServiceFields/);
    assert.match(source, /data-form-actions/);
    assert.match(source, /buildWhatsAppUrl/);
    assert.match(source, /buildPhoneUrl/);
    assert.match(source, /clinicMapUrl/);
    assert.doesNotMatch(source, /data-form-landing-crumb/);
    assert.doesNotMatch(source, /offersHref/);
    assert.doesNotMatch(source, /goFullSite/);
    assert.doesNotMatch(source, /name="message"/);
    assert.doesNotMatch(source, /href=\{copy\.homeHref\}/);
    assert.ok(source.indexOf('data-form-actions') < source.indexOf('<SocialLinks'));
    assert.ok(source.indexOf('data-form-actions') < source.indexOf('id="contact-form"'));
  });

  it('uses the same dentistry-then-dermatology options on every public booking form', async () => {
    const optionSource = await readFile(
      new URL('../components/contact/ServiceDepartmentOptions.astro', import.meta.url),
      'utf8',
    );
    assert.match(optionSource, /getFormServiceGroups/);
    assert.match(optionSource, /<optgroup/);
    assert.match(optionSource, /data-specialty/);

    const formFiles = [
      '../components/contact/FormLandingPage.astro',
      '../components/contact/BookingForm.astro',
      '../components/services/BookingSection.astro',
      '../pages/book.astro',
      '../pages/en/book.astro',
    ];

    for (const file of formFiles) {
      const source = await readFile(new URL(file, import.meta.url), 'utf8');
      assert.match(source, /BookingServiceFields/, file);
      assert.doesNotMatch(source, /bookingDepartments/, file);
    }
  });
});
