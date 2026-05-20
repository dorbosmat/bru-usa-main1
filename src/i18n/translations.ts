export type Language = "en" | "es" | "ar" | "ru" | "pt" | "he" | "hi" | "zh";

export const LANGUAGES: { code: Language; label: string; flag: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "ru", label: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "pt", label: "Português", flag: "🇧🇷", dir: "ltr" },
  { code: "he", label: "עברית", flag: "🇮🇱", dir: "rtl" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
];

export const RTL_LANGUAGES: Language[] = ["ar", "he"];

type TranslationKeys = {
  // Nav
  navHome: string;
  navServices: string;
  navAiPreview: string;
  navAbout: string;
  navContact: string;
  navAdmin: string;
  navGetFreeEstimate: string;

  // Hero
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  heroTrustLine: string;
  trustLicensed: string;
  trustFastResponse: string;
  trustLocalPros: string;
  trustNoObligation: string;

  // How it works
  howItWorksTitle: string;
  howItWorksHighlight: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Services
  servicesCoverTitle: string;
  servicesCoverHighlight: string;
  servicesCoverSubtitle: string;
  serviceRoofing: string;
  serviceStormDamage: string;
  serviceKitchen: string;
  serviceBathroom: string;
  serviceRenovation: string;
  serviceWindowsDoors: string;
  serviceExterior: string;

  // Testimonials
  testimonialsTitle: string;
  testimonialsHighlight: string;

  // FAQ
  faqTitle: string;
  faqHighlight: string;
  faqQ1: string;
  faqA1: string;
  faqQ2: string;
  faqA2: string;
  faqQ3: string;
  faqA3: string;
  faqQ4: string;
  faqA4: string;

  // Contact info
  getInTouchTitle: string;
  getInTouchHighlight: string;

  // CTA
  ctaReady: string;
  ctaSubtitle: string;
  ctaButton: string;

  // Cities
  servingTitle: string;
  servingHighlight: string;

  // Lead form
  formTitle: string;
  formFullName: string;
  formPhone: string;
  formEmail: string;
  formZip: string;
  formSelectArea: string;
  formSelectService: string;
  formProjectDetails: string;
  formConsent: string;
  formCta: string;
  formLegal: string;
  formPhoneError: string;
  formFillAll: string;
  formConsentRequired: string;
  formSubmitting: string;
  formMatching: string;
  formFoundPros: string;
  formAllSet: string;
  formAllSetDesc: string;
  formCallMeNow: string;
  formCallbackConfirm: string;
  formNeedHelp: string;
  formSubmitAnother: string;
  formError: string;

  // Footer
  footerDisclaimer: string;
  footerReferral: string;
  footerQuickLinks: string;
  footerServiceAreas: string;
  footerContactUs: string;
  footerPriceDisclaimer: string;
  footerPrivacy: string;
  footerTerms: string;

  // Gallery
  galleryTitle: string;
  galleryHighlight: string;
  galleryCta: string;
  galleryLoading: string;
  galleryImageFailed: string;

  // About page
  aboutTitle: string;
  aboutSubtitle: string;
  aboutStory: string;
  aboutStoryP1: string;
  aboutStoryP2: string;
  aboutCtaTitle: string;
  aboutCtaButton: string;
  statProjects: string;
  statExperience: string;
  statRating: string;
  statInsured: string;
  aboutLicensed: string;
  aboutLicensedDesc: string;
  aboutFamily: string;
  aboutFamilyDesc: string;
  aboutQuality: string;
  aboutQualityDesc: string;
  aboutSkilled: string;
  aboutSkilledDesc: string;

  // Services page
  servicesPageTitle: string;
  servicesPageSubtitle: string;
  servicesNotSure: string;
  servicesNotSureDesc: string;
  servicesTalkExpert: string;

  // Contact page
  contactTitle: string;
  contactSubtitle: string;
  contactGetInTouch: string;
  contactGetInTouchDesc: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactHours: string;
  contactHoursValue: string;

  // Cookie consent
  cookieText: string;
  cookieAccept: string;

  // 404
  notFoundTitle: string;
  notFoundText: string;
  notFoundBack: string;

  // Get a Quote page
  getQuoteTitle: string;
  getQuoteHighlight: string;
  getQuoteSubtitle: string;
  getQuoteProjectType: string;
  getQuoteBudget: string;
  getQuoteTimeline: string;
  getQuotePropertyType: string;
  getQuoteNotes: string;
  getQuoteSubmit: string;
  getQuoteNoObligation: string;
  getQuoteSelectCity: string;

  // Hero slider
  heroSliderHeadline: string;
  heroSliderSubtext: string;
  heroSearchPlaceholder: string;
  heroZipPlaceholder: string;
  heroSearchCta: string;
};

export const translations: Record<Language, TranslationKeys> = {
  en: {
    navHome: "Home",
    navServices: "Services",
    navAiPreview: "AI Preview",
    navAbout: "About",
    navContact: "Contact",
    navAdmin: "Admin",
    navGetFreeEstimate: "Get Free Estimate",

    heroHeadline: "Get Matched With Trusted Roofing & Home Contractors in",
    heroHeadlineHighlight: "Florida",
    heroSubtitle: "Tell us about your project and compare quotes from licensed, insured professionals in your area. No obligation.",
    heroTrustLine: "Free quote · No obligation · Licensed & insured pros only · Serving Florida homeowners",
    trustLicensed: "Licensed & Insured",
    trustFastResponse: "Fast Response",
    trustLocalPros: "Local Florida Pros",
    trustNoObligation: "No Obligation",

    howItWorksTitle: "How It",
    howItWorksHighlight: "Works",
    step1Title: "Tell Us About Your Project",
    step1Desc: "Share a few details about your roofing or home project.",
    step2Title: "We Match You With Local Pros",
    step2Desc: "We connect you with qualified contractors in Florida.",
    step3Title: "Compare Quotes & Choose",
    step3Desc: "Review your options and choose what works for you.",

    servicesCoverTitle: "Services We",
    servicesCoverHighlight: "Cover",
    servicesCoverSubtitle: "We match you with licensed contractors for a wide range of home projects.",
    serviceRoofing: "Roof Replacement & Repair",
    serviceStormDamage: "Storm Damage Restoration",
    serviceKitchen: "Kitchen Remodeling",
    serviceBathroom: "Bathroom Remodeling",
    serviceRenovation: "General Home Renovation",
    serviceWindowsDoors: "Windows & Doors",
    serviceExterior: "Exterior & Siding",

    testimonialsTitle: "What Homeowners",
    testimonialsHighlight: "Say",

    faqTitle: "Frequently Asked",
    faqHighlight: "Questions",
    faqQ1: "Is Build Right USA a contractor?",
    faqA1: "No. We connect homeowners with independent contractors.",
    faqQ2: "How much does it cost?",
    faqA2: "Free. No obligation.",
    faqQ3: "Are contractors licensed?",
    faqA3: "They represent themselves as licensed and insured.",
    faqQ4: "Do I have to hire?",
    faqA4: "No. You decide.",

    getInTouchTitle: "Get In",
    getInTouchHighlight: "Touch",

    ctaReady: "Ready to Start Your Project?",
    ctaSubtitle: "Get a free, no-obligation estimate today. Our team is standing by to help.",
    ctaButton: "Get Your Free Quote →",

    servingTitle: "Serving Homeowners Across the",
    servingHighlight: "USA",

    formTitle: "Get Your Free Estimate",
    formFullName: "Full Name",
    formPhone: "Phone Number",
    formEmail: "Email Address",
    formZip: "ZIP Code",
    formSelectArea: "Select Service Area",
    formSelectService: "Select a Service",
    formProjectDetails: "Project Details (optional)",
    formConsent: "I agree to the Terms & Privacy Policy and consent to be contacted.",
    formCta: "Get My Free Quote",
    formLegal: 'By clicking "Get My Free Quote," you agree to our Terms and Privacy Policy and consent to be contacted by phone, SMS, and email.',
    formPhoneError: "Please enter a valid US phone number.",
    formFillAll: "Please fill out all fields",
    formConsentRequired: "Please agree to the Terms & Privacy Policy",
    formSubmitting: "Submitting your request…",
    formMatching: "Matching you with contractors near ZIP",
    formFoundPros: "available pros in your area",
    formAllSet: "You're all set!",
    formAllSetDesc: "A contractor will contact you shortly to schedule your free estimate.",
    formCallMeNow: "Call Me Now",
    formCallbackConfirm: "Got it — we'll let you know once contractor outreach reopens.",
    formNeedHelp: "Need help right now?",
    formSubmitAnother: "Submit Another Request",
    formError: "Something went wrong. Please call us instead.",

    footerDisclaimer: "Build Right USA is a lead generation service that connects homeowners with licensed contractors. We do not perform construction services or employ contractors directly. All contractors are required to maintain appropriate licenses and insurance where applicable.",
    footerReferral: "Build Right USA is a contractor referral platform. We do not perform construction services.",
    footerQuickLinks: "Quick Links",
    footerServiceAreas: "Service Areas",
    footerContactUs: "Contact Us",
    footerPriceDisclaimer: "Project estimates or price ranges displayed on this website are preliminary and intended for informational purposes only. Final pricing will depend on on-site inspection, project scope, materials, and contractor evaluation. Build Right USA does not guarantee pricing or project availability.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Service",

    galleryTitle: "Real",
    galleryHighlight: "Projects",
    galleryCta: "free estimate in 60 seconds",
    galleryLoading: "Loading gallery...",
    galleryImageFailed: "Image failed to load",

    aboutTitle: "About",
    aboutSubtitle: "Built on integrity. Driven by craftsmanship.",
    aboutStory: "Our Story",
    aboutStoryP1: "Build Right USA was founded with a simple mission: deliver honest, high-quality construction services that homeowners can truly rely on. We started as a small local crew and have grown into a full-service construction company — but our values haven't changed.",
    aboutStoryP2: "Every project we take on is treated like it's our own home. We use premium materials, employ skilled tradespeople, and communicate openly at every step. From the first phone call to final walkthrough, our goal is to exceed your expectations.",
    aboutCtaTitle: "Let's Build Something Great Together",
    aboutCtaButton: "Get Your Free Estimate →",
    statProjects: "Projects Completed",
    statExperience: "Years Experience",
    statRating: "Average Rating",
    statInsured: "Licensed & Insured",
    aboutLicensed: "Licensed & Insured",
    aboutLicensedDesc: "Fully licensed professionals with comprehensive insurance coverage for your peace of mind.",
    aboutFamily: "Family-Owned",
    aboutFamilyDesc: "We treat every client like a neighbor, because many of them are.",
    aboutQuality: "Quality Materials",
    aboutQualityDesc: "We partner with top manufacturers to use only the best materials on every job.",
    aboutSkilled: "Skilled Tradespeople",
    aboutSkilledDesc: "Our team includes certified specialists across every trade we offer.",

    servicesPageTitle: "Our",
    servicesPageSubtitle: "Comprehensive construction and remodeling solutions for every part of your home.",
    servicesNotSure: "Not sure what you need?",
    servicesNotSureDesc: "Our team can help you figure out the best plan for your home.",
    servicesTalkExpert: "Talk to an Expert",

    contactTitle: "Contact",
    contactSubtitle: "Ready to get started? Fill out the form below or reach out directly.",
    contactGetInTouch: "Get In Touch",
    contactGetInTouchDesc: "Have a question or ready for your free estimate? Fill out the form and we'll get back to you within 24 hours.",
    contactPhone: "Phone",
    contactEmail: "Email",
    contactAddress: "Address",
    contactHours: "Hours",
    contactHoursValue: "Mon–Fri: 7AM–6PM | Sat: 8AM–2PM",

    cookieText: "This website may use cookies and analytics tools to improve user experience and analyze traffic. By continuing to use the website you agree to the use of cookies.",
    cookieAccept: "Accept",

    notFoundTitle: "404",
    notFoundText: "Oops! Page not found",
    notFoundBack: "Return to Home",

    getQuoteTitle: "Get Your",
    getQuoteHighlight: "Free Quote",
    getQuoteSubtitle: "Fill out the form below and a licensed contractor will reach out within 24 hours.",
    getQuoteProjectType: "Project Type *",
    getQuoteBudget: "Budget Range",
    getQuoteTimeline: "Timeline",
    getQuotePropertyType: "Property Type",
    getQuoteNotes: "Additional notes (optional)",
    getQuoteSubmit: "Get Your Free Quote",
    getQuoteNoObligation: "No obligation. 100% free estimates from verified contractors.",
    getQuoteSelectCity: "Select City *",
    heroSliderHeadline: "Find Trusted Contractors Near You — Fast & Easy",
    heroSliderSubtext: "Get connected with licensed professionals for roofing, remodeling, solar, and more.",
    heroSearchPlaceholder: "What service do you need?",
    heroZipPlaceholder: "ZIP Code",
    heroSearchCta: "Get Free Quote",
  },

  es: {
    navHome: "Inicio",
    navServices: "Servicios",
    navAiPreview: "Vista IA",
    navAbout: "Nosotros",
    navContact: "Contacto",
    navAdmin: "Admin",
    navGetFreeEstimate: "Cotización Gratis",

    heroHeadline: "Conecta con contratistas confiables de techos y hogar en",
    heroHeadlineHighlight: "Florida",
    heroSubtitle: "Cuéntanos sobre tu proyecto y compara cotizaciones de profesionales con licencia y seguro. Sin compromiso.",
    heroTrustLine: "Cotización gratis · Sin compromiso · Solo profesionales con licencia · Servimos a propietarios en Florida",
    trustLicensed: "Con licencia y seguro",
    trustFastResponse: "Respuesta rápida",
    trustLocalPros: "Profesionales locales",
    trustNoObligation: "Sin compromiso",

    howItWorksTitle: "Cómo",
    howItWorksHighlight: "Funciona",
    step1Title: "Cuéntanos sobre tu proyecto",
    step1Desc: "Comparte algunos detalles sobre tu proyecto de techo o hogar.",
    step2Title: "Te conectamos con profesionales",
    step2Desc: "Te conectamos con contratistas calificados en Florida.",
    step3Title: "Compara cotizaciones y elige",
    step3Desc: "Revisa tus opciones y elige lo que mejor te convenga.",

    servicesCoverTitle: "Servicios que",
    servicesCoverHighlight: "Ofrecemos",
    servicesCoverSubtitle: "Te conectamos con contratistas con licencia para una amplia gama de proyectos.",
    serviceRoofing: "Reemplazo y reparación de techos",
    serviceStormDamage: "Restauración por daños de tormentas",
    serviceKitchen: "Remodelación de cocinas",
    serviceBathroom: "Remodelación de baños",
    serviceRenovation: "Renovación general del hogar",
    serviceWindowsDoors: "Ventanas y puertas",
    serviceExterior: "Exteriores y revestimiento",

    testimonialsTitle: "Lo que dicen los",
    testimonialsHighlight: "propietarios",

    faqTitle: "Preguntas",
    faqHighlight: "Frecuentes",
    faqQ1: "¿Build Right USA es un contratista?",
    faqA1: "No. Conectamos propietarios con contratistas independientes.",
    faqQ2: "¿Cuánto cuesta?",
    faqA2: "Gratis. Sin compromiso.",
    faqQ3: "¿Los contratistas tienen licencia?",
    faqA3: "Ellos se presentan como licenciados y asegurados.",
    faqQ4: "¿Tengo que contratar?",
    faqA4: "No. Tú decides.",

    getInTouchTitle: "Ponte en",
    getInTouchHighlight: "Contacto",

    ctaReady: "¿Listo para comenzar tu proyecto?",
    ctaSubtitle: "Obtén una cotización gratuita hoy. Nuestro equipo está listo para ayudarte.",
    ctaButton: "Obtén tu cotización gratis →",

    servingTitle: "Sirviendo propietarios en",
    servingHighlight: "EE.UU.",

    formTitle: "Obtén tu cotización gratis",
    formFullName: "Nombre completo",
    formPhone: "Número de teléfono",
    formEmail: "Correo electrónico",
    formZip: "Código postal",
    formSelectArea: "Selecciona área de servicio",
    formSelectService: "Selecciona un servicio",
    formProjectDetails: "Detalles del proyecto (opcional)",
    formConsent: "Acepto los Términos y la Política de Privacidad y consiento ser contactado.",
    formCta: "Obtén tu cotización gratis",
    formLegal: 'Al hacer clic en "Obtén tu cotización gratis," aceptas nuestros Términos y Política de Privacidad y consientes ser contactado por teléfono, SMS y correo.',
    formPhoneError: "Ingresa un número de teléfono válido de EE.UU.",
    formFillAll: "Por favor completa todos los campos",
    formConsentRequired: "Acepta los Términos y la Política de Privacidad",
    formSubmitting: "Enviando tu solicitud…",
    formMatching: "Buscando contratistas cerca del código postal",
    formFoundPros: "profesionales disponibles en tu área",
    formAllSet: "¡Todo listo!",
    formAllSetDesc: "Un contratista te contactará pronto para programar tu estimación gratuita.",
    formCallMeNow: "Llámame ahora",
    formCallbackConfirm: "Listo — te avisaremos cuando se reanuden los contactos con contratistas.",
    formNeedHelp: "¿Necesitas ayuda ahora?",
    formSubmitAnother: "Enviar otra solicitud",
    formError: "Algo salió mal. Por favor llámanos.",

    footerDisclaimer: "Build Right USA es un servicio de generación de clientes potenciales que conecta propietarios con contratistas con licencia. No realizamos servicios de construcción ni empleamos contratistas directamente.",
    footerReferral: "Build Right USA es una plataforma de referencia de contratistas. No realizamos servicios de construcción.",
    footerQuickLinks: "Enlaces rápidos",
    footerServiceAreas: "Áreas de servicio",
    footerContactUs: "Contáctenos",
    footerPriceDisclaimer: "Las estimaciones de proyectos son preliminares y solo con fines informativos. El precio final depende de la inspección, alcance, materiales y evaluación del contratista.",
    footerPrivacy: "Política de privacidad",
    footerTerms: "Términos de servicio",

    galleryTitle: "Proyectos",
    galleryHighlight: "Reales",
    galleryCta: "cotización gratis en 60 segundos",
    galleryLoading: "Cargando galería...",
    galleryImageFailed: "No se pudo cargar la imagen",

    aboutTitle: "Sobre",
    aboutSubtitle: "Construido con integridad. Impulsado por la artesanía.",
    aboutStory: "Nuestra historia",
    aboutStoryP1: "Build Right USA fue fundada con una misión simple: entregar servicios de construcción honestos y de alta calidad en los que los propietarios realmente puedan confiar.",
    aboutStoryP2: "Cada proyecto que tomamos se trata como si fuera nuestra propia casa. Usamos materiales premium y comunicamos abiertamente en cada paso.",
    aboutCtaTitle: "Construyamos algo grandioso juntos",
    aboutCtaButton: "Obtén tu estimación gratis →",
    statProjects: "Proyectos completados",
    statExperience: "Años de experiencia",
    statRating: "Calificación promedio",
    statInsured: "Con licencia y seguro",
    aboutLicensed: "Con licencia y seguro",
    aboutLicensedDesc: "Profesionales con licencia completa y cobertura de seguro integral.",
    aboutFamily: "Empresa familiar",
    aboutFamilyDesc: "Tratamos a cada cliente como un vecino.",
    aboutQuality: "Materiales de calidad",
    aboutQualityDesc: "Nos asociamos con los mejores fabricantes.",
    aboutSkilled: "Trabajadores calificados",
    aboutSkilledDesc: "Nuestro equipo incluye especialistas certificados.",

    servicesPageTitle: "Nuestros",
    servicesPageSubtitle: "Soluciones integrales de construcción y remodelación para cada parte de tu hogar.",
    servicesNotSure: "¿No sabes qué necesitas?",
    servicesNotSureDesc: "Nuestro equipo puede ayudarte a encontrar el mejor plan.",
    servicesTalkExpert: "Habla con un experto",

    contactTitle: "Contacto",
    contactSubtitle: "¿Listo para comenzar? Completa el formulario o contáctanos directamente.",
    contactGetInTouch: "Ponte en contacto",
    contactGetInTouchDesc: "¿Tienes preguntas? Completa el formulario y te responderemos en 24 horas.",
    contactPhone: "Teléfono",
    contactEmail: "Correo",
    contactAddress: "Dirección",
    contactHours: "Horario",
    contactHoursValue: "Lun–Vie: 7AM–6PM | Sáb: 8AM–2PM",

    cookieText: "Este sitio web puede usar cookies para mejorar la experiencia del usuario. Al continuar, aceptas el uso de cookies.",
    cookieAccept: "Aceptar",

    notFoundTitle: "404",
    notFoundText: "¡Ups! Página no encontrada",
    notFoundBack: "Volver al inicio",

    getQuoteTitle: "Obtén tu",
    getQuoteHighlight: "Cotización Gratis",
    getQuoteSubtitle: "Completa el formulario y un contratista con licencia te contactará en 24 horas.",
    getQuoteProjectType: "Tipo de proyecto *",
    getQuoteBudget: "Rango de presupuesto",
    getQuoteTimeline: "Cronograma",
    getQuotePropertyType: "Tipo de propiedad",
    getQuoteNotes: "Notas adicionales (opcional)",
    getQuoteSubmit: "Obtén tu cotización gratis",
    getQuoteNoObligation: "Sin compromiso. Cotizaciones 100% gratis de contratistas verificados.",
    getQuoteSelectCity: "Selecciona ciudad *",
    heroSliderHeadline: "Encuentra contratistas confiables cerca de ti — Rápido y fácil",
    heroSliderSubtext: "Conéctate con profesionales licenciados para techos, remodelaciones, solar y más.",
    heroSearchPlaceholder: "¿Qué servicio necesitas?",
    heroZipPlaceholder: "Código postal",
    heroSearchCta: "Cotización gratis",
  },

  ar: {
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navAiPreview: "معاينة AI",
    navAbout: "من نحن",
    navContact: "اتصل بنا",
    navAdmin: "المسؤول",
    navGetFreeEstimate: "تقدير مجاني",

    heroHeadline: "تواصل مع مقاولين موثوقين للأسقف والمنازل في",
    heroHeadlineHighlight: "فلوريدا",
    heroSubtitle: "أخبرنا عن مشروعك وقارن بين عروض الأسعار من محترفين مرخصين ومؤمنين. بدون التزام.",
    heroTrustLine: "تقدير مجاني · بدون التزام · محترفون مرخصون فقط",
    trustLicensed: "مرخص ومؤمن",
    trustFastResponse: "استجابة سريعة",
    trustLocalPros: "محترفون محليون",
    trustNoObligation: "بدون التزام",

    howItWorksTitle: "كيف",
    howItWorksHighlight: "يعمل",
    step1Title: "أخبرنا عن مشروعك",
    step1Desc: "شارك بعض التفاصيل حول مشروعك.",
    step2Title: "نوصلك بمحترفين محليين",
    step2Desc: "نربطك بمقاولين مؤهلين في فلوريدا.",
    step3Title: "قارن العروض واختر",
    step3Desc: "راجع خياراتك واختر ما يناسبك.",

    servicesCoverTitle: "الخدمات التي",
    servicesCoverHighlight: "نقدمها",
    servicesCoverSubtitle: "نوصلك بمقاولين مرخصين لمجموعة واسعة من المشاريع.",
    serviceRoofing: "استبدال وإصلاح الأسقف",
    serviceStormDamage: "ترميم أضرار العواصف",
    serviceKitchen: "تجديد المطبخ",
    serviceBathroom: "تجديد الحمام",
    serviceRenovation: "تجديد المنزل العام",
    serviceWindowsDoors: "النوافذ والأبواب",
    serviceExterior: "الواجهة والتغليف",

    testimonialsTitle: "ماذا يقول",
    testimonialsHighlight: "العملاء",

    faqTitle: "الأسئلة",
    faqHighlight: "الشائعة",
    faqQ1: "هل Build Right USA مقاول؟",
    faqA1: "لا. نحن نربط أصحاب المنازل بمقاولين مستقلين.",
    faqQ2: "كم يكلف؟",
    faqA2: "مجاني. بدون التزام.",
    faqQ3: "هل المقاولون مرخصون؟",
    faqA3: "يقدمون أنفسهم كمرخصين ومؤمنين.",
    faqQ4: "هل يجب أن أوظف؟",
    faqA4: "لا. القرار لك.",

    getInTouchTitle: "تواصل",
    getInTouchHighlight: "معنا",

    ctaReady: "مستعد لبدء مشروعك؟",
    ctaSubtitle: "احصل على تقدير مجاني بدون التزام اليوم.",
    ctaButton: "احصل على تقدير مجاني ←",

    servingTitle: "نخدم أصحاب المنازل في",
    servingHighlight: "أمريكا",

    formTitle: "احصل على تقدير مجاني",
    formFullName: "الاسم الكامل",
    formPhone: "رقم الهاتف",
    formEmail: "البريد الإلكتروني",
    formZip: "الرمز البريدي",
    formSelectArea: "اختر منطقة الخدمة",
    formSelectService: "اختر خدمة",
    formProjectDetails: "تفاصيل المشروع (اختياري)",
    formConsent: "أوافق على الشروط وسياسة الخصوصية وأوافق على الاتصال بي.",
    formCta: "احصل على تقديرك المجاني",
    formLegal: "بالنقر على الزر، أنت توافق على الشروط وسياسة الخصوصية وتوافق على الاتصال بك عبر الهاتف والرسائل.",
    formPhoneError: "أدخل رقم هاتف أمريكي صالح.",
    formFillAll: "يرجى ملء جميع الحقول",
    formConsentRequired: "يرجى الموافقة على الشروط",
    formSubmitting: "جاري إرسال طلبك…",
    formMatching: "جاري البحث عن مقاولين بالقرب من الرمز البريدي",
    formFoundPros: "محترفون متاحون في منطقتك",
    formAllSet: "تم بنجاح!",
    formAllSetDesc: "سيتواصل معك مقاول قريباً لتحديد موعد التقدير المجاني.",
    formCallMeNow: "اتصل بي الآن",
    formCallbackConfirm: "تم — سنخبرك عند استئناف التواصل مع المقاولين.",
    formNeedHelp: "تحتاج مساعدة الآن؟",
    formSubmitAnother: "إرسال طلب آخر",
    formError: "حدث خطأ. يرجى الاتصال بنا.",

    footerDisclaimer: "Build Right USA خدمة تربط أصحاب المنازل بمقاولين مرخصين. نحن لا نقوم بأعمال البناء.",
    footerReferral: "Build Right USA منصة إحالة مقاولين. نحن لا نقوم بأعمال البناء.",
    footerQuickLinks: "روابط سريعة",
    footerServiceAreas: "مناطق الخدمة",
    footerContactUs: "اتصل بنا",
    footerPriceDisclaimer: "تقديرات الأسعار المعروضة أولية ولأغراض إعلامية فقط.",
    footerPrivacy: "سياسة الخصوصية",
    footerTerms: "شروط الخدمة",

    galleryTitle: "مشاريع",
    galleryHighlight: "حقيقية",
    galleryCta: "تقدير مجاني في 60 ثانية",
    galleryLoading: "جاري تحميل المعرض...",
    galleryImageFailed: "فشل تحميل الصورة",

    aboutTitle: "عن",
    aboutSubtitle: "مبني على النزاهة. مدفوع بالحرفية.",
    aboutStory: "قصتنا",
    aboutStoryP1: "تأسست Build Right USA بمهمة بسيطة: تقديم خدمات بناء صادقة وعالية الجودة.",
    aboutStoryP2: "كل مشروع نأخذه نعامله كأنه منزلنا الخاص.",
    aboutCtaTitle: "لنبني شيئاً رائعاً معاً",
    aboutCtaButton: "احصل على تقدير مجاني ←",
    statProjects: "مشاريع مكتملة",
    statExperience: "سنوات خبرة",
    statRating: "متوسط التقييم",
    statInsured: "مرخص ومؤمن",
    aboutLicensed: "مرخص ومؤمن",
    aboutLicensedDesc: "محترفون مرخصون بالكامل مع تغطية تأمينية شاملة.",
    aboutFamily: "شركة عائلية",
    aboutFamilyDesc: "نعامل كل عميل كجار.",
    aboutQuality: "مواد عالية الجودة",
    aboutQualityDesc: "نتعاون مع أفضل المصنعين.",
    aboutSkilled: "حرفيون ماهرون",
    aboutSkilledDesc: "يضم فريقنا متخصصين معتمدين.",

    servicesPageTitle: "خدماتنا",
    servicesPageSubtitle: "حلول بناء وتجديد شاملة لكل جزء من منزلك.",
    servicesNotSure: "لا تعرف ما تحتاج؟",
    servicesNotSureDesc: "فريقنا يمكنه مساعدتك في إيجاد أفضل خطة.",
    servicesTalkExpert: "تحدث مع خبير",

    contactTitle: "اتصل",
    contactSubtitle: "مستعد للبدء؟ املأ النموذج أو تواصل معنا مباشرة.",
    contactGetInTouch: "تواصل معنا",
    contactGetInTouchDesc: "لديك سؤال؟ املأ النموذج وسنرد عليك خلال 24 ساعة.",
    contactPhone: "الهاتف",
    contactEmail: "البريد",
    contactAddress: "العنوان",
    contactHours: "ساعات العمل",
    contactHoursValue: "الاثنين–الجمعة: 7ص–6م | السبت: 8ص–2م",

    cookieText: "قد يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربة المستخدم. بالمتابعة، أنت توافق على استخدام ملفات تعريف الارتباط.",
    cookieAccept: "قبول",

    notFoundTitle: "404",
    notFoundText: "عذراً! الصفحة غير موجودة",
    notFoundBack: "العودة إلى الرئيسية",

    getQuoteTitle: "احصل على",
    getQuoteHighlight: "تقدير مجاني",
    getQuoteSubtitle: "املأ النموذج وسيتواصل معك مقاول مرخص خلال 24 ساعة.",
    getQuoteProjectType: "نوع المشروع *",
    getQuoteBudget: "نطاق الميزانية",
    getQuoteTimeline: "الجدول الزمني",
    getQuotePropertyType: "نوع العقار",
    getQuoteNotes: "ملاحظات إضافية (اختياري)",
    getQuoteSubmit: "احصل على تقديرك المجاني",
    getQuoteNoObligation: "بدون التزام. تقديرات مجانية 100% من مقاولين موثقين.",
    getQuoteSelectCity: "اختر المدينة *",
    heroSliderHeadline: "ابحث عن مقاولين موثوقين بالقرب منك — بسرعة وسهولة",
    heroSliderSubtext: "تواصل مع محترفين مرخصين للأسقف والتجديد والطاقة الشمسية والمزيد.",
    heroSearchPlaceholder: "ما الخدمة التي تحتاجها؟",
    heroZipPlaceholder: "الرمز البريدي",
    heroSearchCta: "عرض سعر مجاني",
  },

  ru: {
    navHome: "Главная",
    navServices: "Услуги",
    navAiPreview: "ИИ Превью",
    navAbout: "О нас",
    navContact: "Контакты",
    navAdmin: "Админ",
    navGetFreeEstimate: "Бесплатная оценка",

    heroHeadline: "Найдите проверенных подрядчиков для кровли и дома в",
    heroHeadlineHighlight: "Флориде",
    heroSubtitle: "Расскажите о своём проекте и сравните предложения от лицензированных специалистов. Без обязательств.",
    heroTrustLine: "Бесплатно · Без обязательств · Только лицензированные специалисты",
    trustLicensed: "Лицензия и страховка",
    trustFastResponse: "Быстрый ответ",
    trustLocalPros: "Местные специалисты",
    trustNoObligation: "Без обязательств",

    howItWorksTitle: "Как это",
    howItWorksHighlight: "работает",
    step1Title: "Расскажите о проекте",
    step1Desc: "Поделитесь деталями о вашем проекте.",
    step2Title: "Мы найдём специалистов",
    step2Desc: "Свяжем вас с квалифицированными подрядчиками.",
    step3Title: "Сравните и выберите",
    step3Desc: "Изучите варианты и выберите лучший.",

    servicesCoverTitle: "Услуги, которые мы",
    servicesCoverHighlight: "предоставляем",
    servicesCoverSubtitle: "Связываем вас с лицензированными подрядчиками для различных проектов.",
    serviceRoofing: "Замена и ремонт крыши",
    serviceStormDamage: "Восстановление после ураганов",
    serviceKitchen: "Ремонт кухни",
    serviceBathroom: "Ремонт ванной",
    serviceRenovation: "Общий ремонт дома",
    serviceWindowsDoors: "Окна и двери",
    serviceExterior: "Фасад и облицовка",

    testimonialsTitle: "Что говорят",
    testimonialsHighlight: "клиенты",

    faqTitle: "Часто задаваемые",
    faqHighlight: "вопросы",
    faqQ1: "Build Right USA — подрядчик?",
    faqA1: "Нет. Мы связываем домовладельцев с независимыми подрядчиками.",
    faqQ2: "Сколько это стоит?",
    faqA2: "Бесплатно. Без обязательств.",
    faqQ3: "Подрядчики лицензированы?",
    faqA3: "Они представляют себя как лицензированные и застрахованные.",
    faqQ4: "Обязан ли я нанимать?",
    faqA4: "Нет. Решение за вами.",

    getInTouchTitle: "Свяжитесь",
    getInTouchHighlight: "с нами",

    ctaReady: "Готовы начать проект?",
    ctaSubtitle: "Получите бесплатную оценку сегодня. Наша команда готова помочь.",
    ctaButton: "Получить бесплатную оценку →",

    servingTitle: "Обслуживаем домовладельцев по всей",
    servingHighlight: "Америке",

    formTitle: "Получите бесплатную оценку",
    formFullName: "Полное имя",
    formPhone: "Номер телефона",
    formEmail: "Электронная почта",
    formZip: "Почтовый индекс",
    formSelectArea: "Выберите район обслуживания",
    formSelectService: "Выберите услугу",
    formProjectDetails: "Детали проекта (необязательно)",
    formConsent: "Я согласен с Условиями и Политикой конфиденциальности.",
    formCta: "Получить бесплатную оценку",
    formLegal: "Нажимая кнопку, вы соглашаетесь с нашими Условиями и Политикой конфиденциальности.",
    formPhoneError: "Введите действительный номер телефона США.",
    formFillAll: "Заполните все поля",
    formConsentRequired: "Примите условия и политику конфиденциальности",
    formSubmitting: "Отправка запроса…",
    formMatching: "Подбираем подрядчиков рядом с индексом",
    formFoundPros: "доступных специалистов в вашем районе",
    formAllSet: "Готово!",
    formAllSetDesc: "Подрядчик свяжется с вами в ближайшее время.",
    formCallMeNow: "Позвоните мне",
    formCallbackConfirm: "Готово — мы сообщим вам, когда возобновится связь с подрядчиками.",
    formNeedHelp: "Нужна помощь прямо сейчас?",
    formSubmitAnother: "Отправить ещё запрос",
    formError: "Что-то пошло не так. Позвоните нам.",

    footerDisclaimer: "Build Right USA — сервис, связывающий домовладельцев с лицензированными подрядчиками. Мы не выполняем строительные работы.",
    footerReferral: "Build Right USA — платформа рекомендаций подрядчиков.",
    footerQuickLinks: "Быстрые ссылки",
    footerServiceAreas: "Районы обслуживания",
    footerContactUs: "Связаться с нами",
    footerPriceDisclaimer: "Оценки проектов являются предварительными и носят информационный характер.",
    footerPrivacy: "Политика конфиденциальности",
    footerTerms: "Условия использования",

    galleryTitle: "Реальные",
    galleryHighlight: "проекты",
    galleryCta: "бесплатная оценка за 60 секунд",
    galleryLoading: "Загрузка галереи...",
    galleryImageFailed: "Не удалось загрузить изображение",

    aboutTitle: "О",
    aboutSubtitle: "Построено на честности. Движимо мастерством.",
    aboutStory: "Наша история",
    aboutStoryP1: "Build Right USA основана с простой миссией: предоставлять честные и качественные строительные услуги.",
    aboutStoryP2: "Каждый проект мы ведём как свой собственный дом.",
    aboutCtaTitle: "Давайте построим что-то великое вместе",
    aboutCtaButton: "Получить бесплатную оценку →",
    statProjects: "Проектов завершено",
    statExperience: "Лет опыта",
    statRating: "Средний рейтинг",
    statInsured: "Лицензия и страховка",
    aboutLicensed: "Лицензия и страховка",
    aboutLicensedDesc: "Полностью лицензированные специалисты со страховкой.",
    aboutFamily: "Семейный бизнес",
    aboutFamilyDesc: "Каждого клиента мы считаем соседом.",
    aboutQuality: "Качественные материалы",
    aboutQualityDesc: "Сотрудничаем с лучшими производителями.",
    aboutSkilled: "Квалифицированные мастера",
    aboutSkilledDesc: "В нашей команде — сертифицированные специалисты.",

    servicesPageTitle: "Наши",
    servicesPageSubtitle: "Комплексные решения для строительства и ремонта вашего дома.",
    servicesNotSure: "Не знаете, что нужно?",
    servicesNotSureDesc: "Наша команда поможет найти лучший план.",
    servicesTalkExpert: "Поговорить с экспертом",

    contactTitle: "Контакты",
    contactSubtitle: "Готовы начать? Заполните форму или свяжитесь с нами напрямую.",
    contactGetInTouch: "Связаться с нами",
    contactGetInTouchDesc: "Есть вопрос? Заполните форму, и мы ответим в течение 24 часов.",
    contactPhone: "Телефон",
    contactEmail: "Почта",
    contactAddress: "Адрес",
    contactHours: "Часы работы",
    contactHoursValue: "Пн–Пт: 7:00–18:00 | Сб: 8:00–14:00",

    cookieText: "Этот сайт может использовать cookies для улучшения вашего опыта. Продолжая использование, вы соглашаетесь.",
    cookieAccept: "Принять",

    notFoundTitle: "404",
    notFoundText: "Страница не найдена",
    notFoundBack: "Вернуться на главную",

    getQuoteTitle: "Получите",
    getQuoteHighlight: "бесплатную оценку",
    getQuoteSubtitle: "Заполните форму, и лицензированный подрядчик свяжется с вами в течение 24 часов.",
    getQuoteProjectType: "Тип проекта *",
    getQuoteBudget: "Бюджет",
    getQuoteTimeline: "Сроки",
    getQuotePropertyType: "Тип недвижимости",
    getQuoteNotes: "Дополнительные заметки (необязательно)",
    getQuoteSubmit: "Получить бесплатную оценку",
    getQuoteNoObligation: "Без обязательств. 100% бесплатные оценки от проверенных подрядчиков.",
    getQuoteSelectCity: "Выберите город *",
    heroSliderHeadline: "Найдите надёжных подрядчиков рядом — быстро и просто",
    heroSliderSubtext: "Свяжитесь с лицензированными специалистами по кровле, ремонту, солнечным панелям и другим услугам.",
    heroSearchPlaceholder: "Какая услуга вам нужна?",
    heroZipPlaceholder: "Почтовый индекс",
    heroSearchCta: "Бесплатная оценка",
  },

  pt: {
    navHome: "Início",
    navServices: "Serviços",
    navAiPreview: "Prévia IA",
    navAbout: "Sobre",
    navContact: "Contato",
    navAdmin: "Admin",
    navGetFreeEstimate: "Orçamento Grátis",

    heroHeadline: "Conecte-se com empreiteiros confiáveis para telhados e casas na",
    heroHeadlineHighlight: "Flórida",
    heroSubtitle: "Conte-nos sobre seu projeto e compare orçamentos de profissionais licenciados e segurados. Sem compromisso.",
    heroTrustLine: "Orçamento grátis · Sem compromisso · Apenas profissionais licenciados",
    trustLicensed: "Licenciado e segurado",
    trustFastResponse: "Resposta rápida",
    trustLocalPros: "Profissionais locais",
    trustNoObligation: "Sem compromisso",

    howItWorksTitle: "Como",
    howItWorksHighlight: "Funciona",
    step1Title: "Conte sobre seu projeto",
    step1Desc: "Compartilhe alguns detalhes sobre seu projeto.",
    step2Title: "Conectamos você com profissionais",
    step2Desc: "Conectamos você com empreiteiros qualificados.",
    step3Title: "Compare orçamentos e escolha",
    step3Desc: "Revise suas opções e escolha o melhor.",

    servicesCoverTitle: "Serviços que",
    servicesCoverHighlight: "Oferecemos",
    servicesCoverSubtitle: "Conectamos você com empreiteiros licenciados para diversos projetos.",
    serviceRoofing: "Substituição e reparo de telhados",
    serviceStormDamage: "Restauração de danos por tempestades",
    serviceKitchen: "Reforma de cozinha",
    serviceBathroom: "Reforma de banheiro",
    serviceRenovation: "Reforma geral da casa",
    serviceWindowsDoors: "Janelas e portas",
    serviceExterior: "Exterior e revestimento",

    testimonialsTitle: "O que dizem os",
    testimonialsHighlight: "proprietários",

    faqTitle: "Perguntas",
    faqHighlight: "Frequentes",
    faqQ1: "A Build Right USA é um empreiteiro?",
    faqA1: "Não. Conectamos proprietários com empreiteiros independentes.",
    faqQ2: "Quanto custa?",
    faqA2: "Grátis. Sem compromisso.",
    faqQ3: "Os empreiteiros são licenciados?",
    faqA3: "Eles se apresentam como licenciados e segurados.",
    faqQ4: "Preciso contratar?",
    faqA4: "Não. Você decide.",

    getInTouchTitle: "Entre em",
    getInTouchHighlight: "Contato",

    ctaReady: "Pronto para começar seu projeto?",
    ctaSubtitle: "Obtenha um orçamento gratuito hoje. Nossa equipe está pronta para ajudar.",
    ctaButton: "Obtenha seu orçamento grátis →",

    servingTitle: "Atendendo proprietários em todo",
    servingHighlight: "EUA",

    formTitle: "Obtenha seu orçamento grátis",
    formFullName: "Nome completo",
    formPhone: "Número de telefone",
    formEmail: "E-mail",
    formZip: "CEP",
    formSelectArea: "Selecione a área de serviço",
    formSelectService: "Selecione um serviço",
    formProjectDetails: "Detalhes do projeto (opcional)",
    formConsent: "Concordo com os Termos e Política de Privacidade e aceito ser contatado.",
    formCta: "Obter meu orçamento grátis",
    formLegal: "Ao clicar, você concorda com nossos Termos e Política de Privacidade.",
    formPhoneError: "Insira um número de telefone dos EUA válido.",
    formFillAll: "Preencha todos os campos",
    formConsentRequired: "Aceite os termos e política de privacidade",
    formSubmitting: "Enviando sua solicitação…",
    formMatching: "Buscando empreiteiros perto do CEP",
    formFoundPros: "profissionais disponíveis na sua área",
    formAllSet: "Tudo pronto!",
    formAllSetDesc: "Um empreiteiro entrará em contato em breve.",
    formCallMeNow: "Ligue-me agora",
    formCallbackConfirm: "Pronto — avisaremos quando o contato com empreiteiros for retomado.",
    formNeedHelp: "Precisa de ajuda agora?",
    formSubmitAnother: "Enviar outra solicitação",
    formError: "Algo deu errado. Ligue para nós.",

    footerDisclaimer: "Build Right USA conecta proprietários com empreiteiros licenciados. Não realizamos serviços de construção.",
    footerReferral: "Build Right USA é uma plataforma de referência de empreiteiros.",
    footerQuickLinks: "Links rápidos",
    footerServiceAreas: "Áreas de serviço",
    footerContactUs: "Contate-nos",
    footerPriceDisclaimer: "Estimativas de projetos são preliminares e apenas para fins informativos.",
    footerPrivacy: "Política de Privacidade",
    footerTerms: "Termos de Serviço",

    galleryTitle: "Projetos",
    galleryHighlight: "Reais",
    galleryCta: "orçamento grátis em 60 segundos",
    galleryLoading: "Carregando galeria...",
    galleryImageFailed: "Falha ao carregar imagem",

    aboutTitle: "Sobre",
    aboutSubtitle: "Construído com integridade. Movido pela excelência.",
    aboutStory: "Nossa história",
    aboutStoryP1: "Build Right USA foi fundada com uma missão simples: serviços de construção honestos e de alta qualidade.",
    aboutStoryP2: "Cada projeto é tratado como se fosse nossa própria casa.",
    aboutCtaTitle: "Vamos construir algo incrível juntos",
    aboutCtaButton: "Obtenha seu orçamento grátis →",
    statProjects: "Projetos concluídos",
    statExperience: "Anos de experiência",
    statRating: "Avaliação média",
    statInsured: "Licenciado e segurado",
    aboutLicensed: "Licenciado e segurado",
    aboutLicensedDesc: "Profissionais licenciados com cobertura de seguro completa.",
    aboutFamily: "Empresa familiar",
    aboutFamilyDesc: "Tratamos cada cliente como vizinho.",
    aboutQuality: "Materiais de qualidade",
    aboutQualityDesc: "Trabalhamos com os melhores fabricantes.",
    aboutSkilled: "Profissionais qualificados",
    aboutSkilledDesc: "Nossa equipe inclui especialistas certificados.",

    servicesPageTitle: "Nossos",
    servicesPageSubtitle: "Soluções completas de construção e reforma para sua casa.",
    servicesNotSure: "Não sabe o que precisa?",
    servicesNotSureDesc: "Nossa equipe pode ajudar a encontrar o melhor plano.",
    servicesTalkExpert: "Fale com um especialista",

    contactTitle: "Contato",
    contactSubtitle: "Pronto para começar? Preencha o formulário ou entre em contato diretamente.",
    contactGetInTouch: "Entre em contato",
    contactGetInTouchDesc: "Tem perguntas? Preencha o formulário e respondemos em 24 horas.",
    contactPhone: "Telefone",
    contactEmail: "E-mail",
    contactAddress: "Endereço",
    contactHours: "Horário",
    contactHoursValue: "Seg–Sex: 7h–18h | Sáb: 8h–14h",

    cookieText: "Este site pode usar cookies para melhorar sua experiência. Ao continuar, você concorda com o uso de cookies.",
    cookieAccept: "Aceitar",

    notFoundTitle: "404",
    notFoundText: "Ops! Página não encontrada",
    notFoundBack: "Voltar ao início",

    getQuoteTitle: "Obtenha seu",
    getQuoteHighlight: "Orçamento Grátis",
    getQuoteSubtitle: "Preencha o formulário e um empreiteiro licenciado entrará em contato em 24 horas.",
    getQuoteProjectType: "Tipo de projeto *",
    getQuoteBudget: "Faixa de orçamento",
    getQuoteTimeline: "Prazo",
    getQuotePropertyType: "Tipo de propriedade",
    getQuoteNotes: "Notas adicionais (opcional)",
    getQuoteSubmit: "Obter orçamento grátis",
    getQuoteNoObligation: "Sem compromisso. Orçamentos 100% grátis de empreiteiros verificados.",
    getQuoteSelectCity: "Selecione a cidade *",
    heroSliderHeadline: "Encontre empreiteiros confiáveis perto de você — Rápido e fácil",
    heroSliderSubtext: "Conecte-se com profissionais licenciados para telhados, reformas, solar e muito mais.",
    heroSearchPlaceholder: "Qual serviço você precisa?",
    heroZipPlaceholder: "CEP",
    heroSearchCta: "Orçamento grátis",
  },

  he: {
    navHome: "ראשי",
    navServices: "שירותים",
    navAiPreview: "תצוגה AI",
    navAbout: "אודות",
    navContact: "צור קשר",
    navAdmin: "מנהל",
    navGetFreeEstimate: "הצעת מחיר חינם",

    heroHeadline: "התחבר לקבלנים אמינים לגגות ובתים ב",
    heroHeadlineHighlight: "פלורידה",
    heroSubtitle: "ספר לנו על הפרויקט שלך והשווה הצעות ממקצוענים מורשים ומבוטחים. ללא התחייבות.",
    heroTrustLine: "הצעת מחיר חינם · ללא התחייבות · מקצוענים מורשים בלבד",
    trustLicensed: "מורשה ומבוטח",
    trustFastResponse: "תגובה מהירה",
    trustLocalPros: "מקצוענים מקומיים",
    trustNoObligation: "ללא התחייבות",

    howItWorksTitle: "איך זה",
    howItWorksHighlight: "עובד",
    step1Title: "ספר לנו על הפרויקט",
    step1Desc: "שתף כמה פרטים על הפרויקט שלך.",
    step2Title: "נחבר אותך עם מקצוענים",
    step2Desc: "נקשר אותך עם קבלנים מוסמכים בפלורידה.",
    step3Title: "השווה הצעות ובחר",
    step3Desc: "בדוק את האפשרויות ובחר את המתאימה.",

    servicesCoverTitle: "השירותים",
    servicesCoverHighlight: "שלנו",
    servicesCoverSubtitle: "מחברים אותך עם קבלנים מורשים למגוון רחב של פרויקטים.",
    serviceRoofing: "החלפה ותיקון גגות",
    serviceStormDamage: "שיקום נזקי סערה",
    serviceKitchen: "שיפוץ מטבח",
    serviceBathroom: "שיפוץ חדר אמבטיה",
    serviceRenovation: "שיפוץ כללי",
    serviceWindowsDoors: "חלונות ודלתות",
    serviceExterior: "חיצוני וחיפוי",

    testimonialsTitle: "מה אומרים",
    testimonialsHighlight: "הלקוחות",

    faqTitle: "שאלות",
    faqHighlight: "נפוצות",
    faqQ1: "האם Build Right USA קבלן?",
    faqA1: "לא. אנחנו מחברים בעלי בתים עם קבלנים עצמאיים.",
    faqQ2: "כמה זה עולה?",
    faqA2: "חינם. ללא התחייבות.",
    faqQ3: "האם הקבלנים מורשים?",
    faqA3: "הם מציגים את עצמם כמורשים ומבוטחים.",
    faqQ4: "האם אני חייב לשכור?",
    faqA4: "לא. אתה מחליט.",

    getInTouchTitle: "צור",
    getInTouchHighlight: "קשר",

    ctaReady: "מוכן להתחיל את הפרויקט?",
    ctaSubtitle: "קבל הצעת מחיר חינם היום. הצוות שלנו מוכן לעזור.",
    ctaButton: "← קבל הצעת מחיר חינם",

    servingTitle: "משרתים בעלי בתים ברחבי",
    servingHighlight: "ארה\"ב",

    formTitle: "קבל הצעת מחיר חינם",
    formFullName: "שם מלא",
    formPhone: "מספר טלפון",
    formEmail: "כתובת אימייל",
    formZip: "מיקוד",
    formSelectArea: "בחר אזור שירות",
    formSelectService: "בחר שירות",
    formProjectDetails: "פרטי הפרויקט (אופציונלי)",
    formConsent: "אני מסכים לתנאים ולמדיניות הפרטיות ומסכים ליצירת קשר.",
    formCta: "קבל הצעת מחיר חינם",
    formLegal: "בלחיצה על הכפתור, אתה מסכים לתנאים ולמדיניות הפרטיות שלנו.",
    formPhoneError: "הזן מספר טלפון אמריקאי תקין.",
    formFillAll: "אנא מלא את כל השדות",
    formConsentRequired: "אנא הסכם לתנאים ולמדיניות הפרטיות",
    formSubmitting: "שולח את הבקשה שלך…",
    formMatching: "מחפשים קבלנים ליד מיקוד",
    formFoundPros: "מקצוענים זמינים באזורך",
    formAllSet: "הכל מוכן!",
    formAllSetDesc: "קבלן ייצור איתך קשר בקרוב.",
    formCallMeNow: "התקשר אליי עכשיו",
    formCallbackConfirm: "נרשם — נעדכן אותך כשהפנייה לקבלנים תחזור לפעול.",
    formNeedHelp: "צריך עזרה עכשיו?",
    formSubmitAnother: "שלח בקשה נוספת",
    formError: "משהו השתבש. אנא התקשר אלינו.",

    footerDisclaimer: "Build Right USA מחברת בעלי בתים עם קבלנים מורשים. אנחנו לא מבצעים עבודות בנייה.",
    footerReferral: "Build Right USA היא פלטפורמת הפניות לקבלנים.",
    footerQuickLinks: "קישורים מהירים",
    footerServiceAreas: "אזורי שירות",
    footerContactUs: "צור קשר",
    footerPriceDisclaimer: "הערכות מחירים הן ראשוניות ולמטרות מידע בלבד.",
    footerPrivacy: "מדיניות פרטיות",
    footerTerms: "תנאי שירות",

    galleryTitle: "פרויקטים",
    galleryHighlight: "אמיתיים",
    galleryCta: "הצעת מחיר חינם ב-60 שניות",
    galleryLoading: "טוען גלריה...",
    galleryImageFailed: "הטעינה נכשלה",

    aboutTitle: "אודות",
    aboutSubtitle: "בנוי על יושרה. מונע על ידי מקצועיות.",
    aboutStory: "הסיפור שלנו",
    aboutStoryP1: "Build Right USA נוסדה עם משימה פשוטה: לספק שירותי בנייה אמינים ואיכותיים.",
    aboutStoryP2: "כל פרויקט שאנחנו לוקחים מטופל כאילו זה הבית שלנו.",
    aboutCtaTitle: "בואו נבנה משהו גדול ביחד",
    aboutCtaButton: "← קבל הצעת מחיר חינם",
    statProjects: "פרויקטים שהושלמו",
    statExperience: "שנות ניסיון",
    statRating: "דירוג ממוצע",
    statInsured: "מורשה ומבוטח",
    aboutLicensed: "מורשה ומבוטח",
    aboutLicensedDesc: "מקצוענים מורשים עם כיסוי ביטוח מלא.",
    aboutFamily: "עסק משפחתי",
    aboutFamilyDesc: "אנחנו מתייחסים לכל לקוח כשכן.",
    aboutQuality: "חומרים איכותיים",
    aboutQualityDesc: "עובדים עם היצרנים הטובים ביותר.",
    aboutSkilled: "בעלי מקצוע מיומנים",
    aboutSkilledDesc: "הצוות שלנו כולל מומחים מוסמכים.",

    servicesPageTitle: "השירותים",
    servicesPageSubtitle: "פתרונות בנייה ושיפוץ מקיפים לכל חלק בבית שלך.",
    servicesNotSure: "לא בטוח מה אתה צריך?",
    servicesNotSureDesc: "הצוות שלנו יכול לעזור למצוא את התוכנית הטובה ביותר.",
    servicesTalkExpert: "דבר עם מומחה",

    contactTitle: "צור קשר",
    contactSubtitle: "מוכן להתחיל? מלא את הטופס או פנה אלינו ישירות.",
    contactGetInTouch: "צור קשר",
    contactGetInTouchDesc: "יש שאלה? מלא את הטופס ונחזור אליך תוך 24 שעות.",
    contactPhone: "טלפון",
    contactEmail: "אימייל",
    contactAddress: "כתובת",
    contactHours: "שעות פעילות",
    contactHoursValue: "א'–ה': 7:00–18:00 | ו': 8:00–14:00",

    cookieText: "אתר זה עשוי להשתמש בעוגיות. בהמשך השימוש באתר אתה מסכים לשימוש בעוגיות.",
    cookieAccept: "אישור",

    notFoundTitle: "404",
    notFoundText: "אופס! הדף לא נמצא",
    notFoundBack: "חזור לדף הבית",

    getQuoteTitle: "קבל",
    getQuoteHighlight: "הצעת מחיר חינם",
    getQuoteSubtitle: "מלא את הטופס וקבלן מורשה ייצור איתך קשר תוך 24 שעות.",
    getQuoteProjectType: "סוג הפרויקט *",
    getQuoteBudget: "טווח תקציב",
    getQuoteTimeline: "לוח זמנים",
    getQuotePropertyType: "סוג נכס",
    getQuoteNotes: "הערות נוספות (אופציונלי)",
    getQuoteSubmit: "קבל הצעת מחיר חינם",
    getQuoteNoObligation: "ללא התחייבות. הצעות מחיר חינם מקבלנים מאומתים.",
    getQuoteSelectCity: "בחר עיר *",
    heroSliderHeadline: "מצא קבלנים אמינים בקרבתך — מהיר וקל",
    heroSliderSubtext: "התחבר עם אנשי מקצוע מורשים לגגות, שיפוצים, סולאר ועוד.",
    heroSearchPlaceholder: "איזה שירות אתה צריך?",
    heroZipPlaceholder: "מיקוד",
    heroSearchCta: "הצעת מחיר חינם",
  },

  hi: {
    navHome: "होम",
    navServices: "सेवाएं",
    navAiPreview: "AI प्रीव्यू",
    navAbout: "हमारे बारे में",
    navContact: "संपर्क",
    navAdmin: "एडमिन",
    navGetFreeEstimate: "मुफ्त अनुमान",

    heroHeadline: "फ्लोरिडा में विश्वसनीय छत और घर ठेकेदारों से जुड़ें",
    heroHeadlineHighlight: "फ्लोरिडा",
    heroSubtitle: "अपने प्रोजेक्ट के बारे में बताएं और लाइसेंस प्राप्त पेशेवरों से कोटेशन की तुलना करें। कोई बाध्यता नहीं।",
    heroTrustLine: "मुफ्त कोटेशन · कोई बाध्यता नहीं · केवल लाइसेंस प्राप्त पेशेवर",
    trustLicensed: "लाइसेंस और बीमा",
    trustFastResponse: "तेज प्रतिक्रिया",
    trustLocalPros: "स्थानीय पेशेवर",
    trustNoObligation: "कोई बाध्यता नहीं",

    howItWorksTitle: "यह कैसे",
    howItWorksHighlight: "काम करता है",
    step1Title: "अपने प्रोजेक्ट के बारे में बताएं",
    step1Desc: "अपने प्रोजेक्ट के बारे में कुछ विवरण साझा करें।",
    step2Title: "हम आपको स्थानीय पेशेवरों से जोड़ते हैं",
    step2Desc: "हम आपको योग्य ठेकेदारों से जोड़ते हैं।",
    step3Title: "कोटेशन की तुलना करें और चुनें",
    step3Desc: "अपने विकल्पों की समीक्षा करें और सबसे अच्छा चुनें।",

    servicesCoverTitle: "हमारी",
    servicesCoverHighlight: "सेवाएं",
    servicesCoverSubtitle: "हम आपको विभिन्न प्रोजेक्ट्स के लिए लाइसेंस प्राप्त ठेकेदारों से जोड़ते हैं।",
    serviceRoofing: "छत बदलना और मरम्मत",
    serviceStormDamage: "तूफान क्षति बहाली",
    serviceKitchen: "किचन रीमॉडलिंग",
    serviceBathroom: "बाथरूम रीमॉडलिंग",
    serviceRenovation: "सामान्य घर नवीनीकरण",
    serviceWindowsDoors: "खिड़कियां और दरवाजे",
    serviceExterior: "बाहरी और साइडिंग",

    testimonialsTitle: "ग्राहक क्या",
    testimonialsHighlight: "कहते हैं",

    faqTitle: "अक्सर पूछे जाने वाले",
    faqHighlight: "प्रश्न",
    faqQ1: "क्या Build Right USA एक ठेकेदार है?",
    faqA1: "नहीं। हम घर मालिकों को स्वतंत्र ठेकेदारों से जोड़ते हैं।",
    faqQ2: "इसकी कीमत कितनी है?",
    faqA2: "मुफ्त। कोई बाध्यता नहीं।",
    faqQ3: "क्या ठेकेदार लाइसेंस प्राप्त हैं?",
    faqA3: "वे खुद को लाइसेंस प्राप्त और बीमाकृत बताते हैं।",
    faqQ4: "क्या मुझे किराए पर लेना होगा?",
    faqA4: "नहीं। आप निर्णय लें।",

    getInTouchTitle: "संपर्क",
    getInTouchHighlight: "करें",

    ctaReady: "अपना प्रोजेक्ट शुरू करने के लिए तैयार?",
    ctaSubtitle: "आज ही मुफ्त अनुमान प्राप्त करें।",
    ctaButton: "मुफ्त कोटेशन प्राप्त करें →",

    servingTitle: "पूरे अमेरिका में घर मालिकों की सेवा",
    servingHighlight: "USA",

    formTitle: "मुफ्त अनुमान प्राप्त करें",
    formFullName: "पूरा नाम",
    formPhone: "फ़ोन नंबर",
    formEmail: "ईमेल पता",
    formZip: "पिन कोड",
    formSelectArea: "सेवा क्षेत्र चुनें",
    formSelectService: "सेवा चुनें",
    formProjectDetails: "प्रोजेक्ट विवरण (वैकल्पिक)",
    formConsent: "मैं शर्तों और गोपनीयता नीति से सहमत हूं।",
    formCta: "मुफ्त कोटेशन प्राप्त करें",
    formLegal: "बटन पर क्लिक करके, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं।",
    formPhoneError: "कृपया एक मान्य US फ़ोन नंबर दर्ज करें।",
    formFillAll: "कृपया सभी फ़ील्ड भरें",
    formConsentRequired: "कृपया शर्तों से सहमत हों",
    formSubmitting: "आपका अनुरोध भेजा जा रहा है…",
    formMatching: "पिन कोड के पास ठेकेदारों की खोज",
    formFoundPros: "आपके क्षेत्र में उपलब्ध पेशेवर",
    formAllSet: "सब तैयार है!",
    formAllSetDesc: "एक ठेकेदार जल्द ही आपसे संपर्क करेगा।",
    formCallMeNow: "अभी कॉल करें",
    formCallbackConfirm: "हो गया — ठेकेदार संपर्क फिर शुरू होते ही हम आपको सूचित करेंगे।",
    formNeedHelp: "अभी मदद चाहिए?",
    formSubmitAnother: "एक और अनुरोध भेजें",
    formError: "कुछ गलत हो गया। कृपया हमें कॉल करें।",

    footerDisclaimer: "Build Right USA घर मालिकों को लाइसेंस प्राप्त ठेकेदारों से जोड़ती है। हम निर्माण सेवाएं नहीं करते।",
    footerReferral: "Build Right USA एक ठेकेदार रेफरल प्लेटफॉर्म है।",
    footerQuickLinks: "त्वरित लिंक",
    footerServiceAreas: "सेवा क्षेत्र",
    footerContactUs: "संपर्क करें",
    footerPriceDisclaimer: "प्रोजेक्ट अनुमान प्रारंभिक हैं और केवल सूचना के लिए हैं।",
    footerPrivacy: "गोपनीयता नीति",
    footerTerms: "सेवा की शर्तें",

    galleryTitle: "वास्तविक",
    galleryHighlight: "प्रोजेक्ट",
    galleryCta: "60 सेकंड में मुफ्त अनुमान",
    galleryLoading: "गैलरी लोड हो रही है...",
    galleryImageFailed: "छवि लोड करने में विफल",

    aboutTitle: "हमारे बारे",
    aboutSubtitle: "ईमानदारी पर बना। कारीगरी से प्रेरित।",
    aboutStory: "हमारी कहानी",
    aboutStoryP1: "Build Right USA की स्थापना एक साधारण मिशन के साथ हुई: ईमानदार और उच्च गुणवत्ता वाली निर्माण सेवाएं प्रदान करना।",
    aboutStoryP2: "हर प्रोजेक्ट को हम अपने घर जैसा मानते हैं।",
    aboutCtaTitle: "आइए साथ मिलकर कुछ बेहतरीन बनाएं",
    aboutCtaButton: "मुफ्त अनुमान प्राप्त करें →",
    statProjects: "पूर्ण प्रोजेक्ट",
    statExperience: "वर्ष का अनुभव",
    statRating: "औसत रेटिंग",
    statInsured: "लाइसेंस और बीमा",
    aboutLicensed: "लाइसेंस और बीमा",
    aboutLicensedDesc: "पूर्ण लाइसेंस प्राप्त और बीमाकृत पेशेवर।",
    aboutFamily: "पारिवारिक व्यवसाय",
    aboutFamilyDesc: "हम हर ग्राहक को पड़ोसी मानते हैं।",
    aboutQuality: "गुणवत्ता सामग्री",
    aboutQualityDesc: "सर्वोत्तम निर्माताओं के साथ साझेदारी।",
    aboutSkilled: "कुशल कारीगर",
    aboutSkilledDesc: "हमारी टीम में प्रमाणित विशेषज्ञ शामिल हैं।",

    servicesPageTitle: "हमारी",
    servicesPageSubtitle: "आपके घर के हर हिस्से के लिए निर्माण और नवीनीकरण समाधान।",
    servicesNotSure: "पता नहीं क्या चाहिए?",
    servicesNotSureDesc: "हमारी टीम आपको सबसे अच्छी योजना खोजने में मदद कर सकती है।",
    servicesTalkExpert: "विशेषज्ञ से बात करें",

    contactTitle: "संपर्क",
    contactSubtitle: "शुरू करने के लिए तैयार? फ़ॉर्म भरें या सीधे संपर्क करें।",
    contactGetInTouch: "संपर्क करें",
    contactGetInTouchDesc: "कोई प्रश्न है? फ़ॉर्म भरें और हम 24 घंटे में जवाब देंगे।",
    contactPhone: "फ़ोन",
    contactEmail: "ईमेल",
    contactAddress: "पता",
    contactHours: "समय",
    contactHoursValue: "सोम–शुक्र: सुबह 7–शाम 6 | शनि: सुबह 8–दोपहर 2",

    cookieText: "यह वेबसाइट अनुभव सुधारने के लिए कुकीज़ का उपयोग कर सकती है।",
    cookieAccept: "स्वीकार करें",

    notFoundTitle: "404",
    notFoundText: "उफ़! पेज नहीं मिला",
    notFoundBack: "होम पर वापस जाएं",

    getQuoteTitle: "अपना",
    getQuoteHighlight: "मुफ्त कोटेशन प्राप्त करें",
    getQuoteSubtitle: "फ़ॉर्म भरें और एक लाइसेंस प्राप्त ठेकेदार 24 घंटे में संपर्क करेगा।",
    getQuoteProjectType: "प्रोजेक्ट प्रकार *",
    getQuoteBudget: "बजट सीमा",
    getQuoteTimeline: "समयरेखा",
    getQuotePropertyType: "संपत्ति का प्रकार",
    getQuoteNotes: "अतिरिक्त नोट्स (वैकल्पिक)",
    getQuoteSubmit: "मुफ्त कोटेशन प्राप्त करें",
    getQuoteNoObligation: "कोई बाध्यता नहीं। सत्यापित ठेकेदारों से 100% मुफ्त अनुमान।",
    getQuoteSelectCity: "शहर चुनें *",
    heroSliderHeadline: "अपने पास विश्वसनीय ठेकेदार खोजें — तेज़ और आसान",
    heroSliderSubtext: "छत, नवीनीकरण, सोलर और अधिक के लिए लाइसेंस प्राप्त पेशेवरों से जुड़ें।",
    heroSearchPlaceholder: "आपको किस सेवा की आवश्यकता है?",
    heroZipPlaceholder: "पिन कोड",
    heroSearchCta: "मुफ्त कोटेशन",
  },

  zh: {
    navHome: "首页",
    navServices: "服务",
    navAiPreview: "AI预览",
    navAbout: "关于我们",
    navContact: "联系我们",
    navAdmin: "管理",
    navGetFreeEstimate: "免费估价",

    heroHeadline: "在佛罗里达找到值得信赖的屋顶和家装承包商",
    heroHeadlineHighlight: "佛罗里达",
    heroSubtitle: "告诉我们您的项目，比较持证专业人士的报价。无需承诺。",
    heroTrustLine: "免费报价 · 无需承诺 · 仅限持证专业人士",
    trustLicensed: "持证投保",
    trustFastResponse: "快速响应",
    trustLocalPros: "本地专业人士",
    trustNoObligation: "无需承诺",

    howItWorksTitle: "如何",
    howItWorksHighlight: "运作",
    step1Title: "告诉我们您的项目",
    step1Desc: "分享您项目的一些细节。",
    step2Title: "我们为您匹配专业人士",
    step2Desc: "我们将您与合格的承包商联系。",
    step3Title: "比较报价并选择",
    step3Desc: "查看选项，选择最适合的。",

    servicesCoverTitle: "我们提供的",
    servicesCoverHighlight: "服务",
    servicesCoverSubtitle: "为您匹配各类家装项目的持证承包商。",
    serviceRoofing: "屋顶更换与维修",
    serviceStormDamage: "风暴损害修复",
    serviceKitchen: "厨房改造",
    serviceBathroom: "浴室改造",
    serviceRenovation: "整体家居翻新",
    serviceWindowsDoors: "门窗",
    serviceExterior: "外墙与壁板",

    testimonialsTitle: "业主",
    testimonialsHighlight: "评价",

    faqTitle: "常见",
    faqHighlight: "问题",
    faqQ1: "Build Right USA是承包商吗？",
    faqA1: "不是。我们将业主与独立承包商联系起来。",
    faqQ2: "费用多少？",
    faqA2: "免费。无需承诺。",
    faqQ3: "承包商有执照吗？",
    faqA3: "他们表示自己持有执照和保险。",
    faqQ4: "我必须雇用吗？",
    faqA4: "不需要。您自行决定。",

    getInTouchTitle: "联系",
    getInTouchHighlight: "我们",

    ctaReady: "准备开始您的项目？",
    ctaSubtitle: "立即获取免费估价。我们的团队随时为您服务。",
    ctaButton: "获取免费报价 →",

    servingTitle: "服务全美各地的",
    servingHighlight: "业主",

    formTitle: "获取免费估价",
    formFullName: "全名",
    formPhone: "电话号码",
    formEmail: "电子邮件",
    formZip: "邮编",
    formSelectArea: "选择服务区域",
    formSelectService: "选择服务",
    formProjectDetails: "项目详情（可选）",
    formConsent: "我同意条款和隐私政策并同意被联系。",
    formCta: "获取免费报价",
    formLegal: "点击按钮即表示您同意我们的条款和隐私政策。",
    formPhoneError: "请输入有效的美国电话号码。",
    formFillAll: "请填写所有字段",
    formConsentRequired: "请同意条款和隐私政策",
    formSubmitting: "正在提交您的请求…",
    formMatching: "正在为您匹配邮编附近的承包商",
    formFoundPros: "您所在地区可用的专业人士",
    formAllSet: "一切就绪！",
    formAllSetDesc: "承包商将很快与您联系。",
    formCallMeNow: "现在给我打电话",
    formCallbackConfirm: "已记录 — 承包商联系重新开放后我们会通知您。",
    formNeedHelp: "现在需要帮助？",
    formSubmitAnother: "提交另一个请求",
    formError: "出了点问题。请打电话给我们。",

    footerDisclaimer: "Build Right USA将业主与持证承包商联系起来。我们不执行建筑服务。",
    footerReferral: "Build Right USA是承包商推荐平台。",
    footerQuickLinks: "快速链接",
    footerServiceAreas: "服务区域",
    footerContactUs: "联系我们",
    footerPriceDisclaimer: "项目估价为初步信息，仅供参考。",
    footerPrivacy: "隐私政策",
    footerTerms: "服务条款",

    galleryTitle: "真实",
    galleryHighlight: "项目",
    galleryCta: "60秒内获取免费估价",
    galleryLoading: "加载画廊...",
    galleryImageFailed: "图片加载失败",

    aboutTitle: "关于",
    aboutSubtitle: "诚信为本。匠心驱动。",
    aboutStory: "我们的故事",
    aboutStoryP1: "Build Right USA以简单的使命创立：提供诚实、高质量的建筑服务。",
    aboutStoryP2: "我们对待每个项目都像对待自己的家一样。",
    aboutCtaTitle: "让我们一起建造伟大的东西",
    aboutCtaButton: "获取免费估价 →",
    statProjects: "已完成项目",
    statExperience: "年经验",
    statRating: "平均评分",
    statInsured: "持证投保",
    aboutLicensed: "持证投保",
    aboutLicensedDesc: "完全持证的专业人士，提供全面保险。",
    aboutFamily: "家族企业",
    aboutFamilyDesc: "我们对待每位客户如同邻居。",
    aboutQuality: "优质材料",
    aboutQualityDesc: "与顶级制造商合作。",
    aboutSkilled: "技术精湛的工匠",
    aboutSkilledDesc: "我们的团队包括各领域认证专家。",

    servicesPageTitle: "我们的",
    servicesPageSubtitle: "为您家每个部分提供全面的建筑和翻新解决方案。",
    servicesNotSure: "不确定需要什么？",
    servicesNotSureDesc: "我们的团队可以帮您找到最佳方案。",
    servicesTalkExpert: "咨询专家",

    contactTitle: "联系",
    contactSubtitle: "准备开始？填写表格或直接联系我们。",
    contactGetInTouch: "联系我们",
    contactGetInTouchDesc: "有问题？填写表格，我们24小时内回复。",
    contactPhone: "电话",
    contactEmail: "邮箱",
    contactAddress: "地址",
    contactHours: "营业时间",
    contactHoursValue: "周一至周五：7:00-18:00 | 周六：8:00-14:00",

    cookieText: "本网站可能使用cookies来改善用户体验。继续使用即表示同意。",
    cookieAccept: "接受",

    notFoundTitle: "404",
    notFoundText: "抱歉！页面未找到",
    notFoundBack: "返回首页",

    getQuoteTitle: "获取",
    getQuoteHighlight: "免费报价",
    getQuoteSubtitle: "填写表格，持证承包商将在24小时内与您联系。",
    getQuoteProjectType: "项目类型 *",
    getQuoteBudget: "预算范围",
    getQuoteTimeline: "时间表",
    getQuotePropertyType: "房产类型",
    getQuoteNotes: "附加说明（可选）",
    getQuoteSubmit: "获取免费报价",
    getQuoteNoObligation: "无需承诺。100%免费估价来自认证承包商。",
    getQuoteSelectCity: "选择城市 *",
    heroSliderHeadline: "快速轻松找到身边值得信赖的承包商",
    heroSliderSubtext: "与持牌专业人员联系，提供屋顶、翻新、太阳能等服务。",
    heroSearchPlaceholder: "您需要什么服务？",
    heroZipPlaceholder: "邮政编码",
    heroSearchCta: "免费报价",
  },
};
