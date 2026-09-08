export interface ClinicDevice {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
}

export const clinicDevices: readonly ClinicDevice[] = [
  {
    id: 'hydra-beauty',
    name: 'جهاز Hydra Beauty Skin System',
    description: 'جهاز هيدرافيشل متعدد الوظائف لتنظيف البشرة وتقشرها واستخلاص الشوائب وترطيبها في جلسة واحدة.',
    image: '/assets/devices/hydra-beauty.jpg',
    imageAlt: 'جهاز Hydra Beauty Skin System لتنظيف البشرة داخل عيادة فال',
  },
  {
    id: 'candela-gentlemax-pro',
    name: 'جهاز Candela GentleMax Pro+',
    description: 'ليزر ثنائي الطول الموجي لإزالة الشعر وعلاج التصبغات والآفات الوعائية لمختلف أنواع البشرة.',
    image: '/assets/devices/candela-gentlemax-pro.jpg',
    imageAlt: 'جهاز Candela GentleMax Pro+ لإزالة الشعر بالليزر داخل عيادة فال',
  },
  {
    id: 'queen-co2',
    name: 'جهاز Queen RF CO2 Fractional Laser',
    description: 'ليزر ثاني أكسيد الكربون الجزئي لتجديد سطح البشرة وعلاج الندبات وتحسين ملمس الجلد.',
    image: '/assets/devices/queen-co2.jpg',
    imageAlt: 'جهاز Queen RF CO2 Fractional Laser لتجديد البشرة داخل عيادة فال',
  },
  {
    id: 'lutronic-spectra-xt',
    name: 'جهاز Lutronic Spectra XT',
    description: 'ليزر كيوسويتشد لعلاج التصبغات وتجديد البشرة وإزالة الوشم بأطوال موجية متعددة.',
    image: '/assets/devices/lutronic-spectra-xt.jpg',
    imageAlt: 'جهاز Lutronic Spectra XT لعلاج التصبغات داخل عيادة فال',
  },
  {
    id: 'dental-treatment-unit',
    name: 'وحدة علاج الأسنان',
    description: 'كرسي علاج متكامل مع إضاءة طبية ووحدة أدوات للفحص والإجراءات اليومية.',
    image: '/assets/devices/dental-treatment-unit.jpg',
    imageAlt: 'وحدة علاج أسنان داخل مجمع عيادات فال بحفر الباطن',
  },
  {
    id: 'intraoral-camera',
    name: 'كاميرا الأسنان داخل الفم',
    description: 'تصوير مباشر داخل الفم لتشخيص أدق وشرح الحالة للمريض أثناء الجلسة.',
    image: '/assets/devices/intraoral-camera.jpg',
    imageAlt: 'كاميرا أسنان داخل الفم مع شاشة عرض في عيادة فال',
  },
] as const;
