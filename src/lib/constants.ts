import type { OrderStatus, PaymentStatus } from "@/lib/types";

export const SITE = {
  name: "MEDO STORE",
  tagline: "متجرك الرقمي لشحن الألعاب والخدمات",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  currency: "EGP",
  description:
    "متجر ميدو ستور — شحن شدات ببجي، خدمات السوشيال ميديا، والمنتجات الرقمية بسرعة وأمان.",
};

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المتجر" },
  { href: "/categories/pubg-services", label: "خدمات ببجي" },
  { href: "/categories/pubg-uc", label: "شدات ببجي" },
  { href: "/services/social-media", label: "السوشيال ميديا" },
  { href: "/offers", label: "العروض" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "gamepad-2": "Gamepad2",
  gem: "Gem",
  users: "Users",
  flame: "Flame",
  gift: "Gift",
  headphones: "Headphones",
  smartphone: "Smartphone",
  sparkles: "Sparkles",
  zap: "Zap",
};

export const PAYMENT_METHODS: Record<
  string,
  { id: string; name: string; description: string; color: string }
> = {
  fawry: {
    id: "fawry",
    name: "فوري",
    description: "الدفع من أي منفذ فوري أو فروع فوري",
    color: "#e11d48",
  },
  vodafone: {
    id: "vodafone",
    name: "فودافون كاش",
    description: "الدفع عبر محفظة فودافون كاش",
    color: "#e60000",
  },
  instapay: {
    id: "instapay",
    name: "إنستا باي",
    description: "الدفع عبر تطبيق إنستا باي",
    color: "#7c3aed",
  },
  bank: {
    id: "bank",
    name: "تحويل بنكي",
    description: "تحويل إلى الحساب البنكي",
    color: "#0ea5e9",
  },
  card: {
    id: "card",
    name: "بطاقة مصرفية",
    description: "فيزا / ماستركارد / ميزة",
    color: "#22d3ee",
  },
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "created",
  "paid",
  "processing",
  "executing",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: "تم إنشاء الطلب",
  paid: "تم تأكيد الدفع",
  processing: "جاري تجهيز الطلب",
  executing: "جاري التنفيذ",
  delivered: "تم التسليم",
  cancelled: "تم الإلغاء",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "قيد الانتظار",
  paid: "تم الدفع",
  failed: "فشل الدفع",
  refunded: "مسترد",
};

export const TRUST_BADGES = [
  { icon: "Zap", title: "تسليم سريع", text: "تنفيذ فوري للطلبات الرقمية" },
  { icon: "ShieldCheck", title: "دفع آمن", text: "طرق دفع مصرية موثوقة" },
  { icon: "Headphones", title: "دعم فني", text: "فريق جاهز على مدار الساعة" },
  { icon: "BadgeCheck", title: "خدمة موثوقة", text: "آلاف الطلبات المنفذة" },
];

export const WHY_US = [
  {
    icon: "Zap",
    title: "⚡ تنفيذ سريع",
    text: "نحرص على تنفيذ طلباتك في أسرع وقت.",
  },
  {
    icon: "Lock",
    title: "🔒 دفع آمن",
    text: "نستخدم طرق دفع آمنة وموثوقة.",
  },
  {
    icon: "Headphones",
    title: "🎧 دعم فني",
    text: "فريق دعم جاهز لمساعدتك.",
  },
  {
    icon: "Gem",
    title: "💎 جودة مضمونة",
    text: "خدمات رقمية بجودة عالية.",
  },
];

export const FAQS = [
  {
    q: "هل الدفع آمن؟",
    a: "نعم، نستخدم طرق دفع مصرية معروفة مثل فوري وفودافون كاش وإنستا باي، وبياناتك مشفرة ولا تُشارك مع أي طرف ثالث.",
  },
  {
    q: "كم يستغرق تنفيذ الطلب؟",
    a: "معظم الطلبات الرقمية تُنفذ خلال دقائق حتى ساعتين حسب نوع الخدمة، والخدمات الأخرى خلال 24 ساعة كحد أقصى.",
  },
  {
    q: "كيف يمكنني متابعة طلبي؟",
    a: "من صفحة «تتبع طلبك» أدخل رقم الطلب ورقم الهاتف المسجل لترى مراحل الطلب لحظيًا خطوة بخطوة.",
  },
  {
    q: "هل يمكن استرجاع الطلب؟",
    a: "الطلبات الرقمية غير قابلة للاسترجاع بعد تنفيذها، لكن إذا واجهت أي مشكلة تواصل مع الدعم الفني وسنحلها لك.",
  },
  {
    q: "كيف أتواصل مع الدعم؟",
    a: "من خلال واتساب أو تيليجرام أو صفحة تواصل معنا، أو عبر البريد الإلكتروني — فريقنا يرد خلال دقائق.",
  },
  {
    q: "ما البيانات المطلوبة لشحن PUBG؟",
    a: "تحتاج إدخال «معرف اللاعب (Player ID)» والمنطقة والسيرفر الخاص بك، ويمكنك تأكيدها من ملفك الشخصي داخل اللعبة.",
  },
];

export const SOCIAL_SERVICES = [
  {
    id: "insta-followers",
    platform: "instagram",
    icon: "Instagram",
    service: "متابعين إنستجرام",
    description: "زيادة متابعين حسابك على إنستجرام بجودة عالية",
    minPrice: 25,
    delivery: "من 10 دقائق إلى 12 ساعة",
    badge: "الأكثر طلبًا",
  },
  {
    id: "insta-likes",
    platform: "instagram",
    icon: "Instagram",
    service: "لايكات إنستجرام",
    description: "لايكات لمنشوراتك وريلز لزيادة التفاعل",
    minPrice: 15,
    delivery: "من 5 إلى 30 دقيقة",
  },
  {
    id: "tiktok-followers",
    platform: "tiktok",
    icon: "Music2",
    service: "متابعين تيك توك",
    description: "متابعين حقيقيين لحسابك على تيك توك",
    minPrice: 35,
    delivery: "من 15 دقيقة إلى 24 ساعة",
  },
  {
    id: "tiktok-likes",
    platform: "tiktok",
    icon: "Music2",
    service: "لايكات تيك توك",
    description: "لايكات لفيديوهاتك مع سرعة تنفيذ عالية",
    minPrice: 18,
    delivery: "من 5 إلى 40 دقيقة",
  },
  {
    id: "yt-views",
    platform: "youtube",
    icon: "Youtube",
    service: "مشاهدات يوتيوب",
    description: "مشاهدات عالية الجودة لفيديوهاتك",
    minPrice: 30,
    delivery: "من 20 دقيقة إلى 48 ساعة",
  },
  {
    id: "yt-subs",
    platform: "youtube",
    icon: "Youtube",
    service: "مشتركين يوتيوب",
    description: "مشتركين نشطين لقناتك",
    minPrice: 40,
    delivery: "من 30 دقيقة إلى 72 ساعة",
  },
];

export const REVIEWS = [
  {
    id: "r1",
    name: "أحمد محمود",
    rating: 5,
    text: "الخدمة ممتازة والتنفيذ كان سريع جدًا، وصلتني الشدات خلال 10 دقائق.",
    date: "2026-07-28",
    product: "شدات ببجي 1200",
  },
  {
    id: "r2",
    name: "سارة إبراهيم",
    rating: 5,
    text: "تعامل محترم ورد سريع على الواتساب، أنصح به أي حد.",
    date: "2026-07-22",
    product: "متابعين إنستجرام",
  },
  {
    id: "r3",
    name: "محمد عادل",
    rating: 4,
    text: "خدمة شدات ببجي كورية ممتازة وسعر مناسب جدًا. التجربة كانت رائعة.",
    date: "2026-07-15",
    product: "شدات ببجي كورية",
  },
  {
    id: "r4",
    name: "يوسف خالد",
    rating: 5,
    text: "أول مرة أطلب من هنا والنتيجة فاقت توقعي، تنفيذ فوري وشحن آمن.",
    date: "2026-07-09",
    product: "بطاقات قيمة",
  },
  {
    id: "r5",
    name: "منى حسن",
    rating: 5,
    text: "الدعم الفني جدًا محترم وساعدوني في كل خطوة. خدمات السوشيال ميديا ممتازة.",
    date: "2026-06-30",
    product: "مشاهدات يوتيوب",
  },
  {
    id: "r6",
    name: "كريم وليد",
    rating: 5,
    text: "شحن سريع وأسعار أحسن من أي مكان تاني جربته. متجر يستاهل.",
    date: "2026-06-18",
    product: "شدات ببجي 660",
  },
];