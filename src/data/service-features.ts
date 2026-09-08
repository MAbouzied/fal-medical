import type { Locale } from '../lib/i18n/localize.ts';

export interface ServiceFeatureBlock {
  id: 'dentistry' | 'skin' | 'laser';
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  bulletsAr: readonly string[];
  bulletsEn: readonly string[];
  imageSrc: string;
  imageAltAr: string;
  imageAltEn: string;
  imageStart: boolean;
}

export interface ResolvedServiceFeature {
  id: ServiceFeatureBlock['id'];
  badge: string;
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  imageStart: boolean;
  bullets: readonly string[];
}

export const serviceFeatureBlocks: readonly ServiceFeatureBlock[] = [
  {
    id: 'dentistry',
    badgeAr: 'طب الأسنان',
    badgeEn: 'Dentistry',
    titleAr: 'ابتسامة تغيّر كل شيء',
    titleEn: 'A smile that changes everything',
    textAr: 'من التبييض الفوري إلى الزراعة وتصميم الابتسامة، نستخدم أنظمة عالمية معتمدة لنتائج دقيقة تدوم.',
    textEn: 'From instant whitening to implants and smile design, we use certified systems for precise results that last.',
    bulletsAr: ['تبييض الاسنان بالليزر', 'زراعة الاسنان الفورية', 'تقويم الاسنان الشفاف'],
    bulletsEn: ['Laser teeth whitening', 'Immediate dental implants', 'Clear aligners'],
    imageSrc: '/assets/services/dentistry.jpg',
    imageAltAr: 'غرفة علاج أسنان حديثة داخل عيادة فال',
    imageAltEn: 'Modern dental treatment room at Fal Clinic',
    imageStart: false,
  },
  {
    id: 'skin',
    badgeAr: 'الجلدية والتجميل',
    badgeEn: 'Dermatology & aesthetics',
    titleAr: 'نضارة تدوم بلمسات احترافية',
    titleEn: 'Lasting glow with professional care',
    textAr: 'نعتمد أفضل التقنيات الحديثة لعلاج كافة مشاكل البشرة وإعادة الشباب والحيوية لها بأساليب طبية آمنة.',
    textEn: 'We use modern techniques to treat skin concerns and restore a fresh, youthful look with safe medical methods.',
    bulletsAr: ['تنظيف البشرة العميق (هايدرافيشيل)', 'علاج التصبغات وآثار الحبوب'],
    bulletsEn: ['Deep skin cleaning (HydraFacial)', 'Pigmentation and acne-mark treatment'],
    imageSrc: '/assets/services/dermatology.jpg',
    imageAltAr: 'غرفة عناية بالبشرة داخل عيادة فال',
    imageAltEn: 'Skin care room at Fal Clinic',
    imageStart: true,
  },
  {
    id: 'laser',
    badgeAr: 'الليزر',
    badgeEn: 'Laser',
    titleAr: 'نعومة تدوم وراحة أكبر',
    titleEn: 'Lasting smoothness and more comfort',
    textAr: 'أجهزة ليزر مبرّدة مناسبة لجميع أنواع البشرة، بجلسات أسرع وأقل ألمًا وبإشراف فني متخصص.',
    textEn: 'Cooled laser devices suitable for all skin types, with faster, more comfortable sessions under specialist supervision.',
    bulletsAr: ['جلسات آمنة للبشرة الحساسة', 'علاج الشعر تحت الجلد'],
    bulletsEn: ['Safe sessions for sensitive skin', 'Ingrown hair treatment'],
    imageSrc: '/assets/services/laser.jpg',
    imageAltAr: 'جهاز ليزر كانديلا داخل عيادة فال',
    imageAltEn: 'Candela laser device at Fal Clinic',
    imageStart: false,
  },
];

export function resolveServiceFeatureBlocks(locale: Locale = 'ar'): ResolvedServiceFeature[] {
  const en = locale === 'en';
  return serviceFeatureBlocks.map((block) => ({
    id: block.id,
    badge: en ? block.badgeEn : block.badgeAr,
    title: en ? block.titleEn : block.titleAr,
    text: en ? block.textEn : block.textAr,
    imageSrc: block.imageSrc,
    imageAlt: en ? block.imageAltEn : block.imageAltAr,
    imageStart: block.imageStart,
    bullets: en ? block.bulletsEn : block.bulletsAr,
  }));
}
