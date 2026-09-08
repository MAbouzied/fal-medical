import { clinicFacts } from './clinic-facts.ts';

export const specialties = [
  'كل الأطباء',
  'طب وتجميل الأسنان',
  'الأمراض الجلدية والتجميل',
  'خدمات الليزر',
  'التغذية',
  'النساء والولادة',
  'العلاج الطبيعي',
] as const;

export const branches = [clinicFacts.cityAr] as const;
export const services = ['استشارة', 'جلسة علاج', 'متابعة'] as const;

export type Specialty = (typeof specialties)[number];
export type Branch = (typeof branches)[number];
export type Service = (typeof services)[number];

export interface DoctorProfileSection {
  title: string;
  paragraphs?: readonly string[];
  listItems?: readonly string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  /** SEO-oriented role used in titles/JSON-LD when distinct from short card title. */
  seoRole: string;
  specialty: Exclude<Specialty, 'كل الأطباء'>;
  branch: Branch;
  services: readonly Service[];
  image: string;
  summary: string;
  experienceYears?: number;
  sections: readonly DoctorProfileSection[];
}

export const doctors: readonly Doctor[] = [
  {
    id: 'mohamed-tahhan',
    name: 'د. محمد الطحان',
    title: 'أخصائي تقويم وتجميل الأسنان',
    seoRole: 'أخصائي تقويم وتجميل الأسنان في مجمع عيادات فال الطبية بحفر الباطن',
    specialty: 'طب وتجميل الأسنان',
    branch: clinicFacts.cityAr,
    services: ['استشارة', 'جلسة علاج', 'متابعة'],
    image: '/assets/doctor-tahhan.jpg',
    summary:
      'أخصائي تقويم وتجميل الأسنان يقدّم خطط تقويم واضحة، بما في ذلك التقويم الشفاف، مع متابعة منتظمة لنتيجة طبيعية.',
    experienceYears: 17,
    sections: [
      {
        title: 'نبذة',
        paragraphs: [
          'د. محمد الطحان أخصائي في طب وجراحة الفم والأسنان، وتقويم وتجميل الأسنان، وحاصل على ماجستير تقويم الأسنان من النمسا.',
        ],
      },
      {
        title: 'مجالات التركيز',
        listItems: [
          'تقويم الأسنان والتقويم الشفاف',
          'تجميل الأسنان وتصميم الابتسامة',
          'طب الفم وأمراض اللثة والتشخيص',
        ],
      },
      {
        title: 'أسلوب الرعاية',
        paragraphs: [
          'يبدأ كل حالة بتقييم طبي مفصل، ثم يشرح خيارات التقويم والعلاج بلغة واضحة قبل الاتفاق على الخطة.',
        ],
      },
    ],
  },
  {
    id: 'nibraj',
    name: 'الدكتور نبراج',
    title: 'طبيب أسنان',
    seoRole: 'طبيب أسنان في مجمع عيادات فال الطبية بحفر الباطن',
    specialty: 'طب وتجميل الأسنان',
    branch: clinicFacts.cityAr,
    services: ['استشارة', 'جلسة علاج', 'متابعة'],
    image: '/assets/doctor-nibraj.jpg',
    summary: 'طبيب أسنان في مجمع عيادات فال يقدّم فحوصات وعلاجات الفم ضمن خطة واضحة منذ الزيارة الأولى.',
    sections: [
      {
        title: 'نبذة',
        paragraphs: ['عضو الكادر الطبي في مجمع عيادات فال بحفر الباطن، ويقدّم رعاية أسنان يومية بإشراف عيادي منظم.'],
      },
      {
        title: 'مجالات التركيز',
        listItems: ['الفحص والتنظيف والعناية الوقائية', 'علاج مشكلات الفم والأسنان', 'متابعة الخطة العلاجية'],
      },
      {
        title: 'أسلوب الرعاية',
        paragraphs: ['يركّز على راحة المريض وشرح خطوات العلاج قبل البدء، مع متابعة بعد الجلسة عند الحاجة.'],
      },
    ],
  },
  {
    id: 'hanan-helal',
    name: 'د. حنان محمد هلال',
    title: 'طبيبة الجلدية والتجميل',
    seoRole: 'طبيبة الجلدية والتجميل في مجمع عيادات فال الطبية بحفر الباطن',
    specialty: 'الأمراض الجلدية والتجميل',
    branch: clinicFacts.cityAr,
    services: ['استشارة', 'جلسة علاج', 'متابعة'],
    image: '/assets/doctor-hanan.jpg',
    summary: 'طبيبة الجلدية والتجميل تقدّم تقييمًا طبيًا للبشرة، مع جلسات ليزر وعناية جلدية داخل عيادة البشرة في فال.',
    sections: [
      {
        title: 'نبذة',
        paragraphs: [
          'د. حنان محمد هلال تستقبل الحالات في عيادة الجلدية بمجمع عيادات فال، مع أجهزة ليزر وعناية بالبشرة داخل الغرفة العلاجية.',
        ],
      },
      {
        title: 'مجالات التركيز',
        listItems: ['الليزر وعلاج التصبغات', 'العناية الطبية بالبشرة', 'الفيلر والبوتوكس حسب التقييم'],
      },
      {
        title: 'أسلوب الرعاية',
        paragraphs: [
          'العناية موجّهة نحو نتيجة طبيعية وخطة واضحة بعد التقييم، مع متابعة بعد الجلسة عند الحاجة.',
        ],
      },
    ],
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.id === id);
}
