export const clinicGalleryDepartments = ['أسنان', 'جلدية'] as const;

export type ClinicGalleryDepartment = (typeof clinicGalleryDepartments)[number];

export interface ClinicGallerySlide {
  id: string;
  src: string;
  department: ClinicGalleryDepartment;
  captionAr: string;
  captionEn: string;
  altAr: string;
  altEn: string;
}

/** Interior photos from Fal Clinic in Hafar Al Batin. */
export const clinicGallerySlides: readonly ClinicGallerySlide[] = [
  {
    id: 'reception',
    src: '/assets/landing-clinic-gallery.jpg',
    department: 'أسنان',
    captionAr: 'الاستقبال',
    captionEn: 'Reception',
    altAr: 'استقبال مجمع عيادات فال الطبية في حفر الباطن',
    altEn: 'Fal Clinic reception in Hafar Al Batin',
  },
  {
    id: 'waiting',
    src: '/assets/landing-waiting-area.jpg',
    department: 'أسنان',
    captionAr: 'منطقة الانتظار',
    captionEn: 'Waiting area',
    altAr: 'منطقة انتظار المرضى داخل مجمع عيادات فال',
    altEn: 'Patient waiting area at Fal Clinic',
  },
  {
    id: 'dental-operatory',
    src: '/assets/landing-hero.jpg',
    department: 'أسنان',
    captionAr: 'عيادة الأسنان',
    captionEn: 'Dental clinic',
    altAr: 'غرفة علاج أسنان مضيئة داخل عيادة فال',
    altEn: 'Bright dental treatment room at Fal Clinic',
  },
  {
    id: 'dental-unit',
    src: '/assets/devices/dental-treatment-unit.jpg',
    department: 'أسنان',
    captionAr: 'عيادة الأسنان',
    captionEn: 'Dental clinic',
    altAr: 'كرسي علاج أسنان داخل غرفة علاجية في فال',
    altEn: 'Dental treatment chair inside a Fal Clinic room',
  },
  {
    id: 'skin-room',
    src: '/assets/landing/about.jpg',
    department: 'جلدية',
    captionAr: 'عيادة البشرة',
    captionEn: 'Skin clinic',
    altAr: 'غرفة عناية بالبشرة داخل عيادة فال',
    altEn: 'Skin treatment room at Fal Clinic',
  },
  {
    id: 'laser-room',
    src: '/assets/landing/hero.jpg',
    department: 'جلدية',
    captionAr: 'عيادة الليزر',
    captionEn: 'Laser clinic',
    altAr: 'غرفة ليزر بجهاز كانديلا داخل عيادة فال',
    altEn: 'Laser room with a Candela device at Fal Clinic',
  },
];
