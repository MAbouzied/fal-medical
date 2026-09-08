import {
  clinicFacts,
  clinicOpeningHoursRows,
  formatClinicHours,
  formatClinicLocation,
} from './clinic-facts.ts';
import { clinicServices } from './services.ts';

export type ClinicLineId = 'dental' | 'dermatology';

export interface ClinicLine {
  id: ClinicLineId;
  /** Arabic department value used in booking forms. */
  departmentAr: 'أسنان' | 'جلدية';
  labelAr: string;
  labelEn: string;
  /** International digits only (no +), e.g. 96655… or 9669200… */
  number: string;
  /** Local Saudi display */
  phoneDisplay: string;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Normalize a Saudi local, 9200, or international (966…) value to 966… digits. */
function toInternationalSa(value: string): string {
  const digits = digitsOnly(value);
  if (digits.startsWith('966')) return digits;
  if (digits.startsWith('9200')) return `966${digits}`;
  if (digits.startsWith('0')) return `966${digits.slice(1)}`;
  return digits;
}

/** Format 96655… as 055 295 9863, or 9669200… as 9200 02299. */
function toLocalDisplay(intlDigits: string): string {
  const national = intlDigits.startsWith('966') ? intlDigits.slice(3) : intlDigits;
  if (national.startsWith('9200') && national.length === 9) {
    return `${national.slice(0, 4)} ${national.slice(4)}`;
  }
  const local = intlDigits.startsWith('966') ? `0${intlDigits.slice(3)}` : intlDigits;
  if (local.length !== 10) return local;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

function envDigits(name: string): string {
  const env = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
  const raw = env?.[name];
  return typeof raw === 'string' ? toInternationalSa(raw) : '';
}

const unifiedNumber =
  envDigits('PUBLIC_CLINIC_PHONE') || envDigits('PUBLIC_DENTAL_PHONE') || '966557034280';
const dentalNumber = envDigits('PUBLIC_DENTAL_PHONE') || unifiedNumber;
const dermatologyNumber = envDigits('PUBLIC_DERMATOLOGY_PHONE') || unifiedNumber;

export const clinicLines: readonly ClinicLine[] = [
  {
    id: 'dental',
    departmentAr: 'أسنان',
    labelAr: 'عيادة الأسنان',
    labelEn: 'Dental clinic',
    number: dentalNumber,
    phoneDisplay: toLocalDisplay(dentalNumber),
  },
  {
    id: 'dermatology',
    departmentAr: 'جلدية',
    labelAr: 'عيادة الجلدية',
    labelEn: 'Dermatology clinic',
    number: dermatologyNumber,
    phoneDisplay: toLocalDisplay(dermatologyNumber),
  },
] as const;

export function getClinicLine(id: ClinicLineId): ClinicLine {
  const line = clinicLines.find((entry) => entry.id === id);
  if (!line) throw new Error(`Unknown clinic line: ${id}`);
  return line;
}

/** Map a booking department or service title to the matching clinic phone/WhatsApp line. */
export function clinicLineFromDepartment(department: string): ClinicLineId {
  const value = department.trim();
  const lower = value.toLowerCase();
  if (value === 'أسنان' || lower === 'dentistry' || lower === 'dental' || value === 'قسم الأسنان') {
    return 'dental';
  }
  const service = clinicServices.find((item) => item.title === value);
  if (service?.department === 'أسنان') return 'dental';
  return 'dermatology';
}

export const clinicContact = {
  phones: clinicLines,
  email: clinicFacts.email,
  hours: formatClinicHours('ar'),
  hoursRows: clinicOpeningHoursRows('ar'),
  branch: clinicFacts.cityAr,
  district: clinicFacts.districtAr,
  street: clinicFacts.streetAr,
  city: clinicFacts.cityAr,
  location: formatClinicLocation('ar'),
} as const;

export type ClinicSocialId = 'instagram' | 'tiktok' | 'snapchat';

export interface ClinicSocialLink {
  id: ClinicSocialId;
  href: string;
  labelAr: string;
  labelEn: string;
  icon: string;
}

/** Replace these with the official Fal social URLs before launch. */
export const clinicSocialLinks: readonly ClinicSocialLink[] = [
  {
    id: 'instagram',
    href: 'https://www.instagram.com/falclinic/',
    labelAr: 'إنستغرام مجمع عيادات فال',
    labelEn: 'Fal Clinic on Instagram',
    icon: '/assets/instagram.svg',
  },
  {
    id: 'tiktok',
    href: 'https://www.tiktok.com/@falclinic',
    labelAr: 'تيك توك مجمع عيادات فال',
    labelEn: 'Fal Clinic on TikTok',
    icon: '/assets/tiktok.svg',
  },
  {
    id: 'snapchat',
    href: 'https://www.snapchat.com/add/falclinic',
    labelAr: 'سناب شات مجمع عيادات فال',
    labelEn: 'Fal Clinic on Snapchat',
    icon: '/assets/snapchat.svg',
  },
] as const;

export function buildWhatsAppUrl(message?: string, line: ClinicLineId = 'dental'): string {
  const base = `https://wa.me/${getClinicLine(line).number}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildPhoneUrl(line: ClinicLineId = 'dental'): string {
  return `tel:+${getClinicLine(line).number}`;
}

export interface BookingWhatsAppFields {
  name: string;
  phone: string;
  department: string;
  service?: string;
  branch?: string;
  message?: string;
}

export function buildBookingWhatsAppMessage(fields: BookingWhatsAppFields): string {
  const lines = [
    'طلب حجز جديد من موقع مجمع عيادات فال الطبية',
    '',
    `الاسم: ${fields.name}`,
    `الجوال: ${fields.phone}`,
    `القسم: ${fields.department}`,
  ];

  if (fields.service?.trim()) lines.push(`الخدمة: ${fields.service}`);
  lines.push(`الفرع: ${fields.branch?.trim() || clinicContact.branch}`);
  if (fields.message?.trim()) {
    lines.push('');
    lines.push(`ملاحظات: ${fields.message}`);
  }

  return lines.join('\n');
}
