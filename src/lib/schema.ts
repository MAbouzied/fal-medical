import {
  clinicCity,
  clinicFacts,
  clinicRegion,
  formatClinicDescription,
  formatClinicStreetAddress,
} from '../data/clinic-facts.ts';
import { clinicSocialLinks } from '../data/contact.ts';
import type { Doctor } from '../data/doctors.ts';
import type { FaqItem } from '../data/faq.ts';
import { clinicLicenses } from '../data/licenses.ts';
import { organization } from '../data/organization.ts';
import { clinicGeo, clinicMapUrl } from '../data/seo.ts';
import type { ClinicService } from '../data/services.ts';
import { serviceSectionPath } from '../data/services.ts';
import {
  localizeCategory,
  localizeDoctorService,
  localizeServices,
  localizeSpecialty,
  localizedPath,
  schemaLanguage,
  type Locale,
} from './i18n/localize.ts';
import { stripSchemaText } from './seo/schema-text.ts';

export { stripSchemaText };

export {
  buildBlogCollectionSchemas,
  buildBlogPostingSchema,
  buildCollectionPageSchema,
  serializeJsonLd,
} from '../modules/blog/lib/blog-jsonld.ts';

type JsonLd = Record<string, unknown>;

const absoluteUrl = (site: URL, path = '/'): string => new URL(path, site).href;

const AVAILABLE_LANGUAGES = ['ar', 'en'] as const;

export function itemListId(site: URL, path: string): string {
  return `${absoluteUrl(site, path)}#itemlist`;
}

/** Schema.org MedicalSpecialty. Dermatology and dentistry are the only clinic departments. */
export function medicalSpecialtyUrl(specialtyOrDepartment: string): string {
  return specialtyOrDepartment.includes('جلد')
    ? 'https://schema.org/Dermatology'
    : 'https://schema.org/Dentistry';
}

/** Stable across locales — do not localize these IDs. */
export const organizationId = (site: URL): string => `${site.origin}/#organization`;
export const websiteId = (site: URL): string => `${site.origin}/#website`;

export function buildOrganizationSchema(site: URL, locale: Locale = 'ar'): JsonLd {
  const isEnglish = locale === 'en';
  const address: JsonLd = {
    '@type': 'PostalAddress',
    addressCountry: organization.addressCountry,
    addressRegion: clinicRegion(locale),
    addressLocality: clinicCity(locale),
    postalCode: clinicFacts.postalCode,
    streetAddress: formatClinicStreetAddress(locale),
  };

  const description = formatClinicDescription(locale);

  const catalogName = isEnglish ? 'Fal Clinic services' : 'خدمات مجمع عيادات فال';
  const catalogServices = localizeServices(locale);

  return {
    '@type': 'MedicalClinic',
    '@id': organizationId(site),
    name: isEnglish ? organization.alternateName : organization.name,
    alternateName: isEnglish ? organization.name : organization.alternateName,
    legalName: organization.legalName,
    description,
    url: absoluteUrl(site, '/'),
    logo: absoluteUrl(site, organization.logoPath),
    image: absoluteUrl(site, organization.imagePath),
    email: organization.email,
    telephone: organization.telephone,
    sameAs: clinicSocialLinks.map((link) => link.href),
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: clinicGeo.latitude,
      longitude: clinicGeo.longitude,
    },
    hasMap: clinicMapUrl,
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'Unified National Number',
        value: clinicLicenses.unifiedNationalNumber,
      },
      {
        '@type': 'PropertyValue',
        name: 'Commercial Registration Number',
        value: clinicLicenses.commercialRegistrationNumber,
      },
      ...(clinicLicenses.municipalLicenseNumber
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Municipal License Number',
              value: clinicLicenses.municipalLicenseNumber,
            },
          ]
        : []),
    ],
    openingHoursSpecification: organization.openingHours.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...spec.days],
      opens: spec.opens,
      closes: spec.closes,
    })),
    medicalSpecialty: [...organization.medicalSpecialties],
    availableLanguage: [...AVAILABLE_LANGUAGES],
    contactPoint: [
      ...organization.contactLines.map((line) => ({
        '@type': 'ContactPoint',
        contactType: isEnglish ? line.labelEn : line.labelAr,
        name: isEnglish ? line.labelEn : line.labelAr,
        telephone: line.telephone,
        email: organization.email,
        availableLanguage: [...AVAILABLE_LANGUAGES],
        url: line.whatsappUrl,
      })),
      {
        '@type': 'ContactPoint',
        contactType: 'reservations',
        telephone: organization.telephone,
        availableLanguage: [...AVAILABLE_LANGUAGES],
        url: absoluteUrl(site, localizedPath('/book', locale)),
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: catalogName,
      itemListElement: catalogServices.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          url: absoluteUrl(site, serviceSectionPath(service.id, locale)),
        },
        position: index + 1,
      })),
    },
  };
}

export function buildWebsiteSchema(site: URL, locale: Locale = 'ar'): JsonLd {
  const isEnglish = locale === 'en';
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: absoluteUrl(site, '/'),
    name: isEnglish ? organization.alternateName : organization.name,
    alternateName: isEnglish ? organization.name : organization.alternateName,
    description: formatClinicDescription(locale),
    inLanguage: [...AVAILABLE_LANGUAGES],
    publisher: { '@id': organizationId(site) },
  };
}

export function buildWebPageSchema(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  type?: string;
  locale?: Locale;
  mainEntityId?: string;
  /** Override the default organization `about` reference. */
  aboutId?: string;
  /** Schema.org MedicalSpecialty URL for MedicalWebPage. */
  specialty?: string;
  potentialAction?: JsonLd;
}): JsonLd {
  const locale = options.locale ?? 'ar';
  const url = absoluteUrl(options.site, options.path);
  const schema: JsonLd = {
    '@type': options.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: stripSchemaText(options.name),
    description: stripSchemaText(options.description, 500),
    inLanguage: schemaLanguage(locale),
    isPartOf: { '@id': websiteId(options.site) },
    about: { '@id': options.aboutId ?? organizationId(options.site) },
    publisher: { '@id': organizationId(options.site) },
    provider: { '@id': organizationId(options.site) },
  };

  if (options.specialty) schema.specialty = options.specialty;
  if (options.mainEntityId) schema.mainEntity = { '@id': options.mainEntityId };
  if (options.potentialAction) schema.potentialAction = options.potentialAction;

  return schema;
}

/** Appointment booking action. Clinic-only; the LMS site has no equivalent. */
export function buildReserveAction(site: URL, locale: Locale = 'ar'): JsonLd {
  const url = absoluteUrl(site, localizedPath('/book', locale));
  return {
    '@type': 'ReserveAction',
    name: locale === 'en' ? 'Book an appointment' : 'احجز موعداً',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: url,
      inLanguage: schemaLanguage(locale),
      actionPlatform: [
        'https://schema.org/DesktopWebPlatform',
        'https://schema.org/MobileWebPlatform',
      ],
    },
  };
}

export function buildBreadcrumbSchema(
  site: URL,
  items: readonly { name: string; path: string }[],
): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(site, item.path),
    })),
  };
}

export function buildFaqSchema(items: readonly FaqItem[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: stripSchemaText(item.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripSchemaText(item.answer.replace(/\n/g, ' ')),
      },
    })),
  };
}

export function buildServiceSchema(
  site: URL,
  service: ClinicService,
  locale: Locale = 'ar',
): JsonLd {
  const path = serviceSectionPath(service.id, locale);
  const url = absoluteUrl(site, path);
  const bookingPath = localizedPath('/book', locale);
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    description: stripSchemaText(service.description, 500),
    url,
    image: absoluteUrl(site, service.heroImage),
    serviceType: localizeCategory(service.category, locale),
    category: localizeSpecialty(service.doctorSpecialty, locale),
    provider: { '@id': organizationId(site) },
    areaServed: {
      '@type': 'City',
      name: clinicCity(locale),
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: absoluteUrl(site, bookingPath),
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: organization.telephone,
        contactType: 'reservations',
        availableLanguage: [...AVAILABLE_LANGUAGES],
      },
    },
  };
}

/** Visible treatment steps only. No invented outcomes, prices, or ratings. */
export function buildMedicalProcedureSchema(
  site: URL,
  service: ClinicService,
  locale: Locale = 'ar',
): JsonLd {
  const path = serviceSectionPath(service.id, locale);
  const url = absoluteUrl(site, path);
  const steps = service.sections.flatMap((section) => section.listItems ?? []);
  const howPerformed = steps.length > 0 ? stripSchemaText(steps.join(' '), 500) : '';

  return {
    '@type': 'MedicalProcedure',
    '@id': `${url}#procedure`,
    name: service.title,
    description: stripSchemaText(service.description, 500),
    url,
    relevantSpecialty: medicalSpecialtyUrl(service.department),
    ...(howPerformed ? { howPerformed } : {}),
    provider: { '@id': organizationId(site) },
  };
}

export function buildPhysicianSchema(
  site: URL,
  doctor: Doctor & { specialtyLabel?: string },
  locale: Locale = 'ar',
): JsonLd {
  const path = localizedPath(`/doctors/${doctor.id}`, locale);
  const url = absoluteUrl(site, path);
  const specialtyLabel = doctor.specialtyLabel ?? localizeSpecialty(doctor.specialty, locale);
  return {
    '@type': 'Physician',
    '@id': `${url}#physician`,
    name: doctor.name,
    description: doctor.summary,
    url,
    image: absoluteUrl(site, doctor.image),
    jobTitle: doctor.seoRole || doctor.title,
    medicalSpecialty: medicalSpecialtyUrl(doctor.specialty),
    worksFor: { '@id': organizationId(site) },
    hospitalAffiliation: { '@id': organizationId(site) },
    knowsAbout: [
      specialtyLabel,
      ...doctor.sections.flatMap((section) => section.listItems ?? []),
    ],
    availableService: doctor.services.map((serviceName) => ({
      '@type': 'MedicalProcedure',
      name: localizeDoctorService(serviceName, locale),
    })),
    ...(doctor.experienceYears != null
      ? {
          additionalProperty: {
            '@type': 'PropertyValue',
            name: 'yearsOfExperience',
            value: doctor.experienceYears,
          },
        }
      : {}),
  };
}

export function buildItemListSchema(options: {
  site: URL;
  path: string;
  name: string;
  description: string;
  items: readonly { name: string; path: string; description?: string; image?: string }[];
  itemType: string;
  locale?: Locale;
  /** 1-based position of the first item. Used by paginated blog lists. */
  startPosition?: number;
}): JsonLd {
  const start = options.startPosition ?? 1;
  return {
    '@type': 'ItemList',
    '@id': itemListId(options.site, options.path),
    name: options.name,
    description: stripSchemaText(options.description, 300),
    inLanguage: schemaLanguage(options.locale ?? 'ar'),
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: start + index,
      name: stripSchemaText(item.name, 110),
      url: absoluteUrl(options.site, item.path),
      item: {
        '@type': options.itemType,
        name: item.name,
        ...(item.description ? { description: stripSchemaText(item.description, 500) } : {}),
        url: absoluteUrl(options.site, item.path),
        ...(item.image ? { image: absoluteUrl(options.site, item.image) } : {}),
      },
    })),
  };
}

export function buildGraph(site: URL, nodes: JsonLd[], locale: Locale = 'ar'): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationSchema(site, locale),
      buildWebsiteSchema(site, locale),
      ...nodes,
    ],
  };
}
