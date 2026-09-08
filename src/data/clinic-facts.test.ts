import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  clinicFacts,
  clinicOpeningHoursRows,
  formatClinicHours,
  formatClinicHoursFaq,
  formatClinicLocation,
  formatClinicStreetAddress,
} from './clinic-facts.ts';
import { faqItems } from './faq.ts';

describe('clinicFacts', () => {
  it('keeps the locked clinic hours used by Schema.org', () => {
    assert.deepEqual(
      clinicFacts.openingHours.map((entry) => ({
        days: [...entry.days],
        opens: entry.opens,
        closes: entry.closes,
      })),
      [
        {
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '10:00',
          closes: '22:00',
        },
        {
          days: ['Friday'],
          opens: '16:00',
          closes: '20:00',
        },
        {
          days: ['Saturday'],
          opens: '14:00',
          closes: '22:00',
        },
      ],
    );
  });

  it('formats Arabic and English hours and location', () => {
    assert.equal(
      formatClinicHours('ar'),
      'الأحد–الخميس 10:00 ص–10:00 م · الجمعة 4:00 م–8:00 م · السبت 2:00 م–10:00 م',
    );
    assert.equal(
      formatClinicHours('en'),
      'Sun–Thu 10:00 AM–10:00 PM · Fri 4:00 PM–8:00 PM · Sat 2:00 PM–10:00 PM',
    );
    assert.equal(
      formatClinicLocation('ar'),
      'شارع الملك عبدالله، حي الخالدية، حفر الباطن 39511',
    );
    assert.equal(
      formatClinicLocation('en'),
      'King Abdullah Street, Al Khalidiyah, Hafar Al Batin 39511',
    );
    assert.equal(formatClinicStreetAddress('ar'), 'شارع الملك عبدالله، حي الخالدية');
    assert.equal(formatClinicStreetAddress('en'), 'King Abdullah Street, Al Khalidiyah');
  });

  it('keeps FAQ hours copy aligned with clinic facts', () => {
    const hoursFaq = faqItems.find((item) => item.question.includes('أوقات العمل'));
    assert.ok(hoursFaq);
    assert.equal(hoursFaq!.answer, formatClinicHoursFaq('ar'));
  });

  it('lists seven opening-hour rows including Friday afternoon hours', () => {
    const rows = clinicOpeningHoursRows('ar');
    assert.equal(rows.length, 7);
    assert.equal(rows[0]?.[0], 'السبت');
    assert.equal(rows[0]?.[1], '2:00 م – 10:00 م');
    assert.equal(rows[6]?.[1], '4:00 م – 8:00 م');
  });
});
