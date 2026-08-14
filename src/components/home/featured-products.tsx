import Link from "next/link";
import { ArrowLeft, Flame, Gift, Gem as GemIcon, Users } from "lucide-react";
import type { Product } from "@/lib/types";
import { getStore } from "@/lib/db/store";
import { SectionHeading } from "@/components/ui/common";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/primitives";
import { CountdownTimer } from "@/components/ui/countdown";

export async function FeaturedProducts({
  mode = "featured",
}: {
  mode?: "featured" | "best";
}) {
  const store = await getStore();
  const featured = store.products
    .filter((p) => p.active && (mode === "best" ? p.bestSeller : p.featured))
    .slice(0, 8);
  const categoryMeta: Record<string, { label: string; icon: typeof Flame; href: string }> = {
    "c-pubg-uc": { label: "شدات ببجي", icon: GemIcon, href: "/categories/pubg-uc" },
    "c-social": { label: "السوشيال ميديا", icon: Users, href: "/services/social-media" },
    "c-pubg-services": { label: "خدمات ببجي", icon: Flame, href: "/categories/pubg-services" },
    "c-digital": { label: "منتجات رقمية", icon: Gift, href: "/categories/digital" },
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading
        eyebrow="الأكثر طلبًا"
        title="المنتجات الأكثر طلبًا"
        subtitle="منتجات مختارة بعناية بناءً على طلبات عملائنا — بأسعار لا تُنافس."
        action={
          <Link href="/products" className="hidden sm:block">
            <Button variant="ghost">
              كل المنتجات
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product: Product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {store.categories.slice(0, 3).map((cat) => {
          const meta = categoryMeta[cat.id];
          const Icon = meta?.icon || Flame;
          return (
            <Link
              key={cat.id}
              href={meta?.href || `/categories/${cat.slug}`}
              className="group flex items-center justify-between rounded-2xl glass p-5 transition hover:border-volt-500/30 hover:bg-white/6"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-volt-500/12 text-volt-300 transition group-hover:bg-volt-500 group-hover:text-white group-hover:shadow-glow">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-black text-white">{cat.name}</span>
              </span>
              <ArrowLeft className="size-4 text-slate-600 transition group-hover:-translate-x-1 group-hover:text-volt-300" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}