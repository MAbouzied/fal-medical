import type { ImageMetadata } from 'astro';
import doctorHanan from '../assets/images/doctor-hanan.jpg';
import doctorNibraj from '../assets/images/doctor-nibraj.jpg';
import doctorTahhan from '../assets/images/doctor-tahhan.jpg';
import candelaGentlemaxPro from '../assets/images/devices/candela-gentlemax-pro.jpg';
import dentalTreatmentUnit from '../assets/images/devices/dental-treatment-unit.jpg';
import hydraBeauty from '../assets/images/devices/hydra-beauty.jpg';
import intraoralCamera from '../assets/images/devices/intraoral-camera.jpg';
import lutronicSpectraXt from '../assets/images/devices/lutronic-spectra-xt.jpg';
import queenCo2 from '../assets/images/devices/queen-co2.jpg';
import landingAbout from '../assets/images/landing/about.jpg';
import landingPageHero from '../assets/images/landing/hero.jpg';
import landingOffer from '../assets/images/landing/offer.png';
import landingClinicGallery from '../assets/images/landing-clinic-gallery.jpg';
import landingHero from '../assets/images/landing-hero.jpg';
import landingWaitingArea from '../assets/images/landing-waiting-area.jpg';
import commercialRegistration from '../assets/images/licenses/commercial-registration.png';

/**
 * Canonical raster assets for the Astro image pipeline.
 * Exact duplicates share one imported file.
 */
export const siteImages = {
  landingHero,
  landingPageHero,
  landingAbout,
  landingFeatured: landingHero,
  landingOffer,
  landingClinicGallery,
  landingWaitingArea,
  servicesDentistry: dentalTreatmentUnit,
  servicesDermatology: landingAbout,
  servicesLaser: landingPageHero,
  doctorHanan,
  doctorNibraj,
  doctorTahhan,
  hydraBeauty,
  candelaGentlemaxPro,
  queenCo2,
  lutronicSpectraXt,
  dentalTreatmentUnit,
  intraoralCamera,
  commercialRegistration,
} as const satisfies Record<string, ImageMetadata>;

export type SiteImageKey = keyof typeof siteImages;

const publicPathToKey: Record<string, SiteImageKey> = {
  '/assets/landing-hero.jpg': 'landingHero',
  '/assets/landing/hero.jpg': 'landingPageHero',
  '/assets/landing/about.jpg': 'landingAbout',
  '/assets/landing/featured.jpg': 'landingFeatured',
  '/assets/landing/offer.png': 'landingOffer',
  '/assets/services/dentistry.jpg': 'servicesDentistry',
  '/assets/services/dermatology.jpg': 'servicesDermatology',
  '/assets/services/laser.jpg': 'servicesLaser',
  '/assets/service-detail-dentistry.jpg': 'landingHero',
  '/assets/landing-clinic-gallery.jpg': 'landingClinicGallery',
  '/assets/landing-waiting-area.jpg': 'landingWaitingArea',
  '/assets/landing-blog-dental.jpg': 'dentalTreatmentUnit',
  '/assets/landing-blog-laser.jpg': 'candelaGentlemaxPro',
  '/assets/landing-blog-skin.jpg': 'hydraBeauty',
  '/assets/doctor-hanan.jpg': 'doctorHanan',
  '/assets/doctor-nibraj.jpg': 'doctorNibraj',
  '/assets/doctor-tahhan.jpg': 'doctorTahhan',
  '/assets/devices/hydra-beauty.jpg': 'hydraBeauty',
  '/assets/devices/candela-gentlemax-pro.jpg': 'candelaGentlemaxPro',
  '/assets/devices/queen-co2.jpg': 'queenCo2',
  '/assets/devices/lutronic-spectra-xt.jpg': 'lutronicSpectraXt',
  '/assets/devices/dental-treatment-unit.jpg': 'dentalTreatmentUnit',
  '/assets/devices/intraoral-camera.jpg': 'intraoralCamera',
  '/assets/licenses/commercial-registration.png': 'commercialRegistration',
};

export function resolveSiteImage(path: string): ImageMetadata | null {
  const key = publicPathToKey[path];
  return key ? siteImages[key] : null;
}
