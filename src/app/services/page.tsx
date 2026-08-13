import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Gem,
  Gift,
  Package,
  Users,
} from "lucide-react";
import { getStore } from "@/lib/db/store";
import { Breadcrumbs } from "@/components/ui/common";

export const metadata: Metadata = {
  title: "الخدمات",
  description: "جميع خدماتنا الرقمية في مكان واحد.",
};

const SERVICE_CARDS = [
  {
    href: "/categories/pubg-uc",
    icon: Gem,
    title: "شدات ببجي",
    text: "شحن شدات ببجي موبايل والنسخ الكورية بجميع الفئات",
    color: "from-volt-500 to-glow-500",
  },
  {
    href: "/categories/pubg-services",
    icon: Package,
    title: "خدمات ببجي",
    text: "رويال باس وباقات ومميزات متخصصة داخل اللعبة",
    color: "from-amber-500 to-rose-500",
  },
  {
    href: "/services/social-media",
    icon: Users,
    title: "خدمات السوشيال ميديا",
    text: "متابعين ولايكات ومشاهدات لكل المنصات",
    color: "from-fuchsia-500 to-rose-500",
  },
  {
    href: "/categories/digital-products",
    icon: Gift,
    title: "المنتجات الرقمية",
    text: "بطاقات قيمة واشتراكات وخدمات رقمية متنوعة",
    color: "from-emerald-500 to-cyan-500",
  },
];

export default async function ServicesPage() {
  const store = await getStore();
  const allProducts = store.products.filter((p) => p.active).length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "الخدمات" }]} />

      <div className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-3xl font-black text-white md:text-4xl">
          جميع الخدمات الرقمية
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
          أكثر من {allProducts} منتج وخدمة جاهزة للتنفيذ الفوري — اختر ما
          يناسبك أو تواصل معنا لطلب مخصص.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {SERVICE_CARDS.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative overflow-hidden rounded-3xl glass p-7 transition hover:border-volt-500/30 hover:shadow-glow"
          >
            <div className="absolute -end-10 -top-10 size-40 rounded-full bg-volt-500/10 blur-3xl transition group-hover:bg-volt-500/20" />
            <div className="relative">
              <span
                className={`mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg transition group-hover:scale-110`}
              >
                <card.icon className="size-6.5" />
              </span>
              <h2 className="text-xl font-black text-white">{card.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">{card.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-volt-300">
                تصفح الخدمة
                <ArrowLeft className="size-4 transition group-hover:-translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}