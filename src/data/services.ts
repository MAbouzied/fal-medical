import type { Specialty } from './doctors';

export const serviceDepartments = ['كل الخدمات', 'أسنان', 'جلدية'] as const;

export type ServiceDepartment = (typeof serviceDepartments)[number];

export const homeServiceDepartments = ['أسنان', 'جلدية'] as const;

export const serviceCategories = ['كل الخدمات', 'تجميل', 'علاج وجراحة', 'تركيبات وتشخيص'] as const;

export type ServiceCategory = (typeof serviceCategories)[number];

export interface ServiceDetailSection {
  title: string;
  paragraphs?: readonly string[];
  listIntro?: string;
  listItems?: readonly string[];
}

export interface ClinicService {
  id: string;
  title: string;
  description: string;
  category: Exclude<ServiceCategory, 'كل الخدمات'>;
  department: Exclude<ServiceDepartment, 'كل الخدمات'>;
  icon: string;
  heroImage: string;
  heroImageAlt: string;
  doctorSpecialty: Exclude<Specialty, 'كل الأطباء'>;
  sections: readonly ServiceDetailSection[];
}

const dentalHero = '/assets/landing-hero.jpg';
const dentalHeroAlt = 'غرفة علاج أسنان حديثة داخل عيادة فال';
const dentistrySpecialty = 'طب وتجميل الأسنان' as const;
const dermHero = '/assets/landing/about.jpg';
const dermHeroAlt = 'غرفة عناية بالبشرة داخل عيادة فال';

export const clinicServices: readonly ClinicService[] = [
  {
    id: 'dental-implants',
    title: 'زراعة الأسنان',
    description: 'استعادة الأسنان المفقودة بزراعة آمنة ومظهر طبيعي.',
    category: 'علاج وجراحة',
    department: 'أسنان',
    icon: '/assets/service-implants.svg',
    heroImage: dentalHero,
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'ما هي زراعة الأسنان؟',
        paragraphs: [
          'زراعة الأسنان حل دائم لتعويض الأسنان المفقودة، يعتمد على تقييم دقيق لعظم الفك ثم وضع غرسة تتوافق مع ابتسامتك وعضّتك.',
        ],
      },
      {
        title: 'خطوات العلاج',
        listIntro: 'نسير معك بخطوات واضحة من التقييم حتى النتيجة النهائية:',
        listItems: [
          'فحص وأشعة لتحديد جاهزية عظم الفك.',
          'وضع الغرسة وفق خطة علاجية مخصصة.',
          'تركيب التاج النهائي ومتابعة الالتئام.',
        ],
      },
    ],
  },
  {
    id: 'dental-prosthetics',
    title: 'تركيبات الأسنان',
    description: 'تيجان وجسور وتركيبات تعيد الوظيفة والمظهر الطبيعي.',
    category: 'تركيبات وتشخيص',
    department: 'أسنان',
    icon: '/assets/service-prosthetics.svg',
    heroImage: '/assets/landing-clinic-gallery.jpg',
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'تركيبات تناسب حالتك',
        paragraphs: [
          'نقدم تيجانًا وجسورًا وتركيبات ثابتة أو متحركة بعد تقييم دقيق لحالة الأسنان واللثة، مع الحرص على الراحة والمظهر الطبيعي.',
        ],
      },
      {
        title: 'متى تحتاج إلى تركيبات؟',
        listItems: [
          'تعويض سن مفقود أو متضرر بشدة.',
          'حماية الأسنان بعد علاج العصب.',
          'تحسين شكل الابتسامة ووظيفة المضغ.',
        ],
      },
    ],
  },
  {
    id: 'dental-veneers',
    title: 'عدسات الأسنان',
    description: 'عدسات رقيقة لتحسين شكل ولون الأسنان بمظهر طبيعي.',
    category: 'تركيبات وتشخيص',
    department: 'أسنان',
    icon: '/assets/service-prosthetics.svg',
    heroImage: '/assets/landing-clinic-gallery.jpg',
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'ابتسامة متناسقة بعدسات مخصصة',
        paragraphs: [
          'عدسات الأسنان تغطي السطح الأمامي لتحسين اللون والشكل والمحاذاة الظاهرة، بعد تقييم صحة الأسنان واللثة ومدى ملاءمة الحالة.',
        ],
      },
      {
        title: 'خطوات العلاج',
        listItems: [
          'فحص لتحديد جاهزية الأسنان للعدسات.',
          'اختيار الشكل واللون المناسب لابتسامتك.',
          'تركيب العدسات ومتابعة النتيجة النهائية.',
        ],
      },
    ],
  },
  {
    id: 'teeth-whitening',
    title: 'تبييض الأسنان',
    description: 'تبييض طبي آمن لتفتيح لون الأسنان بإشراف مختص.',
    category: 'تجميل',
    department: 'أسنان',
    icon: '/assets/service-whitening.svg',
    heroImage: '/assets/devices/dental-treatment-unit.jpg',
    heroImageAlt: 'وحدة علاج أسنان داخل عيادة فال',
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'ابتسامة أكثر إشراقًا',
        paragraphs: [
          'جلسات التبييض لدينا تتم بتقييم لون الأسنان وصحة اللثة أولاً، ثم اختيار الطريقة المناسبة للحصول على نتيجة طبيعية وآمنة.',
        ],
      },
      {
        title: 'قبل التبييض',
        listItems: [
          'فحص الأسنان واللثة للتأكد من جاهزيتها.',
          'تحديد درجة التبييض المناسبة لحالتك.',
          'إرشادات للعناية بعد الجلسة للحفاظ على النتيجة.',
        ],
      },
    ],
  },
  {
    id: 'cleaning-polishing',
    title: 'تنظيف وتلميع الأسنان',
    description: 'إزالة الجير والبقع والحفاظ على صحة الفم واللثة.',
    category: 'تجميل',
    department: 'أسنان',
    icon: '/assets/service-cleaning.svg',
    heroImage: '/assets/devices/dental-treatment-unit.jpg',
    heroImageAlt: 'كرسي علاج أسنان داخل غرفة علاجية في فال',
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'عناية وقائية أساسية',
        paragraphs: [
          'تنظيف وتلميع الأسنان يزيل الجير والتصبغات السطحية ويساعد على الوقاية من التهاب اللثة وتسوس الأسنان.',
        ],
      },
      {
        title: 'ماذا تشمل الجلسة؟',
        listItems: [
          'إزالة الجير والترسبات.',
          'تلميع سطح الأسنان.',
          'نصائح للعناية اليومية بالمنزل.',
        ],
      },
    ],
  },
  {
    id: 'tooth-extraction',
    title: 'الخلع (جراحي وعادي)',
    description: 'خلع آمن للأسنان مع تقييم مسبق وخطة تعافٍ واضحة.',
    category: 'علاج وجراحة',
    department: 'أسنان',
    icon: '/assets/service-extraction.svg',
    heroImage: dentalHero,
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'خلع عادي أو جراحي حسب الحالة',
        paragraphs: [
          'نحدد نوع الخلع بعد الفحص والأشعة، مع شرح الخطوات وتعليمات ما بعد الخلع لضمان تعافٍ مريح وآمن.',
        ],
      },
      {
        title: 'بعد الخلع',
        listItems: [
          'تعليمات واضحة للعناية بالجرح.',
          'متابعة عند الحاجة للاطمئنان على الالتئام.',
          'خيارات لتعويض السن عند مناسبة الحالة.',
        ],
      },
    ],
  },
  {
    id: 'root-canal',
    title: 'حشوات العصب',
    description: 'علاج عصب دقيق لإنقاذ السن وتخفيف الألم.',
    category: 'علاج وجراحة',
    department: 'أسنان',
    icon: '/assets/service-root-canal.svg',
    heroImage: '/assets/landing-hero.jpg',
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'علاج العصب بأمان',
        paragraphs: [
          'حشوة العصب تهدف إلى إزالة الالتهاب والحفاظ على السن، مع تخدير مناسب وخطة ترميم بعد العلاج.',
        ],
      },
      {
        title: 'علامات قد تستدعي علاج العصب',
        listItems: [
          'ألم مستمر أو حساسية شديدة.',
          'تورم أو التهاب حول السن.',
          'تسوس عميق وصل إلى العصب.',
        ],
      },
    ],
  },
  {
    id: 'cosmetic-fillings',
    title: 'الحشوات التجميلية',
    description: 'حشوات بلون الأسنان لعلاج التسوس بمظهر طبيعي.',
    category: 'تجميل',
    department: 'أسنان',
    icon: '/assets/service-fillings.svg',
    heroImage: '/assets/devices/intraoral-camera.jpg',
    heroImageAlt: 'كاميرا أسنان داخل الفم في عيادة فال',
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'ترميم بمظهر طبيعي',
        paragraphs: [
          'الحشوات التجميلية تعالج التسوس أو الكسور الصغيرة مع مطابقة لون السن، للحفاظ على الوظيفة والمظهر معًا.',
        ],
      },
      {
        title: 'مميزات الحشوة التجميلية',
        listItems: [
          'لون قريب من لون الأسنان الطبيعية.',
          'ترميم محافظ يبقي أكبر قدر من بنية السن.',
          'نتيجة فورية في جلسة واحدة غالبًا.',
        ],
      },
    ],
  },
  {
    id: 'gum-contouring',
    title: 'قص اللثة (جراحي وليزر)',
    description: 'إعادة تشكيل خط اللثة جراحيًا أو بالليزر لمظهر متناسق.',
    category: 'علاج وجراحة',
    department: 'أسنان',
    icon: '/assets/service-gum-contour.svg',
    heroImage: '/assets/devices/dental-treatment-unit.jpg',
    heroImageAlt: 'وحدة علاج أسنان داخل عيادة فال',
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'خط لثة أكثر تناسقًا',
        paragraphs: [
          'قص اللثة يساعد على تحسين مظهر الابتسامة وعلاج بعض مشكلات اللثة، ويُختار الأسلوب الجراحي أو الليزري حسب تقييم الطبيب.',
        ],
      },
      {
        title: 'قبل الإجراء',
        listItems: [
          'تقييم صحة اللثة وخط الابتسامة.',
          'اختيار التقنية الأنسب لحالتك.',
          'شرح التوقعات وتعليمات ما بعد الجلسة.',
        ],
      },
    ],
  },
  {
    id: 'gum-depigmentation',
    title: 'توريد اللثة بالليزر',
    description: 'تفتيح لون اللثة الداكنة بتقنية ليزر طبية.',
    category: 'تجميل',
    department: 'أسنان',
    icon: '/assets/service-gum-laser.svg',
    heroImage: '/assets/devices/dental-treatment-unit.jpg',
    heroImageAlt: 'وحدة علاج أسنان داخل عيادة فال',
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'لثة بمظهر وردي طبيعي',
        paragraphs: [
          'توريد اللثة بالليزر يستهدف التصبغات الداكنة لتحسين مظهر الابتسامة، بعد تقييم سبب التصبغ ومدى ملاءمة الحالة للإجراء.',
        ],
      },
      {
        title: 'ما تتوقعه',
        listItems: [
          'جلسة تقييم لتحديد سبب التصبغ.',
          'إجراء ليزري مضبوط وفق حالة اللثة.',
          'إرشادات للعناية خلال فترة التعافي.',
        ],
      },
    ],
  },
  {
    id: 'dental-xray-3d',
    title: 'أشعة الأسنان 3D',
    description: 'تصوير ثلاثي الأبعاد لتشخيص أدق وخطط علاجية أوضح.',
    category: 'تركيبات وتشخيص',
    department: 'أسنان',
    icon: '/assets/service-xray-3d.svg',
    heroImage: '/assets/landing-clinic-gallery.jpg',
    heroImageAlt: dentalHeroAlt,
    doctorSpecialty: dentistrySpecialty,
    sections: [
      {
        title: 'تشخيص أوضح بتقنية ثلاثية الأبعاد',
        paragraphs: [
          'أشعة الأسنان ثلاثية الأبعاد تساعد على تقييم العظم والجذور ومواقع الزراعة بدقة أعلى قبل بدء الخطة العلاجية.',
        ],
      },
      {
        title: 'متى تُطلب أشعة 3D؟',
        listItems: [
          'قبل زراعة الأسنان.',
          'في حالات الجراحة أو الخلع المعقد.',
          'عند الحاجة لتقييم تفصيلي لبنية الفك والأسنان.',
        ],
      },
    ],
  },
  {
    id: 'laser',
    title: 'الليزر',
    description: 'جلسات ليزر طبية لتقييم البشرة وإزالة الشعر أو علاج المشكلات الجلدية المناسبة.',
    category: 'تجميل',
    department: 'جلدية',
    icon: '/assets/service-laser.svg',
    heroImage: '/assets/devices/candela-gentlemax-pro.jpg',
    heroImageAlt: 'جهاز Candela GentleMax Pro+ داخل عيادة فال',
    doctorSpecialty: 'الأمراض الجلدية والتجميل',
    sections: [
      {
        title: 'ليزر طبي بعد تقييم الحالة',
        paragraphs: [
          'نبدأ بفحص البشرة لتحديد نوع الليزر المناسب، ثم نشرح عدد الجلسات المتوقع وتعليمات العناية بعدها.',
        ],
      },
      {
        title: 'ما تشمله الخدمة',
        listItems: [
          'تقييم نوع البشرة ومدى ملاءمة الليزر.',
          'خطة جلسات واضحة حسب الهدف العلاجي.',
          'إرشادات قبل الجلسة وبعدها للحفاظ على النتيجة.',
        ],
      },
    ],
  },
  {
    id: 'filler-botox',
    title: 'الفيلر والبوتوكس',
    description: 'حقن فيلر وبوتوكس طبية لتحسين ملامح الوجه بمظهر طبيعي.',
    category: 'تجميل',
    department: 'جلدية',
    icon: '/assets/service-dermatology.svg',
    heroImage: dermHero,
    heroImageAlt: dermHeroAlt,
    doctorSpecialty: 'الأمراض الجلدية والتجميل',
    sections: [
      {
        title: 'تجميل طبي بمظهر متوازن',
        paragraphs: [
          'نقيّم ملامح الوجه واحتياجك أولاً، ثم نحدد إن كان الفيلر أو البوتوكس أو الجمع بينهما هو الأنسب.',
        ],
      },
      {
        title: 'قبل الجلسة',
        listItems: [
          'استشارة لتوضيح الهدف والنتيجة المتوقعة.',
          'اختيار المناطق المناسبة حسب التقييم الطبي.',
          'شرح العناية بعد الحقن وموعد المتابعة إن لزم.',
        ],
      },
    ],
  },
  {
    id: 'body-contouring',
    title: 'النحت',
    description: 'جلسات نحت وإذابة الدهون غير الجراحية لتحسين شكل الجسم بعد التقييم الطبي.',
    category: 'تجميل',
    department: 'جلدية',
    icon: '/assets/service-dermatology.svg',
    heroImage: dermHero,
    heroImageAlt: dermHeroAlt,
    doctorSpecialty: 'الأمراض الجلدية والتجميل',
    sections: [
      {
        title: 'نحت الجسم بخطة واضحة',
        paragraphs: [
          'نحدد مناطق التركيز بعد التقييم، ثم نضع خطة جلسات تناسب هدفك مع توقعات واقعية للنتيجة.',
        ],
      },
      {
        title: 'ما تتوقعه',
        listItems: [
          'تقييم طبي لمناطق النحت أو الإذابة.',
          'شرح التقنية وعدد الجلسات التقريبي.',
          'نصائح للعناية والمتابعة بعد الجلسات.',
        ],
      },
    ],
  },
  {
    id: 'hydrafacial',
    title: 'تنظيف البشرة الهيدرافيشل',
    description: 'تنظيف عميق للبشرة بتقنية الهيدرافيشل لتنقية المسام ونضارة فورية.',
    category: 'تجميل',
    department: 'جلدية',
    icon: '/assets/service-dermatology.svg',
    heroImage: '/assets/devices/hydra-beauty.jpg',
    heroImageAlt: 'جهاز Hydra Beauty لتنظيف البشرة داخل عيادة فال',
    doctorSpecialty: 'الأمراض الجلدية والتجميل',
    sections: [
      {
        title: 'تنظيف عميق بلطف',
        paragraphs: [
          'جلسة الهيدرافيشل تنظّف المسام وترطّب البشرة بعد تقييم نوعها، لتظهر أكثر نضارة دون تقشير عنيف.',
        ],
      },
      {
        title: 'ماذا تشمل الجلسة؟',
        listItems: [
          'تقييم نوع البشرة قبل التنظيف.',
          'تنظيف عميق وترطيب أثناء الجلسة.',
          'إرشادات بسيطة للعناية في اليوم نفسه.',
        ],
      },
    ],
  },
];

export function serviceSectionPath(serviceId: string, locale: 'ar' | 'en' = 'ar'): string {
  return locale === 'en' ? `/en/services/${serviceId}` : `/services/${serviceId}`;
}

export function getServiceById(id: string): ClinicService | undefined {
  return clinicServices.find((service) => service.id === id);
}

export const serviceDepartmentSlugs = {
  'كل الخدمات': 'all',
  أسنان: 'dentistry',
  جلدية: 'skin',
} as const;

export function serviceDepartmentFromSlug(value: string | null | undefined): ServiceDepartment | undefined {
  if (!value) return undefined;
  const slug = value.trim().replace(/^#/, '').toLowerCase();
  if (slug === 'all' || slug === 'all-services') return 'كل الخدمات';
  if (slug === 'dentistry' || slug === 'dental') return 'أسنان';
  if (slug === 'skin' || slug === 'dermatology') return 'جلدية';
  return undefined;
}

export function servicesCatalogPath(
  department: ServiceDepartment = 'كل الخدمات',
  locale: 'ar' | 'en' = 'ar',
): string {
  const base = locale === 'en' ? '/en/services' : '/services';
  if (department === 'كل الخدمات') return `${base}#all-services`;
  return `${base}?department=${serviceDepartmentSlugs[department]}#all-services`;
}
