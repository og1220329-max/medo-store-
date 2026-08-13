import type { Metadata } from "next";
import { getStore } from "@/lib/db/store";
import { Breadcrumbs } from "@/components/ui/common";
import { ProductCard } from "@/components/product/product-card";
import { SocialMediaCalculator } from "@/components/services/social-calculator";

export const metadata: Metadata = {
  title: "خدمات السوشيال ميديا",
  description:
    "متابعين ولايكات ومشاهدات لإنستجرام وتيك توك ويوتيوب — باقات جاهزة أو احسب سعرك بنفسك.",
};

export default async function SocialMediaPage() {
  const store = await getStore();
  const products = store.products.filter(
    (p) => p.active && p.categoryId === "c-social"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "الخدمات", href: "/services" }, { label: "السوشيال ميديا" }]} />

      <div className="relative mt-5 mb-12 overflow-hidden rounded-[2rem] border border-fuchsia-500/20 bg-gradient-to-l from-night-800 via-night-900 to-night-800 p-8 md:p-12">
        <div className="pointer-events-none absolute -end-24 -top-24 size-64 rounded-full bg-fuchsia-600/15 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-28 -start-20 size-64 rounded-full bg-sky-600/15 blur-[110px]" />
        <div className="relative max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-bold text-fuchsia-300">
            ✦ نمو آمن وطبيعي
          </span>
          <h1 className="text-3xl font-black text-white md:text-4xl">
            خدمات السوشيال ميديا
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
            متابعين، لايكات، ومشاهدات لكل المنصات — تنفيذ تدريجي آمن بدون
            الحاجة لكلمة مرور حسابك، مع دعم فني كامل.
          </p>
        </div>
      </div>

      <h2 className="mb-6 text-xl font-black text-white md:text-2xl">
        باقات جاهزة للطلب المباشر
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      <SocialMediaCalculator />
    </div>
  );
}