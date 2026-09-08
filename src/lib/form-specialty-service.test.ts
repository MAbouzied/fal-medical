import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { servicesForSelectedSpecialty } from './form-specialty-service.ts';

describe('servicesForSelectedSpecialty', () => {
  const catalog = [
    { specialty: 'أسنان', value: 'زراعة الأسنان' },
    { specialty: 'أسنان', value: 'تبييض الأسنان' },
    { specialty: 'أسنان', value: 'خدمات أخرى' },
    { specialty: 'جلدية', value: 'الليزر' },
    { specialty: 'جلدية', value: 'خدمات أخرى' },
  ];

  it('returns no services until a specialty is chosen', () => {
    assert.deepEqual(servicesForSelectedSpecialty(catalog, ''), []);
    assert.deepEqual(servicesForSelectedSpecialty(catalog, '   '), []);
  });

  it('returns only services for the selected specialty', () => {
    assert.deepEqual(
      servicesForSelectedSpecialty(catalog, 'أسنان').map((item) => item.value),
      ['زراعة الأسنان', 'تبييض الأسنان', 'خدمات أخرى'],
    );
    assert.deepEqual(
      servicesForSelectedSpecialty(catalog, 'جلدية').map((item) => item.value),
      ['الليزر', 'خدمات أخرى'],
    );
  });
});
