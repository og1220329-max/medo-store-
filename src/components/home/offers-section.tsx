import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";
import { getStore } from "@/lib/db/store";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/common";
import { Button, Badge } from "@/components/ui/primitives";
import { CountdownTimer } from "@/components/ui/countdown";

export async function OffersSection() {
  const store = await getStore();
  const discounted = store.products
    .filter((p) => p.active && p.oldPrice && p.oldPrice > p.price)
    .sort((a, b) => {
      const da = ((a.oldPrice! - a.price) / a.oldPrice!) * 100;
      const db = ((b.oldPrice! - b.price) / b.oldPrice!) * 100;
      return db - da;
    })
    .slice(0, 4);

  const hero = discounted[0];

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-volt-950/20 to-transparent" />
      <div className="pointer-events-none absolute start-0 top-1/2 size-72 -translate-y-1/2 rounded-full bg-rose-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading
          center
          eyebrow={<span className="inline-flex items-center gap-1.5"><Flame className="size-4 text-rose-400" /> عروض محدودة</span>}
          title="عروض اليوم 🔥"
          subtitle="خصومات تصل إلى 40% على شدات ببجي والخدمات الرقمية — العرض ينتهي قريبًا!"
        />

        <div className="mx-auto mb-14 flex justify-center">
          <CountdownTimer endsAt={store.settings.offerEndsAt} />
        </div>

        {hero && (
          <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-volt-500/25 shadow-glow-lg">
            <div className="absolute inset-0 animate-gradient-x bg-[linear-gradient(120deg,#3b1d6e,#122a5e,#0e3a4a)] bg-[length:200%_200%]" />
            <div className="absolute inset-0 bg-hero-grid opacity-30" />

            <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1fr_auto] md:p-12">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge tone="rose" className="text-sm">
                    خصم حتى {Math.round(((hero.oldPrice! - hero.price) / hero.oldPrice!) * 100)}%
                  </Badge>
                  <Badge tone="amber">لفترة محدودة</Badge>
                </div>
                <h3 className="text-3xl font-black text-white md:text-4xl">
                  {hero.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
                  {hero.description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-3xl font-black text-white">
                    {formatPrice(hero.price)}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(hero.oldPrice!)}
                  </span>
                </div>
                <Link href={`/products/${hero.slug}`} className="mt-8 inline-block">
                  <Button size="lg">
                    اغتنم العرض
                    <ArrowLeft className="size-5" />
                  </Button>
                </Link>
              </div>

              <div
                className="relative mx-auto hidden w-72 animate-float md:block"
              >
                <div className="absolute inset-0 rounded-full bg-volt-500/30 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="relative aspect-square w-full rounded-3xl border border-white/15 object-cover shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {discounted.slice(1, 4).map((product) => {
            const pct = Math.round(
              ((product.oldPrice! - product.price) / product.oldPrice!) * 100
            );
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden rounded-3xl glass p-5 transition hover:border-volt-500/30 hover:shadow-glow"
              >
                <div className="absolute -end-4 -top-4 size-24 rounded-full bg-volt-500/15 blur-2xl transition group-hover:bg-volt-500/25" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-20 rounded-2xl border border-white/10 object-cover"
                    />
                    <span className="absolute -end-2 -top-2 flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-[11px] font-black text-white shadow-lg">
                      {pct}%
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-base font-black text-white">
                      {product.name}
                    </h4>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-lg font-black text-gradient">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        {formatPrice(product.oldPrice!)}
                      </span>
                    </div>
                  </div>
                  <ArrowLeft className="size-4 shrink-0 text-slate-600 transition group-hover:-translate-x-1 group-hover:text-volt-300" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/offers">
            <Button variant="outline" size="lg">
              كل العروض
              <ArrowLeft className="size-4.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}