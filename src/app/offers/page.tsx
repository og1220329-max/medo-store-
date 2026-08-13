import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { getStore } from "@/lib/db/store";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/common";
import { Badge } from "@/components/ui/primitives";
import { CountdownTimer } from "@/components/ui/countdown";

export const metadata: Metadata = {
  title: "عروض اليوم",
  description: "خصومات تصل إلى 40% على شدات ببجي والخدمات الرقمية.",
};

export default async function OffersPage() {
  const store = await getStore();
  const discounted = store.products
    .filter((p) => p.active && p.oldPrice && p.oldPrice > p.price)
    .sort((a, b) => {
      const da = (a.oldPrice! - a.price) / a.oldPrice!;
      const db = (b.oldPrice! - b.price) / b.oldPrice!;
      return db - da;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "العروض" }]} />

      <div className="relative mt-5 mb-12 overflow-hidden rounded-[2rem] border border-rose-500/20 bg-gradient-to-l from-rose-950/60 via-night-900 to-night-900 p-8 md:p-12">
        <div className="pointer-events-none absolute -end-24 -top-24 size-64 rounded-full bg-rose-600/15 blur-[110px]" />
        <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-start">
          <div>
            <h1 className="flex items-center gap-2.5 text-3xl font-black text-white md:text-4xl">
              <Flame className="size-8 text-rose-500" />
              عروض اليوم 🔥
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-400">
              خصومات تصل إلى 40% — العرض محدود، اطلب قبل انتهاء الوقت.
            </p>
          </div>
          <div className="text-center">
            <p className="mb-2 text-xs font-bold text-slate-400">ينتهي العرض خلال</p>
            <CountdownTimer endsAt={store.settings.offerEndsAt} compact />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {discounted.map((product) => {
          const pct = Math.round(
            ((product.oldPrice! - product.price) / product.oldPrice!) * 100
          );
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group relative overflow-hidden rounded-3xl glass transition hover:border-volt-500/30 hover:shadow-glow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent" />
                <span className="absolute end-3 top-3 flex size-14 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 font-black text-white shadow-lg">
                  <span className="text-lg leading-none">-{pct}%</span>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <Badge tone="amber" className="mb-2">عرض اليوم</Badge>
                  <h3 className="text-lg font-black text-white">{product.name}</h3>
                </div>
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <span className="block text-xl font-black text-gradient">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.oldPrice!)}
                  </span>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-volt-500/15 text-volt-300 transition group-hover:bg-volt-500 group-hover:text-white group-hover:shadow-glow">
                  <ArrowLeft className="size-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 rounded-3xl glass p-8 text-center">
        <h2 className="text-xl font-black text-white">
          كود خصم إضافي 🔖
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          استخدم كود <Badge tone="volt" className="mx-1 text-sm">OFFER40</Badge>
          عند إتمام الطلب للحصول على خصم إضافي يصل إلى 40% على الطلبات فوق
          300 ج.م.
        </p>
      </div>
    </div>
  );
}