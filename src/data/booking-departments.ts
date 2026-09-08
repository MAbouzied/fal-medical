/** Departments offered in booking / contact forms (Arabic canonical values). */
export const bookingDepartments = [
  'قسم الأسنان',
  'قسم الجلدية',
  'قسم الليزر',
  'قسم التغذية',
  'قسم النساء والولادة',
  'قسم العلاج الطبيعي',
] as const;

export type BookingDepartment = (typeof bookingDepartments)[number];

export function isBookingDepartment(value: string): value is BookingDepartment {
  return (bookingDepartments as readonly string[]).includes(value);
}