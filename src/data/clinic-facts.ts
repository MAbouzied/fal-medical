/** Canonical clinic facts used across UI copy and JSON-LD. Do not invent extras. */

export const CLINIC_TIMEZONE = 'Asia/Riyadh';

export const clinicFacts = {
  nameAr: 'مجمع عيادات فال الطبية',
  nameEn: 'Fal Clinic',
  cityAr: 'حفر الباطن',
  cityEn: 'Hafar Al Batin',
  districtAr: 'حي الخالدية',
  districtEn: 'Al Khalidiyah',
  streetAr: 'شارع الملك عبدالله',
  streetEn: 'King Abdullah Street',
  regionAr: 'المنطقة الشرقية',
  regionEn: 'Eastern Province',
  postalCode: '39511',
  email: 'info@falclinic.com',
  openingHours: [
    {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const,
      opens: '10:00',
      closes: '22:00',
    },
    {
      days: ['Friday'] as const,
      opens: '16:00',
      closes: '20:00',
    },
    {
      days: ['Saturday'] as const,
      opens: '14:00',
      closes: '22:00',
    },
  ],
} as const;

export type ClinicLocale = 'ar' | 'en';

export function clinicCity(locale: ClinicLocale = 'ar'): string {
  return locale === 'en' ? clinicFacts.cityEn : clinicFacts.cityAr;
}

export function clinicRegion(locale: ClinicLocale = 'ar'): string {
  return locale === 'en' ? clinicFacts.regionEn : clinicFacts.regionAr;
}

export function formatClinicStreetAddress(locale: ClinicLocale = 'ar'): string {
  if (locale === 'en') {
    return `${clinicFacts.streetEn}, ${clinicFacts.districtEn}`;
  }
  return `${clinicFacts.streetAr}، ${clinicFacts.districtAr}`;
}

export function formatClinicLocation(locale: ClinicLocale = 'ar'): string {
  if (locale === 'en') {
    return `${clinicFacts.streetEn}, ${clinicFacts.districtEn}, ${clinicFacts.cityEn} ${clinicFacts.postalCode}`;
  }
  return `${clinicFacts.streetAr}، ${clinicFacts.districtAr}، ${clinicFacts.cityAr} ${clinicFacts.postalCode}`;
}

export function formatClinicDescription(locale: ClinicLocale = 'ar'): string {
  if (locale === 'en') {
    return `Multi-specialty medical complex in ${clinicFacts.cityEn} — ${clinicFacts.districtEn}, ${clinicFacts.streetEn}. Dentistry, dermatology, aesthetics, nutrition, obstetrics & gynecology, and physiotherapy.`;
  }
  return `عيادة متعددة التخصصات في ${clinicFacts.cityAr} — ${clinicFacts.districtAr}، ${clinicFacts.streetAr}. أسنان، جلدية، تجميل، تغذية، نساء وولادة، وعلاج طبيعي.`;
}

export function formatClinicHours(locale: ClinicLocale = 'ar'): string {
  if (locale === 'en') {
    return 'Sun–Thu 10:00 AM–10:00 PM · Fri 4:00 PM–8:00 PM · Sat 2:00 PM–10:00 PM';
  }
  return 'الأحد–الخميس 10:00 ص–10:00 م · الجمعة 4:00 م–8:00 م · السبت 2:00 م–10:00 م';
}

export function formatClinicHoursFaq(locale: ClinicLocale = 'ar'): string {
  if (locale === 'en') {
    return 'Sunday to Thursday, 10:00 AM to 10:00 PM. Friday, 4:00 PM to 8:00 PM. Saturday, 2:00 PM to 10:00 PM. Hours may change during Ramadan and official holidays.';
  }
  return 'نعمل من الأحد إلى الخميس من الساعة 10:00 صباحًا حتى 10:00 مساءً، والجمعة من 4:00 مساءً حتى 8:00 مساءً، والسبت من 2:00 مساءً حتى 10:00 مساءً. قد تختلف المواعيد خلال رمضان والإجازات الرسمية.';
}

export function clinicOpeningHoursRows(locale: ClinicLocale = 'ar'): ReadonlyArray<readonly [string, string]> {
  if (locale === 'en') {
    return [
      ['Saturday', '2:00 PM – 10:00 PM'],
      ['Sunday', '10:00 AM – 10:00 PM'],
      ['Monday', '10:00 AM – 10:00 PM'],
      ['Tuesday', '10:00 AM – 10:00 PM'],
      ['Wednesday', '10:00 AM – 10:00 PM'],
      ['Thursday', '10:00 AM – 10:00 PM'],
      ['Friday', '4:00 PM – 8:00 PM'],
    ] as const;
  }
  return [
    ['السبت', '2:00 م – 10:00 م'],
    ['الأحد', '10:00 ص – 10:00 م'],
    ['الاثنين', '10:00 ص – 10:00 م'],
    ['الثلاثاء', '10:00 ص – 10:00 م'],
    ['الأربعاء', '10:00 ص – 10:00 م'],
    ['الخميس', '10:00 ص – 10:00 م'],
    ['الجمعة', '4:00 م – 8:00 م'],
  ] as const;
}
