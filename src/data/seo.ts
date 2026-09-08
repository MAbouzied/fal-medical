import { clinicFacts } from './clinic-facts.ts';

/** Default Open Graph / Twitter social card (landscape preview). */
export const socialCard = {
  path: '/assets/social-card.png',
  width: 1536,
  height: 1024,
  type: 'image/png',
  altAr: 'مجمع عيادات فال الطبية — عيادة متعددة التخصصات في حفر الباطن',
  altEn: 'Fal Clinic — multi-specialty medical complex in Hafar Al Batin',
} as const;

/** Replace with the official Fal Google Maps pin before launch. */
export const clinicGeo = {
  latitude: 28.4089,
  longitude: 45.9658,
} as const;

const clinicMapQuery = encodeURIComponent(
  `${clinicFacts.nameAr} ${clinicFacts.districtAr} ${clinicFacts.cityAr}`,
);

export const clinicMapUrl = `https://www.google.com/maps/search/?api=1&query=${clinicMapQuery}`;

/** CSP-safe embed host (www.google.com). Do not use maps.google.com — blocked by frame-src. */
export function clinicMapEmbedUrl(locale: 'ar' | 'en' = 'ar'): string {
  const hl = locale === 'en' ? 'en' : 'ar';
  const { latitude, longitude } = clinicGeo;
  return `https://www.google.com/maps?q=${latitude},${longitude}&hl=${hl}&z=16&output=embed`;
}

export function imageMimeType(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  return 'image/jpeg';
}
