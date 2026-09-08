import { clinicOpeningHoursRows } from '../../data/clinic-facts.ts';
import { clinicContact } from '../../data/contact';
import { clinicDevices, type ClinicDevice } from '../../data/devices';
import { doctors, type Doctor } from '../../data/doctors';
import { faqItems, type FaqItem } from '../../data/faq';
import { clinicServices, type ClinicService } from '../../data/services';
import {
  categoriesEn,
  departmentsEn,
  devicesEn,
  doctorServicesEn,
  doctorsEn,
  faqEn,
  servicesEn,
  specialtiesEn,
  uiEn,
} from './content-en';
import {
  findRoutePair,
  getAlternateLocalePath,
  isBlogPath,
  type Locale,
} from './routes';

export type { Locale } from './routes';

export function isEnglish(locale: Locale | undefined): locale is 'en' {
  return locale === 'en';
}

export function localizeDepartment(department: string, locale: Locale = 'ar'): string {
  if (!isEnglish(locale)) return department;
  return departmentsEn[department as keyof typeof departmentsEn] ?? department;
}

export function localizeSpecialty(specialty: string, locale: Locale = 'ar'): string {
  if (!isEnglish(locale)) return specialty;
  return specialtiesEn[specialty as keyof typeof specialtiesEn] ?? specialty;
}

export function localizeCategory(category: string, locale: Locale = 'ar'): string {
  if (!isEnglish(locale)) return category;
  return categoriesEn[category as keyof typeof categoriesEn] ?? category;
}

export function localizeDoctorService(service: string, locale: Locale = 'ar'): string {
  if (!isEnglish(locale)) return service;
  return doctorServicesEn[service as keyof typeof doctorServicesEn] ?? service;
}

export function localizeService(service: ClinicService, locale: Locale = 'ar'): ClinicService {
  if (!isEnglish(locale)) return service;
  const copy = servicesEn[service.id];
  if (!copy) {
    throw new Error(
      `Missing English translation for service "${service.id}". Add an entry to servicesEn in content-en.ts.`,
    );
  }
  return {
    ...service,
    title: copy.title,
    description: copy.description,
    heroImageAlt: copy.heroImageAlt,
    sections: copy.sections,
  };
}

export function localizeServices(locale: Locale = 'ar'): ClinicService[] {
  return clinicServices.map((service) => localizeService(service, locale));
}

export function localizeDoctor(doctor: Doctor, locale: Locale = 'ar'): Doctor & { specialtyLabel: string; branchLabel: string } {
  if (!isEnglish(locale)) {
    return {
      ...doctor,
      specialtyLabel: doctor.specialty,
      branchLabel: doctor.branch,
    };
  }
  const copy = doctorsEn[doctor.id];
  if (!copy) {
    throw new Error(
      `Missing English translation for doctor "${doctor.id}". Add an entry to doctorsEn in content-en.ts.`,
    );
  }
  return {
    ...doctor,
    name: copy.name,
    title: copy.title,
    seoRole: copy.seoRole,
    summary: copy.summary,
    sections: copy.sections,
    specialtyLabel: copy.specialty,
    branchLabel: uiEn.location.branch,
  };
}

export function localizeDoctors(locale: Locale = 'ar') {
  return doctors.map((doctor) => localizeDoctor(doctor, locale));
}

export function localizeDevice(device: ClinicDevice, locale: Locale = 'ar'): ClinicDevice {
  if (!isEnglish(locale)) return device;
  const copy = devicesEn[device.id];
  if (!copy) {
    throw new Error(
      `Missing English translation for device "${device.id}". Add an entry to devicesEn in content-en.ts.`,
    );
  }
  return {
    ...device,
    name: copy.name,
    description: copy.description,
    imageAlt: copy.imageAlt,
  };
}

export function localizeDevices(locale: Locale = 'ar'): ClinicDevice[] {
  return clinicDevices.map((device) => localizeDevice(device, locale));
}

export function localizeFaq(locale: Locale = 'ar'): readonly FaqItem[] {
  if (!isEnglish(locale)) return faqItems;
  return faqEn;
}

export function localizeContact(locale: Locale = 'ar') {
  if (!isEnglish(locale)) return clinicContact;
  return {
    ...clinicContact,
    branch: uiEn.location.branch,
    location: uiEn.location.full,
    hours: uiEn.location.hours,
    hoursRows: clinicOpeningHoursRows('en'),
  };
}

export function ui(locale: Locale = 'ar') {
  return isEnglish(locale) ? uiEn : null;
}

/** Normalize pathname (strip query/hash, trailing slash except root). */
export function normalizePathname(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || '/';
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

export function localeFromPathname(pathname: string): Locale {
  const path = normalizePathname(pathname);
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'ar';
}

/** Arabic (default-locale) path for a given pathname. */
export function toArabicPath(pathname: string): string {
  const path = normalizePathname(pathname);
  if (path === '/en') return '/';
  if (path.startsWith('/en/')) return path.slice(3) || '/';
  return path;
}

/** English path for a given pathname. */
export function toEnglishPath(pathname: string): string {
  const arabicPath = toArabicPath(pathname);
  if (arabicPath === '/') return '/en';
  return `/en${arabicPath}`;
}

/** Locale-prefixed path from an Arabic (unprefixed) path. */
export function localizedPath(arabicPath: string, locale: Locale = 'ar'): string {
  const path = normalizePathname(arabicPath);
  if (locale === 'en') return toEnglishPath(path);
  return toArabicPath(path);
}

/** Matching AR/EN URLs for hreflang / sitemap alternates. `en` is omitted for Arabic-only routes. */
export function getAlternatePaths(
  pathname: string,
): { ar: string; en?: string } | null {
  if (isBlogPath(pathname)) {
    return { ar: normalizePathname(pathname) };
  }
  const pair = findRoutePair(pathname);
  if (!pair) return null;
  return pair.en !== undefined ? { ar: pair.ar, en: pair.en } : { ar: pair.ar };
}

export function languageSwitchHref(
  pathname: string,
  locale: Locale,
  search = '',
  hash = '',
): string {
  const targetLocale = locale === 'en' ? 'ar' : 'en';
  const target = getAlternateLocalePath(pathname, targetLocale);
  const q = search && !search.startsWith('?') ? `?${search}` : search;
  const h = hash && !hash.startsWith('#') ? `#${hash}` : hash;

  if (target) return `${target}${q}${h}`;

  // Arabic-only routes (e.g. blog) must not invent a missing English article URL.
  if (locale === 'ar' && targetLocale === 'en') {
    if (isBlogPath(pathname)) return `/en${q}${h}`;
    const pair = findRoutePair(pathname);
    if (pair && pair.en === undefined) return `/en${q}${h}`;
  }

  const path = locale === 'en' ? toArabicPath(pathname) : toEnglishPath(pathname);
  return `${path}${q}${h}`;
}

export function htmlLang(locale: Locale): string {
  return locale === 'en' ? 'en' : 'ar';
}

export function ogLocale(locale: Locale): string {
  return locale === 'en' ? 'en_US' : 'ar_SA';
}

export function schemaLanguage(locale: Locale): string {
  return locale === 'en' ? 'en' : 'ar';
}
