import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bookingDepartments, isBookingDepartment } from './booking-departments.ts';

describe('bookingDepartments', () => {
  it('lists Fal booking departments without Beauty Corner aesthetic leftovers', () => {
    assert.deepEqual([...bookingDepartments], [
      'قسم الأسنان',
      'قسم الجلدية',
      'قسم الليزر',
      'قسم التغذية',
      'قسم النساء والولادة',
      'قسم العلاج الطبيعي',
    ]);
  });

  it('recognizes known departments and rejects unknown values', () => {
    assert.equal(isBookingDepartment('قسم الأسنان'), true);
    assert.equal(isBookingDepartment('قسم الفيلر'), false);
    assert.equal(isBookingDepartment('أسنان'), false);
    assert.equal(isBookingDepartment(''), false);
  });
});
