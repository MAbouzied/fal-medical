import { departmentsEn, servicesEn } from '../lib/i18n/content-en.ts';
import { bookingDepartments } from './booking-departments.ts';
import { clinicServices } from './services.ts';

type Locale = 'ar' | 'en';

export const formSpecialties = ['أسنان', 'جلدية', 'تغذية', 'نساء وولادة', 'علاج طبيعي'] as const;
export const OTHER_FORM_SERVICE = 'خدمات أخرى';
const otherFormServiceLabel = {
  ar: OTHER_FORM_SERVICE,
  en: 'Other services',
} as const;

export type FormServiceOption = {
  value: string;
  label: string;
};

export type FormServiceGroup = {
  department: (typeof formSpecialties)[number];
  label: string;
  services: ReadonlyArray<FormServiceOption>;
};

export const formServiceValues = [...clinicServices.map((service) => service.title), OTHER_FORM_SERVICE];

export const formServiceCatalog = [
  ...clinicServices.map((service) => ({
    department: service.department,
    title: service.title,
  })),
  ...formSpecialties.map((department) => ({
    department,
    title: OTHER_FORM_SERVICE,
  })),
];

export const acceptedLeadDepartments = [...formSpecialties, ...bookingDepartments, ...formServiceValues];

export function specialtyForServiceTitle(title: string): string {
  return clinicServices.find((service) => service.title === title)?.department ?? '';
}

export function getFormServiceGroups(locale: Locale): ReadonlyArray<FormServiceGroup> {
  return formSpecialties.map((department) => ({
    department,
    label: locale === 'en' ? departmentsEn[department] : department,
    services: [
      ...clinicServices
        .filter((service) => service.department === department)
        .map((service) => ({
          value: service.title,
          label: locale === 'en' ? (servicesEn[service.id]?.title ?? service.title) : service.title,
        })),
      {
        value: OTHER_FORM_SERVICE,
        label: otherFormServiceLabel[locale],
      },
    ],
  }));
}

export type FormLandingCopy = {
  pageTitle: string;
  pageDescription: string;
  homeHref: string;
  formHref: string;
  branchesEyebrow: string;
  branchesHeading: string;
  addressLabel: string;
  hoursLabel: string;
  phoneLabel: string;
  followUs: string;
  phone: string;
  name: string;
  specialty: string;
  service: string;
  phonePlaceholder: string;
  namePlaceholder: string;
  specialtyPlaceholder: string;
  servicePlaceholder: string;
  submit: string;
  saving: string;
  redirecting: string;
  saveFailed: string;
  invalid: string;
  languageLabel: string;
  languageAria: string;
  brandAria: string;
  actionsAria: string;
  whatsappAction: string;
  callAction: string;
  locationAction: string;
  departments: ReadonlyArray<FormServiceOption>;
  serviceGroups: ReadonlyArray<FormServiceGroup>;
};

const copy = {
  ar: {
    pageTitle: 'تواصل معنا - فال',
    pageDescription:
      'أرسل اسمك ورقم جوالك واختر الخدمة، ثم أكمل الطلب. فال في حفر الباطن.',
    homeHref: '/',
    formHref: '/form',
    branchesEyebrow: 'موقعنا',
    branchesHeading: 'زُرنا في عيادتنا بحفر الباطن',
    addressLabel: 'العنوان',
    hoursLabel: 'ساعات العمل',
    phoneLabel: 'الهاتف',
    followUs: 'تابعنا:',
    phone: 'رقم الجوال',
    name: 'الاسم الكامل',
    specialty: 'التخصص',
    service: 'الخدمة المطلوبة',
    phonePlaceholder: '05XXXXXXXX',
    namePlaceholder: 'اكتب اسمك',
    specialtyPlaceholder: 'اختر التخصص',
    servicePlaceholder: 'اختر الخدمة',
    submit: 'أرسل الآن',
    saving: 'جاري حفظ بياناتك...',
    redirecting: 'جاري إرسال طلبك...',
    saveFailed: 'تعذر حفظ السجل الإلكتروني. سيتم إرسال الطلب للعيادة الآن.',
    invalid: 'يرجى التأكد من الاسم ورقم الجوال السعودي واختيار التخصص والخدمة.',
    languageLabel: 'EN',
    languageAria: 'Switch to English',
    brandAria: 'فال',
    actionsAria: 'خيارات التواصل',
    whatsappAction: 'تواصل واتساب',
    callAction: 'اتصال',
    locationAction: 'الموقع',
  },
  en: {
    pageTitle: 'Contact us - Fal Clinic',
    pageDescription:
      'Send your name, mobile number, and requested service. Fal Clinic in Hafar Al Batin.',
    homeHref: '/en',
    formHref: '/en/form',
    branchesEyebrow: 'Visit us',
    branchesHeading: 'Visit our clinic in Hafar Al Batin',
    addressLabel: 'Address',
    hoursLabel: 'Working hours',
    phoneLabel: 'Phone',
    followUs: 'Follow us:',
    phone: 'Mobile number',
    name: 'Full name',
    specialty: 'Specialty',
    service: 'Requested service',
    phonePlaceholder: '05XXXXXXXX',
    namePlaceholder: 'Enter your name',
    specialtyPlaceholder: 'Choose a specialty',
    servicePlaceholder: 'Choose a service',
    submit: 'Send now',
    saving: 'Saving your details...',
    redirecting: 'Sending your request...',
    saveFailed: 'We could not save the online record. Your request will still be sent to the clinic.',
    invalid: 'Please check your name, Saudi mobile number, specialty, and service.',
    languageLabel: 'AR',
    languageAria: 'التبديل إلى العربية',
    brandAria: 'Fal Clinic',
    actionsAria: 'Contact options',
    whatsappAction: 'WhatsApp',
    callAction: 'Call',
    locationAction: 'Location',
  },
} as const;

export function getFormLandingCopy(locale: Locale): FormLandingCopy {
  const serviceGroups = getFormServiceGroups(locale);
  return {
    ...copy[locale],
    serviceGroups,
    departments: serviceGroups.flatMap((group) => [...group.services]),
  };
}
