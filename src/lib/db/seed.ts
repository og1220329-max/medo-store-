import type {
  Banner,
  Category,
  Coupon,
  HomepageSection,
  Notification,
  Offer,
  Order,
  PaymentRecord,
  Product,
  Review,
  RoleInfo,
  Settings,
  Store,
  Ticket,
  User,
} from "@/lib/types";
import { hashPassword } from "@/lib/auth";
import { uid } from "@/lib/utils";

const now = Date.now();
const iso = (offsetMs = 0) => new Date(now + offsetMs).toISOString();
const DAY = 24 * 60 * 60 * 1000;

const offerEnds = iso(2 * DAY);

// ============ الحقول المطلوبة ============
const pubgFields: Product["requiredFields"] = [
  {
    key: "playerId",
    label: "معرف اللاعب (Player ID)",
    type: "number",
    placeholder: "مثال: 5263456281",
    required: true,
    hint: "من داخل اللعبة: الإعدادات ← الحساب ← معرف اللاعب",
  },
  {
    key: "server",
    label: "السيرفر",
    type: "select",
    required: true,
    options: ["آسيا", "أوروبا", "أمريكا الشمالية", "أمريكا الجنوبية", "الخليج / الشرق الأوسط"],
  },
  {
    key: "playerName",
    label: "اسم اللاعب داخل اللعبة",
    type: "text",
    required: true,
    placeholder: "اسمك كما يظهر في اللعبة",
  },
];

const krFields: Product["requiredFields"] = [
  ...pubgFields,
  {
    key: "accountType",
    label: "نوع الحساب",
    type: "select",
    required: true,
    options: ["جوجل", "تويتر (X)", "فيسبوك", "هوية Apple", "آخر"],
  },
];

const socialField: Product["requiredFields"] = [
  {
    key: "link",
    label: "رابط الحساب أو اليوزر",
    type: "text",
    required: true,
    placeholder: "ضع الرابط أو اسم المستخدم",
    hint: "الحساب يجب أن يكون عامًا حتى يتم التنفيذ",
  },
  { key: "note", label: "ملاحظات إضافية (اختياري)", type: "text", required: false },
];

const rankField: Product["requiredFields"] = [
  {
    key: "playerId",
    label: "معرف اللاعب (Player ID)",
    type: "number",
    required: true,
  },
  {
    key: "server",
    label: "السيرفر",
    type: "select",
    required: true,
    options: ["آسيا", "أوروبا", "أمريكا الشمالية", "أمريكا الجنوبية", "الخليج / الشرق الأوسط"],
  },
  {
    key: "currentTier",
    label: "الرتبة الحالية",
    type: "select",
    required: true,
    options: ["برونز", "فضي", "ذهبي", "بلاتيني", "ماسي", "نجمي", "الكونكر"],
  },
  {
    key: "targetTier",
    label: "الرتبة المطلوبة",
    type: "select",
    required: true,
    options: ["ذهبي", "بلاتيني", "ماسي", "نجمي", "الكونكر"],
  },
];

// ============ الفئات ============
const categories: Category[] = [
  { id: "c-pubg-services", slug: "pubg-services", name: "خدمات ببجي", description: "ترقية الرتبة، البطولة الموسمية، وخدمات مخصصة", icon: "Headphones", image: "/images/cat-pubg-services.svg", parentId: undefined, order: 1, active: true, createdAt: iso(-90 * DAY) },
  { id: "c-pubg-uc", slug: "pubg-uc", name: "شدات ببجي", description: "شحن UC فوري لكل إصدارات ببجي", icon: "Gem", image: "/images/cat-pubg-uc.svg", parentId: "c-pubg-services", order: 1, active: true, createdAt: iso(-90 * DAY) },
  { id: "c-pubg-kr", slug: "pubg-kr", name: "ببجي كوريا", description: "شحن شدات نسخة كوريا KR", icon: "Flame", image: "/images/cat-pubg-uc.svg", parentId: "c-pubg-services", order: 2, active: true, createdAt: iso(-80 * DAY) },
  { id: "c-bundles", slug: "bundles", name: "باندلز", description: "باقات وباندلات موسمية بخصومات كبيرة", icon: "Gift", image: "/images/gift-card.svg", parentId: undefined, order: 3, active: true, createdAt: iso(-70 * DAY) },
  { id: "c-social", slug: "social-media", name: "السوشيال ميديا", description: "متابعين وإعجابات ومشاهدات لكل المنصات", icon: "Users", image: "/images/cat-social.svg", parentId: undefined, order: 4, active: true, createdAt: iso(-60 * DAY) },
  { id: "c-offers", slug: "offers", name: "العروض", description: "أقوى العروض والخصومات لفترة محدودة", icon: "Flame", image: "/images/cat-offers.svg", parentId: undefined, order: 5, active: true, createdAt: iso(-50 * DAY) },
  { id: "c-digital", slug: "digital", name: "منتجات رقمية", description: "بطاقات قيمة وباقات رقمية متنوعة", icon: "Gift", image: "/images/cat-digital.svg", parentId: undefined, order: 6, active: true, createdAt: iso(-40 * DAY) },
];

const createAt = (i: number) => iso(-(Math.floor(i / 2) + 5) * DAY + i * 3600_000);

const P = (
  id: string,
  slug: string,
  name: string,
  description: string,
  categoryId: string,
  image: string,
  price: number,
  stock: number,
  opts: Partial<Product> = {}
): Product => ({
  id,
  slug,
  name,
  description,
  shortDescription: opts.shortDescription,
  categoryId,
  image,
  images: [image, ...(opts.images || [])],
  price,
  stock,
  rating: opts.rating ?? Math.round((4.6 + Math.random() * 0.4) * 10) / 10,
  reviewsCount: opts.reviewsCount ?? 0,
  featured: opts.featured ?? false,
  bestSeller: opts.bestSeller ?? false,
  isNew: opts.isNew ?? false,
  type: "digital",
  active: true,
  deliveryTime: opts.deliveryTime ?? "من دقيقة حتى 30 دقيقة",
  features: opts.features ?? [],
  requiredFields: opts.requiredFields ?? [],
  badge: opts.badge,
  oldPrice: opts.oldPrice,
  costPrice: opts.costPrice,
  sku: opts.sku ?? `SKU-${id.toUpperCase()}`,
  unlimitedStock: opts.unlimitedStock ?? true,
  createdAt: createAt(parseInt(id.replace(/\D/g, "") || "10", 10) || 10),
});

const products: Product[] = [
  P("p-uc-60", "pubg-uc-60", "شحن شدات ببجي 60", "أفضل طريقة لشحن 60 UC لببجي موبايل بسرعة وأمان وتنفيذ فوري خلال دقائق.", "c-pubg-uc", "/images/uc-60.svg", 38, 999, {
    oldPrice: 45, badge: "الأكثر مبيعًا", featured: true, bestSeller: true, stock: 500, sku: "SKU-UC-060",
    features: ["تنفيذ فوري", "شحن آمن على معرف اللاعب", "دعم فني متواصل", "أسعار منافسة"],
    requiredFields: pubgFields,
  }),
  P("p-uc-120", "pubg-uc-120", "شحن شدات ببجي 120", "باقة 120 UC مع 10 UC هدية — أفضل قيمة لشحنك اليومي.", "c-pubg-uc", "/images/uc-120.svg", 68, 999, {
    oldPrice: 85, badge: "خصم 20%", featured: true, stock: 400,
    features: ["+10 UC هدية", "تنفيذ فوري", "شحن آمن"],
    requiredFields: pubgFields,
  }),
  P("p-uc-325", "pubg-uc-325", "شحن شدات ببجي 325", "باقة 325 UC مع 35 UC إضافية للاعبين الدائمين.", "c-pubg-uc", "/images/uc-325.svg", 175, 999, {
    oldPrice: 195, badge: "خصم 10%", bestSeller: true, stock: 350,
    features: ["+35 UC هدية", "تنفيذ خلال دقائق", "شحن آمن على معرف اللاعب"],
    requiredFields: pubgFields,
  }),
  P("p-uc-660", "pubg-uc-660", "شحن شدات ببجي 660", "الباقة المفضلة للاعبين: 660 UC + 90 UC هدية.", "c-pubg-uc", "/images/uc-660.svg", 335, 999, {
    oldPrice: 370, badge: "الباقة المفضلة", featured: true, stock: 300, deliveryTime: "من دقيقة حتى 15 دقيقة",
    features: ["+90 UC هدية", "تنفيذ فوري", "أفضل سعر لكل UC"],
    requiredFields: pubgFields,
  }),
  P("p-uc-1800", "pubg-uc-1800", "شحن شدات ببجي 1800", "باقة 1800 UC مع 300 UC هدية — خصم حقيقي على الكميات الكبيرة.", "c-pubg-uc", "/images/uc-1800.svg", 900, 999, {
    oldPrice: 1000, badge: "خصم 10%", stock: 200, deliveryTime: "من 5 حتى 30 دقيقة",
    features: ["+300 UC هدية", "أفضل سعر للكميات", "شحن آمن"],
    requiredFields: pubgFields,
  }),
  P("p-uc-3850", "pubg-uc-3850", "شحن شدات ببجي 3850", "الباقة الأقوى للمحترفين: 3850 UC + 700 UC هدية.", "c-pubg-uc", "/images/uc-3850.svg", 1850, 999, {
    oldPrice: 2050, badge: "الأقوى للمحترفين", featured: true, stock: 150, deliveryTime: "من 5 حتى 45 دقيقة",
    features: ["+700 UC هدية", "أولوية التنفيذ", "دعم VIP"],
    requiredFields: pubgFields,
  }),
  P("p-uc-8100", "pubg-uc-8100", "شحن شدات ببجي 8100", "الباقة الأضخم على الإطلاق: 8100 UC + 1600 UC هدية.", "c-pubg-uc", "/images/uc-8100.svg", 3850, 999, {
    oldPrice: 4200, badge: "الباقة الأضخم", isNew: true, stock: 100, deliveryTime: "من 5 حتى 60 دقيقة",
    features: ["+1600 UC هدية", "أولوية قصوى", "دعم VIP حصري"],
    requiredFields: pubgFields,
  }),
  P("p-uc-kr", "pubg-uc-kr", "شحن شدات ببجي كوريا KR", "شحن 660 UC لنسخة ببجي الكورية KR بسرعة وأمان.", "c-pubg-kr", "/images/uc-kr.svg", 360, 999, {
    oldPrice: 395, badge: "نسخة كورية KR", featured: true, stock: 250, deliveryTime: "من 5 حتى 45 دقيقة",
    features: ["خاص بنسخة KR", "تنفيذ آمن", "+60 UC هدية"],
    requiredFields: krFields,
  }),
  P("p-uc-kr-1200", "pubg-uc-kr-1200", "شحن شدات ببجي كوريا 1200", "باقة 1200 UC لنسخة كوريا KR بخصم خاص.", "c-pubg-kr", "/images/uc-1800.svg", 620, 999, {
    oldPrice: 680, badge: "خصم 10%", isNew: true, stock: 150,
    features: ["خاص بنسخة KR", "+120 UC هدية", "تنفيذ آمن"],
    requiredFields: krFields,
  }),
  P("p-royale-pass", "pubg-royale-pass", "البطولة الموسمية Royale Pass", "اشحن البطولة الموسمية لبرصيد 960 UC كامل وافتح كل جوائز الموسم.", "c-pubg-services", "/images/royale-pass.svg", 420, 999, {
    oldPrice: 500, badge: "خصم 16%", bestSeller: true, stock: 300, deliveryTime: "من 15 دقيقة حتى ساعة",
    features: ["960 UC كاملة", "فوري التركيب", "يُفعّل على حسابك"],
    requiredFields: pubgFields,
  }),
  P("p-rank-push", "pubg-rank-push", "ترقية رتبة ببجي (Squad)", "احجز ترقية رتبة سكواد مع محترفين — من رتبتك الحالية للرتبة المطلوبة بأمان تام.", "c-pubg-services", "/images/rank-push.svg", 550, 20, {
    badge: "خدمة متخصصة", stock: 20, unlimitedStock: false, deliveryTime: "حسب الرتبة (1-7 أيام)",
    features: ["لاعب محترف", "تقدم مستمر بالصور", "سرية تامة", "سحب من قبل الخدمة"],
    requiredFields: rankField,
  }),
  P("p-royale-bundle", "pubg-royale-bundle", "باندل البطولة الموسمية", "باندل شامل: البطولة الموسمية + 660 UC + تذاكر خاصة بنصف السعر.", "c-bundles", "/images/gift-card.svg", 640, 999, {
    oldPrice: 780, badge: "باندل", isNew: true, stock: 120, deliveryTime: "من 15 دقيقة حتى ساعة",
    features: ["بات: 960 UC", "660 UC إضافية", "توفير 18%"],
    requiredFields: pubgFields,
  }),
  P("p-gaming-card", "pubg-gaming-card", "بطاقة شحن ألعاب 150", "بطاقة شحن موحدة تنفع على منصات ألعاب متعددة بقيمة 150 جنيه.", "c-digital", "/images/gaming-card.svg", 150, 999, {
    oldPrice: 180, badge: "خصم 17%", stock: 500,
    features: ["رمز فوري", "صالحة 12 شهر", "تدعم منصات متعددة"],
    requiredFields: [
      { key: "email", label: "البريد الإلكتروني للاستلام", type: "text", required: true, placeholder: "ad@example.com" },
    ],
  }),
  P("p-gift-card", "pubg-gift-card", "بطاقة قيمة رقمية 250", "بطاقة هدايا رقمية بقيمة 250 جنيه تُرسل على الجوال فورًا.", "c-digital", "/images/gift-card.svg", 250, 999, {
    oldPrice: 300, badge: "خصم 17%", stock: 400,
    features: ["توصيل فوري", "تُرسل على واتساب", "تنفع كهدية"],
    requiredFields: [
      { key: "phone", label: "رقم الهاتف للتوصيل", type: "text", required: true, placeholder: "01xxxxxxxxx" },
    ],
  }),
  P("p-digital-topup", "pubg-digital-topup", "شحن رصيد جوال فوري", "شحن رصيد أي شبكة مصرية فورًا بأفضل الأسعار.", "c-digital", "/images/digital-topup.svg", 99, 999, {
    oldPrice: 125, badge: "خصم 21%", stock: 800, deliveryTime: "فوري",
    features: ["جميع الشبكات", "تنفيذ فوري", "بدون رسوم إضافية"],
    requiredFields: [
      { key: "phoneNumber", label: "رقم الجوال", type: "number", required: true, placeholder: "01xxxxxxxxx" },
      { key: "network", label: "الشبكة", type: "select", required: true, options: ["فودافون", "أورنج", "اتصالات", "وي"] },
    ],
  }),
  P("p-social-instagram-1000", "instagram-followers-1000", "متابعين انستجرام 1000", "1000 متابع حقيقي أنشط على انستجرام بتسليم سريع وضمان تعويض.", "c-social", "/images/social-instagram.svg", 350, 999, {
    oldPrice: 440, badge: "خصم 20%", featured: true, bestSeller: true, stock: 300, deliveryTime: "خلال 24 ساعة",
    features: ["حسابات نشطة", "ضمان تعويض", "بدون كلمة مرور"],
    requiredFields: socialField,
  }),
  P("p-social-tiktok-500", "tiktok-followers-500", "متابعين تيك توك 500", "500 متابع لتيك توك بجودة عالية وتسليم سريع.", "c-social", "/images/social-tiktok.svg", 200, 999, {
    oldPrice: 255, badge: "خصم 21%", stock: 250, deliveryTime: "خلال 24-48 ساعة",
    features: ["جودة عالية", "بدون كلمة مرور", "سعر تنافسي"],
    requiredFields: socialField,
  }),
  P("p-social-youtube-5000", "youtube-views-5000", "مشاهدات يوتيوب 5000", "5000 مشاهدة يوتيوب لفيديوهاتك بقنوات فعالة.", "c-social", "/images/social-youtube.svg", 120, 999, {
    oldPrice: 150, badge: "خصم 20%", stock: 600, deliveryTime: "خلال 12-48 ساعة",
    features: ["مشاهدات حقيقية", "لا يؤثر على القناة", "تقارير مفصلة"],
    requiredFields: socialField,
  }),
  P("p-social-youtube-subs-1000", "youtube-subscribers-1000", "مشتركين يوتيوب 1000", "1000 مشترك لقناتك على يوتيوب بجودة عالية.", "c-social", "/images/social-youtube-subs.svg", 800, 999, {
    oldPrice: 1010, badge: "خصم 21%", stock: 150, deliveryTime: "خلال 3-7 أيام",
    features: ["مشتركين حقيقيين", "بدون كلمة مرور", "دعم بعد التسليم"],
    requiredFields: socialField,
  }),
];

// ============ الكوبونات ============
const coupons: Coupon[] = [
  { id: "cp-1", code: "WELCOME10", type: "percent", value: 10, minOrder: 100, maxUses: 500, perUserLimit: 1, used: 184, active: true, createdAt: iso(-60 * DAY) },
  { id: "cp-2", code: "OFFER40", type: "fixed", value: 40, minOrder: 300, maxUses: 200, perUserLimit: 1, used: 19, active: true, createdAt: iso(-40 * DAY) },
  { id: "cp-3", code: "SAVE25", type: "percent", value: 25, minOrder: 200, maxDiscount: 150, maxUses: 300, perUserLimit: 2, used: 96, active: true, createdAt: iso(-30 * DAY) },
  { id: "cp-4", code: "ROYAL50", type: "fixed", value: 50, minOrder: 500, maxUses: 100, perUserLimit: 1, used: 12, active: true, createdAt: iso(-20 * DAY) },
  { id: "cp-5", code: "XMAS30", type: "percent", value: 30, minOrder: 150, maxDiscount: 200, maxUses: 1000, perUserLimit: 3, used: 0, active: true, startsAt: iso(1 * DAY), expiresAt: iso(10 * DAY), createdAt: iso(-2 * DAY) },
];

// ============ المستخدمون (عملاء + أدمن) ============
const pw = hashPassword("12345678");
const customers: User[] = [
  { id: "usr-c1", name: "أحمد الشافعي", email: "ahmed@example.com", phone: "01011112222", passwordHash: pw, role: "customer", active: true, createdAt: iso(-120 * DAY) },
  { id: "usr-c2", name: "سارة حسن", email: "sara@example.com", phone: "01112345678", passwordHash: pw, role: "customer", active: true, createdAt: iso(-100 * DAY), lastLoginAt: iso(-1 * DAY) },
  { id: "usr-c3", name: "محمود عادل", email: "mohamed@example.com", phone: "01222223333", passwordHash: pw, role: "customer", active: true, createdAt: iso(-85 * DAY) },
  { id: "usr-c4", name: "نور الدين فتحي", email: "nour@example.com", phone: "01033334444", passwordHash: pw, role: "customer", active: true, createdAt: iso(-70 * DAY) },
  { id: "usr-c5", name: "ياسمين خالد", email: "yasmin@example.com", phone: "01144445555", passwordHash: pw, role: "customer", active: true, createdAt: iso(-55 * DAY), lastLoginAt: iso(-5 * DAY) },
  { id: "usr-c6", name: "كريم مصطفى", email: "karim@example.com", phone: "01255556666", passwordHash: pw, role: "customer", active: true, createdAt: iso(-40 * DAY) },
  { id: "usr-c7", name: "هدى إبراهيم", email: "huda@example.com", phone: "01066667777", passwordHash: pw, role: "customer", active: true, createdAt: iso(-30 * DAY) },
  { id: "usr-c8", name: "عمرو سامي", email: "amr@example.com", phone: "01177778888", passwordHash: pw, role: "customer", active: true, createdAt: iso(-20 * DAY), lastLoginAt: iso(-2 * DAY) },
  { id: "usr-c9", name: "مريم الجندي", email: "mariam@example.com", phone: "01288889999", passwordHash: pw, role: "customer", active: true, createdAt: iso(-10 * DAY) },
  { id: "usr-c10", name: "طارق الزيات", email: "tarek@example.com", phone: "01099990000", passwordHash: pw, role: "customer", active: true, createdAt: iso(-3 * DAY) },
];

const adminPw = hashPassword("admin123");
const roles: RoleInfo[] = [
  { id: "r-super", name: "super_admin", description: "صلاحيات كاملة على كل النظام", permissions: ["*"], isSystem: true, createdAt: iso(-200 * DAY) },
  { id: "r-admin", name: "admin", description: "إدارة المتجر كاملًا", permissions: ["orders.view", "orders.edit", "products.manage", "customers.manage", "payments.manage", "coupons.manage", "settings.edit", "content.manage", "reviews.manage", "support.manage", "users.manage", "analytics.view"], isSystem: true, createdAt: iso(-200 * DAY) },
  { id: "r-manager", name: "manager", description: "إدارة المنتجات والطلبات والعروض", permissions: ["orders.view", "orders.edit", "products.manage", "coupons.manage", "content.manage", "analytics.view"], isSystem: true, createdAt: iso(-200 * DAY) },
  { id: "r-support", name: "support", description: "إدارة التذاكر والرسائل", permissions: ["support.manage", "orders.view", "customers.view"], isSystem: true, createdAt: iso(-200 * DAY) },
  { id: "r-orders", name: "order_manager", description: "متابعة الطلبات وتحديث حالاتها", permissions: ["orders.view", "orders.edit"], isSystem: true, createdAt: iso(-200 * DAY) },
];

const adminUsers: User[] = [
  { id: "usr-admin-super", name: "مدير المتجر", email: "admin@medostore.shop", phone: undefined, passwordHash: adminPw, role: "admin", roleId: "r-super", active: true, createdAt: iso(-200 * DAY), lastLoginAt: iso(-1 * DAY) },
  { id: "usr-admin-m1", name: "فريق التشغيل", email: "ops@medostore.shop", phone: undefined, passwordHash: adminPw, role: "admin", roleId: "r-manager", active: true, createdAt: iso(-60 * DAY) },
  { id: "usr-admin-s1", name: "فريق الدعم", email: "support@medostore.shop", phone: undefined, passwordHash: adminPw, role: "admin", roleId: "r-support", active: true, createdAt: iso(-45 * DAY) },
];

// ============ الطلبات ============
const orderStatuses = ["delivered", "delivered", "paid", "processing", "executing", "delivered", "cancelled", "paid", "delivered", "processing", "delivered", "executing", "paid", "delivered", "cancelled", "delivered", "processing", "paid", "executing", "delivered"] as const;
const payMethods = ["fawry", "instapay", "vodafone", "bank", "card", "instapay", "fawry", "vodafone", "card", "bank", "instapay", "fawry", "vodafone", "card", "bank", "instapay", "fawry", "card", "vodafone", "instapay"] as const;

const timelineFor = (status: string, base: string): Order["timeline"] => {
  const flow: Order["timeline"] = [{ status: "created", at: base }];
  if (status === "cancelled") {
    flow.push({ status: "cancelled", at: iso(30 * 60 * 1000) });
    return flow;
  }
  const seq: Order["timeline"][number]["status"][] = ["paid", "processing", "executing", "delivered"];
  const target = seq.indexOf(status as never);
  seq.slice(0, target + 1).forEach((s, i) => flow.push({ status: s, at: iso((i + 1) * 2 * 3600_000) }));
  return flow;
};

const orders: Order[] = [];
const payments: PaymentRecord[] = [];

for (let idx = 0; idx < 20; idx++) {
  const c = customers[idx % customers.length];
  const status = orderStatuses[idx % orderStatuses.length];
  const method = payMethods[idx % payMethods.length];
  const product = products[idx % products.length];
  const qty = (idx % 3) + 1;
  const subtotal = product.price * qty;
  const createdAt = iso(-(idx + 1) * DAY - 3600_000 * (idx % 8));
  const paid = ["paid", "processing", "executing", "delivered"].includes(status);
  const order: Order = {
    id: `ord_seed_${idx}`,
    number: `MS-${String(100000 + idx)}`,
    userId: c.id,
    customer: { name: c.name, phone: c.phone || "", email: c.email },
    items: [{ productId: product.id, name: product.name, image: product.image, price: product.price, quantity: qty, customData: {} }],
    subtotal,
    discount: 0,
    total: subtotal,
    payment: { method, status: status === "cancelled" ? "refunded" : paid ? "paid" : "pending", reference: `SEED-${idx}` },
    status,
    timeline: timelineFor(status, createdAt),
    createdAt,
    updatedAt: iso(-idx * DAY),
  };
  orders.push(order);
  payments.push({
    id: `pay_seed_${idx}`,
    orderId: order.id,
    orderNumber: order.number,
    method,
    status: order.payment.status,
    amount: order.total,
    reference: `SEED-${idx}`,
    createdAt: order.createdAt,
    paidAt: paid ? createdAt : undefined,
  });
}

// ============ التقييمات ============
const reviewTexts = [
  "تم الشحن في دقائق والحساب اشتغل فورًا — أفضل متجر شحن جربته.",
  "خدمة ممتازة وسريعة، فريق الدعم رد عليا على واتساب فورًا.",
  "السعر أحسن من كل المتاجر التانية والتنفيذ كان دقيق جدًا.",
  "طلبت رتبة والانتظار كان أسبوع بس النتيجة ممتازة والأمان تام.",
  "كوبون الخصم اشتغل صح وإجمالي الفاتورة كان صح.",
  "أول مرة أطلب منه وكانت تجربة رائعة، هستمر معاهم.",
  "تنفيذ سريع بس الشحن أخذ 30 دقيقة، عموما التجربة ممتازة.",
  "الثقة حلوة فيهم، الطلب وصل بالتحديثات خطوة بخطوة.",
  "قيمة ممتازة مقابل السعر، أنصح بالتجربة.",
  "دعم 24 ساعة فعلًا، رد عليا الساعة 2 الفجر.",
];
const reviews: Review[] = reviewTexts.map((text, i) => ({
  id: `rev_${i}`,
  name: customers[i % customers.length]?.name || "عميل ميدو",
  rating: 4 + (i % 2),
  text,
  date: iso(-(i + 2) * DAY),
  product: products[i % products.length]?.name,
  productId: products[i % products.length]?.id,
  orderId: `ord_seed_${i}`,
  userId: customers[i % customers.length]?.id,
  verified: i % 3 !== 1,
  approved: i % 5 !== 3,
  featured: i % 4 === 0,
}));

// ============ التذاكر ============
const tickets: Ticket[] = [
  {
    id: "tk-1",
    number: "TK-1001",
    userId: "usr-c2",
    name: "سارة حسن",
    email: "sara@example.com",
    phone: "01112345678",
    subject: "استفسار عن وقت تنفيذ طلب شحن",
    orderNumber: "MS-100002",
    status: "in_progress",
    messages: [
      { id: "tm-1", fromAdmin: false, message: "السلام عليكم، طلبي اتعمل من ساعة ولسه مش متشحن — ممكن أعرف مدة التنفيذ؟", createdAt: iso(-6 * DAY) },
      { id: "tm-2", fromAdmin: true, message: "وعليكم السلام! طلبك في مرحلة التنفيذ الآن وسيصلك إشعار فور اكتمال الشحن، مدة التنفيذ القصوى ساعة واحدة.", createdAt: iso(-6 * DAY + 3600_000) },
    ],
    createdAt: iso(-6 * DAY),
    updatedAt: iso(-6 * DAY + 3600_000),
  },
  {
    id: "tk-2",
    number: "TK-1002",
    userId: "usr-c5",
    name: "ياسمين خالد",
    email: "yasmin@example.com",
    phone: "01144445555",
    subject: "متابعين انستجرام وصلوا جزئيًا",
    orderNumber: "MS-100010",
    status: "open",
    messages: [
      { id: "tm-3", fromAdmin: false, message: "طلبت 1000 متابع ووصلوا 300 بس، ناقص الباقي إيه الحل؟", createdAt: iso(-2 * DAY) },
    ],
    createdAt: iso(-2 * DAY),
    updatedAt: iso(-2 * DAY),
  },
];

// ============ الإشعارات ============
const notifications: Notification[] = [
  { id: "nt-1", userId: "usr-c2", type: "order", title: "تم تأكيد دفع طلبك", body: "طلبك MS-100002 اتدفع وبدأنا التنفيذ.", link: "/orders/track?order=MS-100002", read: false, createdAt: iso(-6 * DAY + 3600_000) },
  { id: "nt-2", userId: "usr-c2", type: "order", title: "تم تسليم طلبك", body: "طلبك MS-100002 اتنفذ بنجاح — شكرًا لثقتك!", link: "/orders/track?order=MS-100002", read: true, createdAt: iso(-5 * DAY) },
  { id: "nt-3", userId: "usr-c8", type: "offer", title: "عرض حصري جديد 🔥", body: "خصم 30% على البطولة الموسمية لفترة محدودة.", link: "/offers", read: false, createdAt: iso(-1 * DAY) },
  { id: "nt-4", type: "system", title: "ترحيب بمنصة ميدو ستور", body: "شحن أسرع، دعم 24/7، وأسعار ننافس عليها — أهلًا بيك!", read: false, createdAt: iso(-5 * DAY) },
];

// ============ البانرات ============
const banners: Banner[] = [
  { id: "bn-1", title: "اشحن شدات ببجي بسرعة وأمان", subtitle: "أفضل خدمات PUBG الرقمية بأسعار تنافسية وتنفيذ سريع وخسومات حتى 40%", image: "/images/uc-660.svg", buttonText: "تسوق الآن", buttonUrl: "/products", order: 1, active: true, createdAt: iso(-30 * DAY) },
  { id: "bn-2", title: "خدمات السوشيال ميديا", subtitle: "متابعين ومشاهدات وإعجابات لكل المنصات بتسليم سريع وضمان تعويض", image: "/images/social-instagram.svg", buttonText: "اكتشف الخدمات", buttonUrl: "/services/social-media", order: 2, active: true, createdAt: iso(-25 * DAY) },
  { id: "bn-3", title: "بطولة الموسم بخصم 16%", subtitle: "اشحن Royale Pass بـ 960 UC وحقق أقصى جوائز الموسم", image: "/images/royale-pass.svg", buttonText: "اشتري دلوقتي", buttonUrl: "/products/pubg-royale-pass", order: 3, active: true, createdAt: iso(-20 * DAY) },
  { id: "bn-4", title: "نسخة ببجي كوريا", subtitle: "شحن KR فوري بأسعار حصرية", image: "/images/uc-kr.svg", buttonText: "شحن KR", buttonUrl: "/products?category=pubg-kr", order: 4, active: false, createdAt: iso(-10 * DAY) },
];

// ============ أقسام الرئيسية ============
const homepage: HomepageSection[] = [
  { key: "hero", name: "الواجهة الرئيسية (Hero)", enabled: true, order: 1 },
  { key: "trust-bar", name: "شريط الثقة", enabled: true, order: 2 },
  { key: "categories", name: "الفئات", enabled: true, title: "تصفح حسب الفئة", subtitle: "كل احتياجاتك الرقمية في مكان واحد — اختر الفئة وابدأ طلبك مباشرة.", order: 3 },
  { key: "featured", name: "منتجات مميزة", enabled: true, title: "الأكثر تميزًا", subtitle: "منتجات مختارة بعناية لعملائنا.", order: 4 },
  { key: "best-sellers", name: "الأكثر مبيعًا", enabled: true, title: "الأكثر مبيعًا", subtitle: "المنتجات اللي عملاؤنا بيثقوا فيها أكثر.", order: 5 },
  { key: "offers", name: "العروض والفلو سيل", enabled: true, title: "عروض اليوم 🔥", subtitle: "خصومات تصل إلى 40% — العرض ينتهي قريبًا!", order: 6 },
  { key: "why-us", name: "لماذا نحن", enabled: true, order: 7 },
  { key: "reviews", name: "آراء العملاء", enabled: true, title: "ماذا يقول عملاؤنا؟", order: 8 },
  { key: "faq", name: "الأسئلة الشائعة", enabled: true, order: 9 },
  { key: "contact", name: "تواصل معنا", enabled: true, order: 10 },
];

// ============ العروض ============
const offers: Offer[] = [
  { id: "of-1", title: "فلو سيل شدات UC", description: "خصم فوري 15% على كل باقات شدات UC اليوم فقط.", badge: "فلاش سيل", image: "/images/uc-660.svg", discountPct: 15, productIds: ["p-uc-60", "p-uc-120", "p-uc-325", "p-uc-660", "p-uc-1800", "p-uc-3850", "p-uc-8100"], startsAt: iso(-1 * DAY), endsAt: offerEnds, active: true, order: 1, createdAt: iso(-2 * DAY) },
  { id: "of-2", title: "عرض السوشيال ميديا", description: "خصم 20% على جميع خدمات السوشيال ميديا عند الكميات الكبيرة.", badge: "خصم 20%", image: "/images/social-instagram.svg", discountPct: 20, productIds: ["p-social-instagram-1000", "p-social-tiktok-500", "p-social-youtube-5000", "p-social-youtube-subs-1000"], startsAt: iso(-3 * DAY), endsAt: offerEnds, active: true, order: 2, createdAt: iso(-3 * DAY) },
  { id: "of-3", title: "باقة المحترفين", description: "اشترِ 3850 UC + 8100 UC معًا ووفّر 20% إضافية.", badge: "باندل خاص", image: "/images/uc-3850.svg", discountPct: 20, productIds: ["p-uc-3850", "p-uc-8100"], startsAt: iso(-2 * DAY), endsAt: iso(5 * DAY), active: true, order: 3, createdAt: iso(-2 * DAY) },
];

// ============ الإعدادات ============
const settings: Settings = {
  storeName: "MEDO STORE",
  tagline: "متجرك الرقمي لشحن الألعاب والخدمات",
  currency: "EGP",
  email: "support@medostore.shop",
  phone: "+201000000000",
  whatsapp: "201000000000",
  telegram: "medostore",
  facebook: "medostore",
  instagram: "medostore",
  tiktok: "medostore",
  address: "القاهرة، مصر",
  deliveryNote: "الطلبات الرقمية تُنفذ عادة خلال دقائق إلى ساعتين. يُرجى مراجعة بياناتك قبل إتمام الطلب.",
  offerEndsAt: offerEnds,
  announcement: "🔥 خصم يصل إلى 40% على شدات ببجي — لفترة محدودة",
  paymentMethods: ["fawry", "vodafone", "instapay", "bank", "card"],
  logoUrl: "",
  seo: {
    metaTitle: "MEDO STORE — شحن شدات ببجي وخدمات الألعاب الرقمية",
    metaDescription: "شحن شدات ببجي موبايل والكورية، خدمات السوشيال ميديا، والمنتجات الرقمية بأسعار منافسة وتنفيذ سريع ودفع آمن.",
    keywords: ["شحن شدات ببجي", "شدات ببجي", "UC", "خدمات السوشيال ميديا", "شحن العاب"],
    ogImage: "/og.png",
  },
  checkout: {
    minOrderAmount: 0,
    maxOrderAmount: undefined,
    guestCheckout: true,
    couponEnabled: true,
  },
  notifications: {
    customerOnOrder: true,
    customerOnPayment: true,
    customerOnStatus: true,
    adminOnNewOrder: true,
    adminOnNewTicket: true,
    emailEnabled: false,
  },
};

export function buildSeed(): Store {
  return {
    users: [...adminUsers, ...customers],
    categories,
    products,
    orders,
    payments,
    coupons,
    reviews,
    messages: [],
    tickets,
    notifications,
    banners,
    homepage,
    offers,
    roles,
    auditLogs: [],
    settings,
  };
}