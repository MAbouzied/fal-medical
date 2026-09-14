import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bookingDepartments, isBookingDepartment } from './booking-departments.ts';

describe('bookingDepartments', () => {
  it('lists only dentistry and dermatology booking departments', () => {
    assert.deepEqual([...bookingDepartments], [
      'قسم الأسنان',
      'قسم الجلدية',
    ]);
  });

  it('recognizes known departments and rejects unknown values', () => {
    assert.equal(isBookingDepartment('قسم الأسنان'), true);
    assert.equal(isBookingDepartment('قسم الجلدية'), true);
    assert.equal(isBookingDepartment('قسم الليزر'), false);
    assert.equal(isBookingDepartment('قسم التغذية'), false);
    assert.equal(isBookingDepartment('أسنان'), false);
    assert.equal(isBookingDepartment(''), false);
  });
});
