import { clinicFacts } from './clinic-facts.ts';
import { resolveServiceFeatureBlocks } from './service-features.ts';

type Locale = 'ar' | 'en';

export function resolveLandingPage(locale: Locale = 'ar') {
  const en = locale === 'en';

  const specialties = resolveServiceFeatureBlocks(locale).map((block) => ({
    id: block.id,
    title: block.badge,
    text: block.text,
    imageSrc: block.imageSrc,
    imageAlt: block.imageAlt,
    href: en ? `/en/services#${block.id}` : `/services#${block.id}`,
  }));

  return {
    hero: {
      badge: en ? 'Summer offers' : 'عروض الصيف',
      titleBefore: en
        ? 'End this year with beauty, and start the next with confidence with '
        : 'خلّ نهاية سنتك جمال، وبداية سنتك ثقة مع ',
      titleAccent: en ? 'Fal' : 'فال',
      text: en
        ? 'Dentistry, dermatology, and laser care with treatment plans that fit your needs, in a modern medical setting that protects your comfort and privacy.'
        : 'خدمات الأسنان والجلدية والليزر بخطط علاجية تناسب احتياجك، داخل بيئة طبية حديثة تحافظ على راحتك وخصوصيتك.',
      cta: en ? 'Book your consultation now' : 'احجز استشارتك الآن',
      quote: en
        ? 'We design natural smiles and looks that give you lasting confidence, in a space that respects your comfort and privacy.'
        : 'نصمم ابتسامات وإطلالات طبيعية تمنحك ثقة تدوم، في مساحة تحترم راحتك وخصوصيتك.',
      imageSrc: '/assets/landing/hero.jpg',
      imageAlt: en
        ? 'Laser treatment room with a Candela device inside Fal Clinic in Hafar Al Batin'
        : 'غرفة علاج ليزر بجهاز كانديلا داخل مجمع عيادات فال بحفر الباطن',
      quoteIconSrc: '/assets/landing-quote.svg',
    },
    about: {
      eyebrow: en ? 'About us' : 'من نحن',
      title: en ? 'Fal offers a complete experience' : 'فال تقدم تجربة كاملة',
      intro: en
        ? 'Fal designs a complete experience that starts by listening to you and ends with a smile that suits your features. Successful aesthetic care is what people feel, not what they notice.'
        : 'فال تصمم تجربة كاملة تبدأ بالاستماع لك وتنتهي بابتسامة تليق بملامحك. نؤمن أن التجميل الناجح هو ما لا يلاحظه الناس، بل يشعرون به.',
      body: en
        ? 'Our team combines dental and facial aesthetic care with modern digital planning, in a space that respects your privacy and comfort.'
        : 'فريقنا يجمع بين خبرة طب الفم والتجميل الوجهي، وأحدث التقنيات الرقمية لتصميم الابتسامة، في مساحة تحترم خصوصيتك وراحتك.',
      photoBadge: en
        ? `${clinicFacts.cityEn} · ${clinicFacts.districtEn}`
        : `${clinicFacts.cityAr} · ${clinicFacts.districtAr}`,
      imageSrc: '/assets/landing/about.jpg',
      imageAlt: en
        ? 'Skin treatment room with a Hydra Beauty device inside Fal Clinic in Al Khalidiyah, Hafar Al Batin'
        : 'غرفة عناية بالبشرة بجهاز Hydra Beauty داخل مجمع عيادات فال في حي الخالدية بحفر الباطن',
      features: en
        ? [
            { title: 'Digital diagnosis', text: 'Precise smile planning before treatment begins.' },
            { title: 'Specialist team', text: 'Dentists, dermatologists, and laser specialists in one clinic.' },
            { title: 'A safe space', text: 'Full privacy and strict sterilization standards.' },
            { title: 'Follow-up after care', text: 'We stay close after the session to support your result.' },
          ]
        : [
            { title: 'تشخيص رقمي', text: 'تصميم ابتسامة بمقاييس دقيقة قبل البدء.' },
            { title: 'فريق متخصص', text: 'أطباء الأسنان والجلدية والليزر في مجمع واحد.' },
            { title: 'مساحة آمنة', text: 'خصوصية تامة ومعايير تعقيم صارمة.' },
            { title: 'متابعة بعد العلاج', text: 'نبقى بقربك بعد الجلسة لمتابعة النتيجة.' },
          ],
    },
    specialties: {
      eyebrow: en ? 'Our specialties' : 'تخصصاتنا',
      title: en ? 'Services designed for a distinctive look' : 'خدمات مصمّمة لإطلالة مميزة',
      intro: en
        ? 'From smile details to facial features, we take care of a complete journey toward greater confidence.'
        : 'من تفاصيل الابتسامة إلى ملامح الوجه، نتكفّل برحلة متكاملة نحو ثقة أكبر.',
      more: en ? 'Learn more' : 'اعرف المزيد',
      items: specialties,
    },
    featured: {
      eyebrow: en ? 'Most requested' : 'الأكثر طلباً',
      title: en ? 'A smile with a natural touch' : 'ابتسامة بلمسة طبيعية',
      text: en
        ? 'Dental veneers can improve the shape and color of teeth with a natural look, after a medical assessment of your case.'
        : 'عدسات الأسنان تساعد على تحسين شكل ولون الأسنان بمظهر طبيعي، بعد تقييم طبي لحالتك.',
      cta: en ? 'Book your consultation now' : 'احجز استشارتك الآن',
      href: en ? '/en/book' : '/book',
      serviceHref: en ? '/en/services/dental-veneers' : '/services/dental-veneers',
      imageSrc: '/assets/landing-hero.jpg',
      imageAlt: en
        ? 'Dental treatment room inside Fal Clinic in Hafar Al Batin'
        : 'غرفة علاج أسنان داخل مجمع عيادات فال بحفر الباطن',
      points: en
        ? [
            { title: 'A plan before treatment', text: 'We discuss the expected plan before any procedure starts.' },
            { title: 'Certified medical materials', text: 'Materials are chosen after assessing what suits your case.' },
            { title: 'Specialist follow-up', text: 'The number of visits is set by your medical evaluation.' },
          ]
        : [
            { title: 'تصميم رقمي قبل البدء', text: 'نناقش الخطة المتوقعة قبل تنفيذ أي إجراء.' },
            { title: 'مواد طبية معتمدة', text: 'نختار المواد المناسبة بعد تقييم حالتك.' },
            { title: 'متابعة متخصصة', text: 'عدد الجلسات يحدده التقييم الطبي لحالتك.' },
          ],
    },
    offer: {
      eyebrow: en ? 'Season offer' : 'عرض الموسم',
      title: en ? 'A complete smile package' : 'باقة لابتسامة متكاملة',
      text: en
        ? 'Ask reception about current smile-care offers when you confirm your appointment. No package price is published here.'
        : 'اسأل الاستقبال عن عروض العناية بالابتسامة المتاحة عند تأكيد موعدك. لا نعرض سعراً غير مؤكد هنا.',
      cta: en ? 'Book the package now' : 'احجز الباقة الآن',
      href: en ? '/en/book' : '/book',
      imageSrc: '/assets/landing/offer.png',
      imageAlt: en
        ? 'Illustration of flexible in-clinic payment options'
        : 'رسم توضيحي لخيارات الدفع المرنة داخل العيادة',
      items: en
        ? [
            'Smile consultation and digital planning',
            'Professional teeth whitening',
            'Deep cleaning and preventive gum care',
            'Follow-up after treatment',
          ]
        : [
            'استشارة وتصميم ابتسامة رقمي',
            'تبييض احترافي كامل',
            'تنظيف عميق وعلاج لثة وقائي',
            'متابعة بعد العلاج',
          ],
    },
    steps: {
      eyebrow: en ? 'Your journey with us' : 'رحلتك معنا',
      title: en ? 'Four steps from a new smile' : 'أربع خطوات تفصلك عن ابتسامة جديدة',
      intro: en
        ? 'A clear, ordered process so you always know the next step.'
        : 'عملية واضحة ومرتبة، تعرف فيها الخطوة التالية في كل لحظة.',
      items: en
        ? [
            { number: '1', title: 'Booking', text: 'Book your first consultation through the form or WhatsApp in minutes.' },
            { title: 'Examination', number: '2', text: 'We assess your case and discuss the options with you.' },
            { number: '3', title: 'Plan', text: 'A tailored plan with a clear view of next steps before treatment starts.' },
            { number: '4', title: 'Result', text: 'Careful treatment and follow-up after the session.' },
          ]
        : [
            { number: '١', title: 'الحجز', text: 'احجز استشارتك الأولى عبر النموذج أو واتساب خلال دقائق.' },
            { number: '٢', title: 'الفحص', text: 'نقيّم حالتك ونناقش الخيارات معك.' },
            { number: '٣', title: 'الخطة', text: 'خطة علاجية واضحة تناسب احتياجك قبل البدء.' },
            { number: '٤', title: 'النتيجة', text: 'تنفيذ دقيق ومتابعة بعد الجلسة.' },
          ],
    },
  } as const;
}
