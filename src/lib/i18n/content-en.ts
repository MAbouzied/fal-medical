import { clinicFacts, formatClinicHours, formatClinicHoursFaq, formatClinicLocation } from '../../data/clinic-facts.ts';

export const uiEn = {
  nav: {
    services: 'Services',
    devices: 'Devices',
    doctors: 'Doctors',
    contact: 'Contact Us',
    book: 'Book now',
    quickBook: 'Quick book',
    home: 'Home',
    bookConsultation: 'Book your consultation now',
    about: 'About us',
    links: 'Links',
  },
  common: {
    viewProfile: 'View profile',
    bookWithDoctor: 'Book with doctor',
    bookAppointment: 'Book appointment',
    whatsapp: 'WhatsApp',
    call: 'Call',
    branch: 'Branch',
    department: 'Department',
    specialty: 'Specialty',
    service: 'Service',
    fullName: 'Full name',
    phone: 'Mobile number',
    chooseDepartment: 'Choose department',
    chooseSpecialty: 'Choose specialty',
    chooseService: 'Choose service',
    consent: 'I agree to the privacy policy and to be contacted to confirm the booking.',
    sendWhatsapp: 'Send via WhatsApp',
    contactWhatsapp: 'Contact via WhatsApp',
    callDirect: 'Call now',
    dentistry: 'Dentistry',
    dermatology: 'Dermatology',
    allServices: 'All services',
    viewService: 'View service details',
    relatedSpecialty: 'View specialty',
    hours: 'Working hours',
    address: 'Address',
    email: 'Email',
    parking: 'Parking available in front of the clinic',
    emptyDoctors: 'No doctors match your filters.',
    importantLinks: 'Important links',
    namePlaceholder: 'Example: Abdullah Mohammed',
    phonePlaceholder: '05XXXXXXXX',
    officialLicenses: 'Official licensing data:',
    commercialRegister: 'Commercial Register (Unified National Number)',
    municipalLicense: 'Municipal activity license (Balady)',
    licensedActivity: 'Licensed activity',
    viewCommercialRegistration: 'View commercial registration certificate',
    saudiBusinessCenter: 'Saudi Business Center',
    followUs: 'Follow us',
    footerTagline:
      'We design natural smiles and looks that give you lasting confidence, in a space that respects your comfort and privacy.',
    footerContact: 'Contact',
  },
  booking: {
    eyebrow: 'Book your visit',
    title: 'Book quickly now',
    subtitle: 'Enter your name and phone number, choose the specialty then the service, and send via WhatsApp.',
    notice: 'Submitting will open WhatsApp with your booking details ready to send to the clinic.',
    statusInvalid: 'Please fill in the required fields before sending.',
    statusOpening: 'Opening WhatsApp to send your booking request...',
    errors: {
      name: 'Please enter your full name (at least 3 characters).',
      phone: 'Please enter a Saudi mobile number as 05XXXXXXXX.',
      department: 'Please choose a specialty.',
      service: 'Please choose a service.',
      consent: 'Consent is required to continue.',
    },
  },
  lead: {
    title: 'Book your appointment now',
    subtitle: `${clinicFacts.cityEn} branch — ${clinicFacts.streetEn}, ${clinicFacts.districtEn}`,
    statusInvalid: 'Please fill in your name, phone number, specialty, and service.',
    statusOpening: 'Opening WhatsApp...',
    chooseDental: 'Choose a department',
  },
  home: {
    eyebrow: `Fal Clinic · ${clinicFacts.cityEn}`,
    heroTitle: 'Specialist care in one medical complex',
    heroText:
      `Dentistry, dermatology, aesthetics, nutrition, obstetrics & gynecology, and physiotherapy in ${clinicFacts.districtEn} — with easy WhatsApp booking.`,
    servicesTitle: 'Clinic services',
    servicesText: 'Choose the care you need and book through WhatsApp in minutes.',
    dentalServicesTitle: 'Dental services',
    dermatologyServicesTitle: 'Dermatology services',
    devicesTitle: 'Our equipment',
    devicesText: 'Clinic devices used for laser care, skin treatment, and dentistry.',
    devicesEyebrow: 'Our devices',
    devicesSectionTitle: 'Technology inside the clinic',
    devicesSectionText: 'Discover the main devices used at Fal Clinic for more precise and comfortable care.',
    locationTitle: 'Visit us',
    whyTitle: 'A medical experience that feels reassuring',
    trust: ['Specialist doctors', 'Modern devices & technology', 'Privacy & comfort', 'Personalized treatment plans'],
  },
  pages: {
    servicesTitle: `Dental & Dermatology Services in ${clinicFacts.cityEn} | Fal Clinic`,
    servicesDescription: `Browse dentistry and dermatology services at Fal Clinic in ${clinicFacts.cityEn} and book your appointment.`,
    servicesEyebrow: 'Our specialties',
    servicesHeading: 'Services designed for a distinctive look',
    servicesIntro:
      'From smile details to facial features, we take care of a complete journey toward greater confidence.',
    servicesConsultEyebrow: 'Start now',
    servicesConsultTitle: 'Book your free consultation',
    servicesConsultIntro:
      'Fill in the form and our team will contact you during working hours to confirm your appointment.',
    servicesConsultNote: 'The plan and treatment start only after you agree.',
    servicesCallDirect: 'Direct call',
    servicesConfirmBooking: 'Confirm booking',
    servicesCatalogTitle: 'Browse all services',
    servicesFaqTitle: 'Answers to your most important questions',
    doctorsTitle: `Dentists & Dermatologists in ${clinicFacts.cityEn} | Fal Clinic`,
    doctorsDescription: `Meet the Fal Clinic dental and dermatology team in ${clinicFacts.cityEn} and choose the right doctor for your care plan.`,
    doctorsHeading: 'Specialist doctors you can trust',
    contactTitle: `Contact Fal Clinic in ${clinicFacts.cityEn}`,
    contactDescription: `Contact Fal Clinic in ${clinicFacts.cityEn}, ${clinicFacts.districtEn}, ${clinicFacts.streetEn}. Book an appointment or reach us by WhatsApp and phone.`,
    contactBadge: 'Contact Us',
    contactHeading: 'We are here to help you',
    contactIntro:
      'Have a question or want to book an appointment? Contact us, and our team will be happy to answer your questions and help you get the care you need.',
    locationTitle: `Our location in ${clinicFacts.cityEn}`,
    branchName: `${clinicFacts.cityEn} branch`,
    openMap: 'Open in Google Maps',
    extraMessage: 'Additional message (optional)',
    extraMessagePlaceholder: 'Any notes you would like to tell us',
    sendMessage: 'Send message',
    servicePlaceholder: 'Example: teeth cleaning',
    contactNotice: 'Submitting will save your request and open WhatsApp so the clinic can follow up.',
    bookTitle: `Book an Appointment at Fal Clinic ${clinicFacts.cityEn}`,
    bookDescription: `Book a visit at Fal Clinic in ${clinicFacts.cityEn} in minutes — enter your name, phone, specialty, and service.`,
    devicesTitle: 'Devices',
    devicesDescription: `Explore the medical devices and technology used at Fal Clinic in ${clinicFacts.cityEn}.`,
    devicesHeading: 'Technology inside the clinic',
  },
  location: {
    branch: clinicFacts.cityEn,
    full: formatClinicLocation('en'),
    hours: formatClinicHours('en'),
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions',
  },
} as const;

export const departmentsEn = {
  أسنان: 'Dentistry',
  جلدية: 'Dermatology',
  ليزر: 'Laser',
  تغذية: 'Nutrition',
  'نساء وولادة': 'Obstetrics & gynecology',
  'علاج طبيعي': 'Physiotherapy',
  'كل الخدمات': 'All services',
  'قسم النحت و الاذابة': 'Body Contouring & Fat Dissolving',
  'قسم الفيلر': 'Filler',
  'قسم البوتكس': 'Botox',
  'قسم النضارة': 'Skin Brightening',
  'قسم الهيدرافيشل': 'Hydrafacial',
  'قسم اللايت': 'Light Therapy',
  'قسم علاج البشرة و الشعر': 'Skin & Hair Treatment',
  'قسم الليزر': 'Laser',
  'قسم الجلدية': 'Dermatology',
  'قسم الأسنان': 'Dentistry',
  'قسم التغذية': 'Nutrition',
  'قسم النساء والولادة': 'Obstetrics & gynecology',
  'قسم العلاج الطبيعي': 'Physiotherapy',
} as const;

export const specialtiesEn = {
  'كل الأطباء': 'All doctors',
  'طب وتجميل الأسنان': 'Cosmetic & restorative dentistry',
  'الأمراض الجلدية والتجميل': 'Dermatology & aesthetics',
  'خدمات الليزر': 'Laser services',
  التغذية: 'Nutrition',
  'النساء والولادة': 'Obstetrics & gynecology',
  'العلاج الطبيعي': 'Physiotherapy',
} as const;

export const categoriesEn = {
  تجميل: 'Cosmetic',
  'علاج وجراحة': 'Treatment & surgery',
  'تركيبات وتشخيص': 'Prosthetics & diagnosis',
  'كل الخدمات': 'All services',
} as const;

export const doctorServicesEn = {
  استشارة: 'Consultation',
  'جلسة علاج': 'Treatment session',
  متابعة: 'Follow-up',
} as const;

export const servicesEn: Record<
  string,
  {
    title: string;
    description: string;
    heroImageAlt: string;
    sections: { title: string; paragraphs?: string[]; listIntro?: string; listItems?: string[] }[];
  }
> = {
  dentistry: {
    title: 'Dentistry',
    description:
      'From instant whitening to implants and smile design, we use certified systems for precise results that last.',
    heroImageAlt: 'Modern dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'Dentistry at Fal',
        paragraphs: [
          'From instant whitening to implants and smile design, we use certified systems for precise results that last.',
        ],
        listItems: ['Laser teeth whitening', 'Immediate dental implants', 'Clear aligners'],
      },
    ],
  },
  dermatology: {
    title: 'Dermatology & aesthetics',
    description:
      'We use modern techniques to treat skin concerns and restore a fresh, youthful look with safe medical methods.',
    heroImageAlt: 'Skin care treatment at Fal Clinic',
    sections: [
      {
        title: 'Dermatology at Fal',
        paragraphs: [
          'We use modern techniques to treat skin concerns and restore a fresh, youthful look with safe medical methods.',
        ],
        listItems: ['Deep skin cleaning (HydraFacial)', 'Pigmentation and acne-mark treatment'],
      },
    ],
  },
  'dental-implants': {
    title: 'Dental implants',
    description: 'Restore missing teeth with safe implants and a natural look.',
    heroImageAlt: 'Modern dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'What are dental implants?',
        paragraphs: [
          'Dental implants are a lasting solution for missing teeth, based on a precise jaw assessment and a custom implant that matches your smile and bite.',
        ],
      },
      {
        title: 'Treatment steps',
        listIntro: 'We guide you clearly from assessment to the final result:',
        listItems: [
          'Exam and imaging to check bone readiness.',
          'Implant placement with a personalized plan.',
          'Final crown placement and healing follow-up.',
        ],
      },
    ],
  },
  'dental-prosthetics': {
    title: 'Dental prosthetics',
    description: 'Crowns, bridges, and restorations that bring back function and appearance.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'Restorations tailored to your case',
        paragraphs: [
          'We provide crowns, bridges, and fixed or removable restorations after a careful assessment of teeth and gums.',
        ],
      },
      {
        title: 'When do you need prosthetics?',
        listItems: [
          'Replacing a missing or severely damaged tooth.',
          'Protecting a tooth after root canal treatment.',
          'Improving smile appearance and chewing function.',
        ],
      },
    ],
  },
  'dental-veneers': {
    title: 'Dental veneers',
    description: 'Thin veneers that improve tooth shape and color with a natural look.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'A balanced smile with custom veneers',
        paragraphs: [
          'Veneers cover the front surface to improve shade, shape, and visible alignment after assessing teeth, gums, and suitability.',
        ],
      },
      {
        title: 'Treatment steps',
        listItems: [
          'Exam to check if teeth are ready for veneers.',
          'Choose a shape and shade that fit your smile.',
          'Place the veneers and review the final result.',
        ],
      },
    ],
  },
  'teeth-whitening': {
    title: 'Teeth whitening',
    description: 'Safe in-clinic whitening to brighten your smile under specialist care.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'A brighter smile',
        paragraphs: [
          'Whitening sessions start with assessing tooth shade and gum health, then choosing the right method for a natural, safe result.',
        ],
      },
      {
        title: 'Before whitening',
        listItems: [
          'Check teeth and gums readiness.',
          'Choose the suitable whitening shade.',
          'Follow aftercare tips to maintain results.',
        ],
      },
    ],
  },
  'cleaning-polishing': {
    title: 'Cleaning & polishing',
    description: 'Remove tartar and stains while protecting oral and gum health.',
    heroImageAlt: 'Comfortable clinic environment for oral care',
    sections: [
      {
        title: 'Essential preventive care',
        paragraphs: [
          'Professional cleaning and polishing remove tartar and surface stains and help prevent gum inflammation and decay.',
        ],
      },
      {
        title: 'What the session includes',
        listItems: ['Tartar removal', 'Tooth surface polishing', 'Home care tips'],
      },
    ],
  },
  'tooth-extraction': {
    title: 'Extraction (surgical & simple)',
    description: 'Safe extractions with a clear assessment and recovery plan.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'Simple or surgical extraction',
        paragraphs: [
          'We determine the extraction type after exam and imaging, with clear post-care instructions for comfortable healing.',
        ],
      },
      {
        title: 'After extraction',
        listItems: [
          'Clear wound-care instructions.',
          'Follow-up when needed.',
          'Replacement options when suitable.',
        ],
      },
    ],
  },
  'root-canal': {
    title: 'Root canal treatment',
    description: 'Precise root canal care to save the tooth and relieve pain.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'Safe root canal care',
        paragraphs: [
          'Root canal treatment removes inflammation and preserves the tooth, with suitable anesthesia and a restoration plan afterward.',
        ],
      },
      {
        title: 'Signs you may need a root canal',
        listItems: ['Persistent pain or severe sensitivity', 'Swelling or inflammation', 'Deep decay reaching the nerve'],
      },
    ],
  },
  'cosmetic-fillings': {
    title: 'Cosmetic fillings',
    description: 'Tooth-colored fillings that treat decay with a natural look.',
    heroImageAlt: 'Dental care session at the clinic',
    sections: [
      {
        title: 'Natural-looking restoration',
        paragraphs: [
          'Cosmetic fillings treat decay or small fractures while matching tooth color, preserving both function and appearance.',
        ],
      },
      {
        title: 'Benefits',
        listItems: [
          'Shade close to natural teeth.',
          'Conservative restoration that keeps more tooth structure.',
          'Often completed in one visit.',
        ],
      },
    ],
  },
  'gum-contouring': {
    title: 'Gum contouring (surgical & laser)',
    description: 'Reshape the gum line surgically or with laser for a balanced smile.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'A more balanced gum line',
        paragraphs: [
          'Gum contouring improves smile appearance and some gum concerns. Surgical or laser technique is chosen after assessment.',
        ],
      },
      {
        title: 'Before the procedure',
        listItems: [
          'Assess gum health and smile line.',
          'Choose the most suitable technique.',
          'Explain expectations and aftercare.',
        ],
      },
    ],
  },
  'gum-depigmentation': {
    title: 'Laser gum depigmentation',
    description: 'Lighten dark gum pigmentation with medical laser technology.',
    heroImageAlt: 'Gum treatment device at Fal Clinic',
    sections: [
      {
        title: 'A naturally pinker gum look',
        paragraphs: [
          'Laser gum depigmentation targets dark pigmentation to improve smile appearance after assessing the cause and suitability.',
        ],
      },
      {
        title: 'What to expect',
        listItems: [
          'Assessment visit to identify pigmentation cause.',
          'Laser procedure adjusted to gum condition.',
          'Aftercare guidance during recovery.',
        ],
      },
    ],
  },
  'dental-xray-3d': {
    title: '3D dental X-ray',
    description: '3D imaging for more accurate diagnosis and clearer treatment plans.',
    heroImageAlt: 'Dental treatment room at Fal Clinic',
    sections: [
      {
        title: 'Clearer diagnosis with 3D imaging',
        paragraphs: [
          '3D dental X-rays help assess bone, roots, and implant sites more precisely before treatment begins.',
        ],
      },
      {
        title: 'When is 3D imaging requested?',
        listItems: [
          'Before dental implants.',
          'In complex surgery or extraction cases.',
          'When a detailed jaw and tooth assessment is needed.',
        ],
      },
    ],
  },
  laser: {
    title: 'Laser',
    description: 'Medical laser sessions after skin assessment for hair removal or suitable skin concerns.',
    heroImageAlt: 'Equipped treatment room at Fal Clinic',
    sections: [
      {
        title: 'Medical laser after assessment',
        paragraphs: [
          'We examine the skin first to choose the right laser, then explain the expected number of sessions and aftercare.',
        ],
      },
      {
        title: 'What’s included',
        listItems: [
          'Skin-type assessment and laser suitability.',
          'A clear session plan based on the treatment goal.',
          'Before-and-after care guidance to protect results.',
        ],
      },
    ],
  },
  'filler-botox': {
    title: 'Filler & Botox',
    description: 'Medical filler and Botox injections to refine facial features with a natural look.',
    heroImageAlt: 'Equipped treatment room at Fal Clinic',
    sections: [
      {
        title: 'Balanced medical aesthetics',
        paragraphs: [
          'We assess your facial features and goals first, then decide whether filler, Botox, or both is the right option.',
        ],
      },
      {
        title: 'Before the session',
        listItems: [
          'Consultation to clarify the goal and expected result.',
          'Choose suitable areas after medical assessment.',
          'Aftercare steps and follow-up when needed.',
        ],
      },
    ],
  },
  'body-contouring': {
    title: 'Body contouring',
    description: 'Non-surgical contouring and fat-dissolving sessions after a medical assessment.',
    heroImageAlt: 'Equipped treatment room at Fal Clinic',
    sections: [
      {
        title: 'A clear body-contouring plan',
        paragraphs: [
          'We identify focus areas after assessment, then set a session plan with realistic expectations.',
        ],
      },
      {
        title: 'What to expect',
        listItems: [
          'Medical assessment of contouring or fat-dissolving areas.',
          'Explanation of the technique and approximate session count.',
          'Aftercare and follow-up guidance.',
        ],
      },
    ],
  },
  hydrafacial: {
    title: 'HydraFacial skin cleaning',
    description: 'Deep HydraFacial cleansing to clear pores and refresh the skin.',
    heroImageAlt: 'Equipped treatment room at Fal Clinic',
    sections: [
      {
        title: 'Gentle deep cleansing',
        paragraphs: [
          'HydraFacial cleans pores and hydrates the skin after a type assessment, for a fresher look without harsh peeling.',
        ],
      },
      {
        title: 'What the session includes',
        listItems: [
          'Skin-type assessment before cleansing.',
          'Deep cleaning and hydration during the session.',
          'Simple same-day aftercare tips.',
        ],
      },
    ],
  },
  nutrition: {
    title: 'Clinical nutrition',
    description: 'Nutrition consultations to assess your case and set a clear dietary plan.',
    heroImageAlt: 'Nutrition consultation at Fal Clinic',
    sections: [
      {
        title: 'What we offer',
        paragraphs: [
          'A nutrition assessment and a plan that fits your health goal, with clear follow-up after the visit.',
        ],
      },
    ],
  },
  'obstetrics-gynecology': {
    title: 'Obstetrics & gynecology',
    description: 'Women’s health and obstetric care with a clear medical plan at Fal Clinic.',
    heroImageAlt: 'Obstetrics and gynecology clinic at Fal Clinic',
    sections: [
      {
        title: 'What we offer',
        paragraphs: [
          'Consultations and follow-up for women’s health, with a clear plan before any procedure.',
        ],
      },
    ],
  },
  physiotherapy: {
    title: 'Physiotherapy',
    description: 'Physiotherapy sessions after assessment, with a rehabilitation plan that fits your case.',
    heroImageAlt: 'Physiotherapy session at Fal Clinic',
    sections: [
      {
        title: 'What we offer',
        paragraphs: [
          'A movement assessment, then a session plan with home-care guidance between visits.',
        ],
      },
    ],
  },
};

export const doctorsEn: Record<
  string,
  {
    name: string;
    title: string;
    seoRole: string;
    specialty: string;
    summary: string;
    sections: { title: string; paragraphs?: string[]; listItems?: string[] }[];
  }
> = {
  'mohamed-tahhan': {
    name: 'Dr. Mohamed El-Tahhan',
    title: 'Orthodontics and cosmetic dentistry specialist',
    seoRole: `Orthodontics and cosmetic dentistry specialist at Fal Clinic in ${clinicFacts.cityEn}`,
    specialty: 'Cosmetic & restorative dentistry',
    summary:
      'An orthodontics and cosmetic dentistry specialist who explains aligner and brace options clearly, with regular follow-up for a natural result.',
    sections: [
      {
        title: 'About',
        paragraphs: [
          'Dr. Mohamed El-Tahhan specializes in oral and dental medicine, orthodontics, and cosmetic dentistry, and holds a master’s degree in orthodontics from Austria.',
        ],
      },
      {
        title: 'Focus areas',
        listItems: [
          'Orthodontics and clear aligners',
          'Cosmetic dentistry and smile design',
          'Oral medicine, gum care, and diagnosis',
        ],
      },
      {
        title: 'Care approach',
        paragraphs: [
          'Every case starts with a detailed assessment, then orthodontic and treatment options are explained clearly before the plan is agreed.',
        ],
      },
    ],
  },
  nibraj: {
    name: 'Dr. Nibraj',
    title: 'Dentist',
    seoRole: `Dentist at Fal Clinic in ${clinicFacts.cityEn}`,
    specialty: 'Cosmetic & restorative dentistry',
    summary: 'A dentist at Fal Clinic who provides oral exams and treatment with a clear plan from the first visit.',
    sections: [
      {
        title: 'About',
        paragraphs: [`A member of the Fal Clinic medical team in ${clinicFacts.cityEn}, providing day-to-day dental care in a structured clinic setting.`],
      },
      {
        title: 'Focus areas',
        listItems: ['Exam, cleaning, and preventive care', 'Treatment of common oral and dental concerns', 'Follow-up of the treatment plan'],
      },
      {
        title: 'Care approach',
        paragraphs: [
          'Care focuses on patient comfort and a clear explanation of each step before treatment, with follow-up after the session when needed.',
        ],
      },
    ],
  },
  'hanan-helal': {
    name: 'Dr. Hanan Mohamed Helal',
    title: 'Dermatology and aesthetics doctor',
    seoRole: `Dermatology and aesthetics doctor at Fal Clinic in ${clinicFacts.cityEn}`,
    specialty: 'Dermatology & aesthetics',
    summary:
      'A dermatology and aesthetics doctor who assesses the skin and provides laser and medical skin care in the Fal skin clinic.',
    sections: [
      {
        title: 'About',
        paragraphs: [
          'Dr. Hanan Mohamed Helal sees patients in the dermatology clinic at Fal Clinic, with laser and skin-care devices in the treatment room.',
        ],
      },
      {
        title: 'Focus areas',
        listItems: ['Laser and pigmentation care', 'Medical skin care', 'Filler and Botox after medical assessment'],
      },
      {
        title: 'Care approach',
        paragraphs: [
          'Care focuses on a natural result and a clear plan after assessment, with follow-up after the session when needed.',
        ],
      },
    ],
  },
};

export const devicesEn: Record<string, { name: string; description: string; imageAlt: string }> = {
  'hydra-beauty': {
    name: 'Hydra Beauty Skin System',
    description: 'A multi-step hydrafacial device used to cleanse, exfoliate, extract impurities, and hydrate the skin in one session.',
    imageAlt: 'Hydra Beauty Skin System for skin cleaning at Fal Clinic',
  },
  'candela-gentlemax-pro': {
    name: 'Candela GentleMax Pro+',
    description: 'A dual-wavelength laser for hair removal and treatment of pigmented and vascular lesions across skin types.',
    imageAlt: 'Candela GentleMax Pro+ laser hair-removal device at Fal Clinic',
  },
  'queen-co2': {
    name: 'Queen RF CO2 Fractional Laser',
    description: 'A fractional carbon-dioxide laser for skin resurfacing, scar treatment, and texture improvement.',
    imageAlt: 'Queen RF CO2 Fractional Laser for skin resurfacing at Fal Clinic',
  },
  'lutronic-spectra-xt': {
    name: 'Lutronic Spectra XT',
    description: 'A Q-switched laser for pigmentation, skin rejuvenation, and tattoo removal across multiple wavelengths.',
    imageAlt: 'Lutronic Spectra XT pigmentation laser at Fal Clinic',
  },
  'dental-treatment-unit': {
    name: 'Dental treatment unit',
    description: 'A complete dental chair with medical lighting and instrument delivery for exams and daily procedures.',
    imageAlt: `Dental treatment unit inside Fal Clinic in ${clinicFacts.cityEn}`,
  },
  'intraoral-camera': {
    name: 'Intraoral camera',
    description: 'Live intraoral imaging used for more precise diagnosis and to explain the case to the patient during the visit.',
    imageAlt: 'Intraoral dental camera and display screen at Fal Clinic',
  },
};

export const faqEn = [
  {
    question: 'How do I book an appointment at Fal Clinic?',
    answer:
      `Book through the quick booking page or contact form on the website, or via WhatsApp and a direct call to the ${clinicFacts.cityEn} branch.`,
  },
  {
    question: 'Are dental consultations available?',
    answer:
      'Yes. Our dental team provides consultations to assess your case and agree a suitable treatment plan before any procedure.',
  },
  {
    question: 'Which services are available at the clinic?',
    answer:
      'The clinic offers dentistry, dermatology, and laser care, plus nutrition, obstetrics & gynecology, and physiotherapy, with WhatsApp booking.',
  },
  {
    question: `Where is the ${clinicFacts.cityEn} branch?`,
    answer: `Fal Clinic is in ${formatClinicLocation('en')}.`,
  },
  {
    question: 'What are the working hours?',
    answer: formatClinicHoursFaq('en'),
  },
  {
    question: 'Can I reschedule or cancel?',
    answer: 'Yes. Contact the clinic team by WhatsApp or phone before your visit to reschedule or cancel.',
  },
  {
    question: 'What payment methods are available?',
    answer: 'Available payment methods are confirmed with reception when your appointment is confirmed.',
  },
  {
    question: 'Is parking available?',
    answer: `Yes. Parking is available in front of the branch in ${clinicFacts.districtEn}.`,
  },
] as const;
