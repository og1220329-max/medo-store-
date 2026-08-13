import Link from "next/link";
import {
  Package,
  Facebook,
  Instagram,
  Send,
  Mail,
  MessageCircle,
} from "lucide-react";
import { getStore } from "@/lib/db/store";
import { PAYMENT_METHODS } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "المتجر", href: "/products" },
  { label: "العروض", href: "/offers" },
  { label: "تتبع الطلب", href: "/orders/track" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "تواصل معنا", href: "/contact" },
];

const CATEORY_LINKS = [
  { label: "خدمات ببجي", href: "/categories/pubg-services" },
  { label: "شدات ببجي", href: "/categories/pubg-uc" },
  { label: "السوشيال ميديا", href: "/services/social-media" },
  { label: "المنتجات الرقمية", href: "/categories/digital-products" },
];

export async function Footer() {
  const settings = (await getStore()).settings;
  const year = new Date().getFullYear();

  const socials = [
    settings.facebook && {
      href: `https://facebook.com/${settings.facebook}`,
      icon: Facebook,
      label: "فيسبوك",
    },
    settings.instagram && {
      href: `https://instagram.com/${settings.instagram}`,
      icon: Instagram,
      label: "إنستجرام",
    },
    settings.telegram && {
      href: `https://t.me/${settings.telegram}`,
      icon: Send,
      label: "تيليجرام",
    },
    settings.whatsapp && {
      href: `https://wa.me/${settings.whatsapp}`,
      icon: MessageCircle,
      label: "واتساب",
    },
  ].filter(Boolean) as { href: string; icon: typeof Facebook; label: string }[];

  return (
    <footer className="relative mt-24 border-t border-white/8 bg-night-900/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-volt-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="الرئيسية">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-volt-600 to-glow-600 shadow-glow">
                <Package className="size-5 text-white" />
              </span>
              <span className="text-lg font-black text-white">
                MEDO <span className="text-gradient">STORE</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {settings.tagline}. شحن شدات ببجي، خدمات السوشيال ميديا،
              والمنتجات الرقمية — تنفيذ سريع ودفع آمن ودعم على مدار الساعة.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:border-volt-500/40 hover:text-volt-300"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-white">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 transition hover:text-volt-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-white">الفئات</h3>
            <ul className="space-y-2.5">
              {CATEORY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 transition hover:text-volt-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black text-white">خدمة العملاء</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-volt-300"
                >
                  <MessageCircle className="size-4" />
                  واتساب
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-volt-300"
                  dir="ltr"
                >
                  <Mail className="size-4" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-volt-300"
                >
                  <Mail className="size-4" />
                  {settings.email}
                </a>
              </li>
              <li className="pt-3 text-xs text-slate-500">{settings.address}</li>
            </ul>

            <h3 className="mb-3 mt-6 text-xs font-black text-slate-300">
              طرق الدفع
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(PAYMENT_METHODS)
                .filter((m) => settings.paymentMethods.includes(m.id))
                .map((m) => (
                  <span
                    key={m.id}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-300"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: m.color }}
                    />
                    {m.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center md:flex-row md:px-6">
          <p className="text-xs text-slate-500">
            © {year} {settings.storeName} — جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href="/terms" className="text-slate-500 transition hover:text-volt-300">
              الشروط والأحكام
            </Link>
            <Link href="/privacy-policy" className="text-slate-500 transition hover:text-volt-300">
              سياسة الخصوصية
            </Link>
            <Link href="/refund-policy" className="text-slate-500 transition hover:text-volt-300">
              سياسة الاسترجاع
            </Link>
          </div>
          <p className="text-xs text-slate-600">
            شحن الألعاب والخدمات الرقمية بسرعة وأمان 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}