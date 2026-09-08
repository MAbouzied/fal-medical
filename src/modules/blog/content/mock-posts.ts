import type { BlogPost } from '../model/blog-types.ts';

/**
 * Mock Arabic blog fixtures for launch.
 * Medical statements are conservative and marked for clinical review before production.
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-teeth-whitening-guide',
    slug: 'dalil-tabyid-alasnan-riyadh',
    locale: 'ar',
    title: 'دليل تبييض الأسنان في حفر الباطن: متى يناسبك وما الذي تتوقعه؟',
    excerpt:
      'شرح مبسّط لخيارات تبييض الأسنان داخل العيادة والعناية بعدها، مع نصائح لاختيار الوقت المناسب دون وعود مبالغ فيها.',
    category: { id: 'dentistry', label: 'طب الأسنان' },
    author: {
      name: 'فريق فال',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
      image: {
        src: '/assets/logo.png',
        alt: 'شعار فال',
        width: 1320,
        height: 1215,
      },
    },
    cover: {
      src: '/assets/devices/dental-treatment-unit.jpg',
      alt: 'ابتسامة مشرقة بعد جلسة عناية بالأسنان',
      width: 1600,
      height: 1067,
      caption: 'تبييض الأسنان قرار طبي يعتمد على تقييم الحالة.',
    },
    publishedAt: '2026-07-20T09:00:00.000Z',
    updatedAt: '2026-07-28T10:00:00.000Z',
    featured: true,
    draft: false,
    seo: {
      title: 'دليل تبييض الأسنان في حفر الباطن | فال',
      description:
        'تعرّف على خيارات تبييض الأسنان في عيادة فال بحفر الباطن، والخطوات المتوقعة قبل الجلسة وبعدها.',
    },
    relatedSlugs: ['inah-alasnan-alwaqaiya', 'hashwat-tajmiliya-mata-tahtajha'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'كثير من الزائرين يسألون عن تبييض الأسنان قبل مناسبات مهمة. هذا الدليل يوضّح الأسس العامة فقط، والتقييم النهائي يتم داخل العيادة بعد فحص المينا واللثة. [مراجعة سريرية مطلوبة قبل النشر النهائي]',
        },
        {
          type: 'paragraph',
          text: 'الهدف هنا مساعدتك على طرح الأسئلة الصحيحة قبل الحجز: متى يناسبك التبييض؟ ماذا يحدث خلال الجلسة؟ وكيف تعتني بأسنانك بعدها دون وعود مبالغ فيها.',
        },
        { type: 'heading', level: 2, text: 'متى يكون التبييض خياراً مناسباً؟' },
        {
          type: 'paragraph',
          text: 'غالباً يناسب التبييض حالات الاصفرار السطحي المرتبط بالعادات اليومية مثل الشاي والقهوة، بعد استبعاد الحساسية أو التسوس غير المعالج. بعض الحالات تحتاج علاجاً ترميمياً أولاً قبل أي إجراء تجميلي.',
        },
        { type: 'heading', level: 3, text: 'علامات تستدعي تقييماً أولاً' },
        {
          type: 'unordered-list',
          items: [
            'حساسية واضحة عند تناول البارد أو الحلو.',
            'بقع داكنة غير منتظمة أو تغيّر مفاجئ في اللون.',
            'التهاب لثة أو نزيف متكرر أثناء التنظيف.',
            'حشوات أو تيجان واسعة في الأسنان الأمامية.',
          ],
        },
        { type: 'heading', level: 2, text: 'ماذا يحدث خلال الزيارة؟' },
        {
          type: 'paragraph',
          text: 'المسار يختلف حسب الحالة، لكن الخطوات التالية شائعة في عيادة منظمة وتساعدك على معرفة ما يمكن توقعه دون مفاجآت.',
        },
        {
          type: 'ordered-list',
          items: [
            'فحص سريري وصورة عند الحاجة لتقييم سلامة المينا واللثة.',
            'شرح الخيارات المتاحة ومدى التوقعات الواقعية للنتيجة.',
            'تنفيذ الجلسة وفق البروتوكول المناسب لحالتك.',
            'تعليمات العناية المنزلية خلال الأيام الأولى.',
          ],
        },
        {
          type: 'image',
          image: {
            src: '/assets/landing-hero.jpg',
            alt: 'بيئة علاج أسنان حديثة داخل العيادة',
            width: 1600,
            height: 1067,
            caption: 'التقييم السريري يسبق أي إجراء تجميلي للأسنان.',
          },
        },
        { type: 'heading', level: 2, text: 'نصائح بعد التبييض' },
        {
          type: 'paragraph',
          text: 'الأيام الأولى مهمة للحفاظ على النتيجة وتقليل الحساسية المؤقتة إن ظهرت. التزم بتوجيه الطبيب إن اختلف عن هذه الإرشادات العامة.',
        },
        {
          type: 'unordered-list',
          items: [
            'قلّل المشروبات الداكنة في الساعات الأولى وفق توجيه الطبيب.',
            'استخدم فرشاة ناعمة ومعجوناً مناسباً للحساسية إن وُجدت.',
            'تجنّب التبييض المنزلي العشوائي مباشرة بعد الجلسة.',
            'التزم بمواعيد المتابعة عند الحاجة.',
          ],
        },
        {
          type: 'quote',
          text: 'النتيجة تختلف من شخص لآخر، والخطة الطبية أهم من أي صورة قبل وبعد.',
          attribution: 'فريق طب الأسنان — فال',
        },
        { type: 'heading', level: 2, text: 'مقارنة سريعة بين التوقعات والواقع' },
        {
          type: 'two-column',
          columns: [
            [
              { type: 'heading', level: 3, text: 'مناسب عندما' },
              {
                type: 'unordered-list',
                items: [
                  'اللثة والأسنان سليمتان بعد التقييم',
                  'الاصفرار سطحي وواضح',
                  'التوقعات واقعية ومرتبطة بنمط الحياة',
                ],
              },
            ],
            [
              { type: 'heading', level: 3, text: 'يحتاج حذراً إضافياً عندما' },
              {
                type: 'unordered-list',
                items: [
                  'يوجد تسوس أو التهاب نشط',
                  'حساسية مينا مرتفعة',
                  'تغير اللون مرتبط بصبغات داخلية معقّدة',
                ],
              },
            ],
          ],
        },
        {
          type: 'embed-placeholder',
          label: 'فيديو توضيحي قصير عن خطوات جلسة التبييض (قريباً)',
          provider: 'future-video',
        },
        { type: 'heading', level: 2, text: 'متى تحجز استشارة؟' },
        {
          type: 'paragraph',
          text: 'إذا كنت تفكّر في تبييض الأسنان لمناسبة قريبة أو لتحسين ثقتك بابتسامتك، ابدأ باستشارة قصيرة تحدّد إن كان التبييض مناسباً الآن أو إن كان هناك علاج أولوية قبله.',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'يمكنك ' },
            { text: 'حجز موعد', href: '/book' },
            { text: ' أو الاطلاع على ' },
            { text: 'خدمة تبييض الأسنان', href: '/services/teeth-whitening' },
            { text: ' ثم التحدث مع الفريق الطبي. لمزيد من الإرشادات العامة حول صحة الفم، راجع أيضاً ' },
            {
              text: 'مصادر وزارة الصحة',
              href: 'https://www.moh.gov.sa',
              external: true,
            },
            { text: '.' },
          ],
        },
      ],
    },
  },
  {
    id: 'post-acne-care',
    slug: 'inah-hubub-alshabab-bilhada',
    locale: 'ar',
    title: 'العناية بحب الشباب: خطوات هادئة قبل اختيار العلاج',
    excerpt:
      'كيف تتعامل مع حب الشباب بطريقة منظمة؟ من الروتين اليومي إلى متى تستشير طبيب الجلدية في حفر الباطن.',
    category: { id: 'dermatology', label: 'الجلدية' },
    author: {
      name: 'فريق الجلدية',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
    },
    cover: {
      src: '/assets/devices/hydra-beauty.jpg',
      alt: 'عناية بالبشرة في بيئة عيادية هادئة',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-07-15T08:00:00.000Z',
    featured: false,
    draft: false,
    seo: {
      title: 'العناية بحب الشباب في حفر الباطن | فال',
      description:
        'خطوات عملية للتعامل مع حب الشباب ومتى تكون زيارة طبيب الجلدية مفيدة في فال بحفر الباطن.',
    },
    relatedSlugs: ['tawhid-lawn-albashra-tasabughat'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'العناية بحب الشباب تبدأ بروتين لطيف ومنتظم. عند استمرار الالتهاب أو ظهور آثار واضحة، يفيد التقييم عند طبيب الجلدية. [مراجعة سريرية مطلوبة]',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'تعرّف على ' },
            { text: 'تنظيف البشرة الهيدرافيشل', href: '/services/hydrafacial' },
            { text: ' أو ' },
            { text: 'احجز استشارة', href: '/book' },
            { text: '.' },
          ],
        },
      ],
    },
  },
  {
    id: 'post-laser-gum',
    slug: 'tawrid-allitha-billayzar-ma-yatawaqqa',
    locale: 'ar',
    title: 'توريد اللثة بالليزر: ماذا تتوقع قبل الجلسة وبعدها؟',
    excerpt:
      'نظرة عامة على إجراء توريد اللثة بالليزر، ودواعي التقييم الطبي، والعناية المنزلية الأولية.',
    category: { id: 'laser', label: 'الليزر' },
    author: {
      name: 'فريق فال',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
      image: {
        src: '/assets/doctor-tahhan.jpg',
        alt: 'طبيب أسنان في فال',
        width: 800,
        height: 1000,
      },
    },
    cover: {
      src: '/assets/devices/dental-treatment-unit.jpg',
      alt: 'جهاز علاج اللثة داخل عيادة فال',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-07-10T11:30:00.000Z',
    featured: false,
    draft: false,
    seo: {
      description:
        'تعرّف على خطوات توريد اللثة بالليزر في فال بحفر الباطن وما ينبغي مناقشته مع الطبيب قبل الإجراء.',
    },
    relatedSlugs: ['qas-allitha-mata-yufid'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'توريد اللثة بالليزر يُناقش بعد تقييم صحة اللثة وتوضيح التوقعات الواقعية. العناية بعد الجلسة جزء أساسي من النتيجة. [مراجعة سريرية مطلوبة]',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'اطّلع على ' },
            { text: 'خدمة توريد اللثة', href: '/services/gum-depigmentation' },
            { text: ' أو ' },
            { text: 'احجز موعداً', href: '/book' },
            { text: '.' },
          ],
        },
      ],
    },
  },
  {
    id: 'post-preventive-dental',
    slug: 'inah-alasnan-alwaqaiya',
    locale: 'ar',
    title: 'العناية الوقائية بالأسنان: عادات صغيرة تحمي ابتسامتك',
    excerpt:
      'تنظيف منتظم، زيارات فحص، وعادات يومية تساعد على تقليل المشاكل قبل أن تتفاقم.',
    category: { id: 'preventive', label: 'العناية الوقائية' },
    author: {
      name: 'فريق طب الأسنان',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
    },
    cover: {
      src: '/assets/landing-clinic-gallery.jpg',
      alt: 'عيادة أسنان مرتبة وجاهزة لاستقبال المرضى',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-07-05T07:45:00.000Z',
    featured: false,
    draft: false,
    seo: {},
    relatedSlugs: ['dalil-tabyid-alasnan-riyadh'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'الفرشاة والخيط والفحص الدوري عادات بسيطة تقلل الحاجة إلى علاجات أوسع لاحقاً. الوقاية لا تغني عن التقييم عند ظهور ألم أو نزيف. [مراجعة سريرية مطلوبة]',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'يمكنك حجز ' },
            { text: 'تنظيف الأسنان', href: '/services/cleaning-polishing' },
            { text: ' مباشرة.' },
          ],
        },
      ],
    },
  },
  {
    id: 'post-cosmetic-fillings',
    slug: 'hashwat-tajmiliya-mata-tahtajha',
    locale: 'ar',
    title: 'الحشوات التجميلية: متى تحتاجها وكيف تبدو النتيجة؟',
    excerpt:
      'شرح عملي لدور الحشوات التجميلية في إصلاح التسوس مع الحفاظ على مظهر السن الطبيعي قدر الإمكان.',
    category: { id: 'dentistry', label: 'طب الأسنان' },
    author: {
      name: 'فريق طب الأسنان',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
      image: {
        src: '/assets/logo.png',
        alt: 'شعار فال',
        width: 1320,
        height: 1215,
      },
    },
    cover: {
      src: '/assets/devices/dental-treatment-unit.jpg',
      alt: 'وحدة علاج أسنان بإضاءة LED داخل العيادة',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-06-28T12:00:00.000Z',
    featured: false,
    draft: false,
    seo: {
      title: 'متى تحتاج الحشوات التجميلية؟ | مدونة فال',
      description:
        'شرح عملي لدور الحشوات التجميلية ومتى تُقترح بعد التقييم في عيادة فال بحفر الباطن.',
    },
    relatedSlugs: ['dalil-tabyid-alasnan-riyadh'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'الحشوة التجميلية تُقترح عند تسوس أو كسر محدود وبعد التأكد من سلامة السن. الهدف جمع الإحكام الوظيفي مع مظهر متناسق. [مراجعة سريرية مطلوبة]',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'اقرأ عن ' },
            { text: 'الحشوات التجميلية', href: '/services/cosmetic-fillings' },
            { text: ' أو ' },
            { text: 'احجز موعداً', href: '/book' },
            { text: '.' },
          ],
        },
      ],
    },
  },
  {
    id: 'post-pigmentation',
    slug: 'tawhid-lawn-albashra-tasabughat',
    locale: 'ar',
    title: 'التصبغات وتوحيد لون البشرة: أسئلة شائعة قبل الجلسة',
    excerpt:
      'إجابات واضحة حول أسباب التصبغات الشائعة، وما الذي يُناقش مع طبيب الجلدية قبل أي خطة علاجية.',
    category: { id: 'dermatology', label: 'الجلدية' },
    author: {
      name: 'فريق الجلدية',
      role: 'محتوى تثقيفي — قيد المراجعة السريرية',
    },
    cover: {
      src: '/assets/devices/dental-treatment-unit.jpg',
      alt: 'منطقة انتظار هادئة في عيادة فال',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-06-20T09:15:00.000Z',
    featured: false,
    draft: false,
    seo: {
      description:
        'أسئلة شائعة عن التصبغات وتوحيد لون البشرة في فال بحفر الباطن قبل اختيار خطة علاجية.',
    },
    relatedSlugs: ['inah-hubub-alshabab-bilhada'],
    body: {
      format: 'blocks',
      blocks: [
        {
          type: 'paragraph',
          text: 'أسباب التصبغات متعددة، ولا توجد جلسة واحدة تناسب الجميع. التقييم يوضح نوع التصبغ وخطة المتابعة، والحماية من الشمس جزء دائم من العناية. [مراجعة سريرية مطلوبة]',
        },
        {
          type: 'link-paragraph',
          parts: [
            { text: 'تعرّف على ' },
            { text: 'خدمة الليزر', href: '/services/laser' },
            { text: ' أو ' },
            { text: 'احجز استشارة', href: '/book' },
            { text: '.' },
          ],
        },
      ],
    },
  },
  // Draft + future posts exercise filtering (excluded from public routes).
  {
    id: 'post-draft-internal',
    slug: 'draft-internal-notes-only',
    locale: 'ar',
    title: 'مسودة داخلية غير منشورة',
    excerpt: 'هذه المسودة يجب ألا تظهر في الموقع.',
    category: { id: 'dentistry', label: 'طب الأسنان' },
    author: { name: 'فريق التحرير' },
    cover: {
      src: '/assets/devices/dental-treatment-unit.jpg',
      alt: 'صورة غلاف للمسودة',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2026-07-01T00:00:00.000Z',
    featured: false,
    draft: true,
    seo: {},
    body: {
      format: 'blocks',
      blocks: [{ type: 'paragraph', text: 'محتوى مسودة للاختبار فقط.' }],
    },
  },
  {
    id: 'post-future-scheduled',
    slug: 'maqal-mustaqbali-mukhatat',
    locale: 'ar',
    title: 'مقال مجدول للنشر لاحقاً',
    excerpt: 'يجب استبعاد هذا المقال حتى يحين تاريخ نشره.',
    category: { id: 'preventive', label: 'العناية الوقائية' },
    author: { name: 'فريق التحرير' },
    cover: {
      src: '/assets/devices/hydra-beauty.jpg',
      alt: 'صورة غلاف لمقال مجدول',
      width: 1600,
      height: 1067,
    },
    publishedAt: '2099-01-01T00:00:00.000Z',
    featured: true,
    draft: false,
    seo: {},
    body: {
      format: 'blocks',
      blocks: [{ type: 'paragraph', text: 'محتوى مجدول للمستقبل.' }],
    },
  },
];
