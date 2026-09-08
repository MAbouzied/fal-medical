import {
  clinicCity,
  clinicFacts,
  formatClinicDescription,
  formatClinicStreetAddress,
} from './clinic-facts.ts';
import { clinicContact, clinicLines } from './contact.ts';
import { clinicServices } from './services.ts';

export const organization = {
  name: clinicFacts.nameAr,
  alternateName: clinicFacts.nameEn,
  legalName: clinicFacts.nameAr,
  description: formatClinicDescription('ar'),
  email: clinicContact.email,
  /** Both clinic lines for Schema.org `telephone` (Text or array of Text). */
  telephone: clinicLines.map((line) => `+${line.number}`),
  contactLines: clinicLines.map((line) => ({
    id: line.id,
    telephone: `+${line.number}`,
    whatsappUrl: `https://wa.me/${line.number}`,
    labelAr: line.labelAr,
    labelEn: line.labelEn,
    departmentAr: line.departmentAr,
  })),
  logoPath: '/assets/logo.png',
  imagePath: '/assets/landing-hero.jpg',
  addressCountry: 'SA',
  addressRegion: clinicFacts.regionAr,
  addressLocality: clinicCity('ar'),
  streetAddress: formatClinicStreetAddress('ar'),
  postalCode: clinicFacts.postalCode,
  openingHours: clinicFacts.openingHours,
  medicalSpecialties: [
    'Dentistry',
    'Dermatology',
    'CosmeticSurgery',
    'DietNutrition',
    'Obstetric',
  ] as const,
  serviceCatalog: clinicServices.map((service) => ({
    id: service.id,
    name: service.title,
    description: service.description,
  })),
} as const;
