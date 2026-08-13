import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, CheckCircle2, Gem, Info, ShieldCheck, Truck, Zap } from "lucide-react";
import { getStore } from "@/lib/db/store";
import { SITE } from "@/lib/constants";
import { discountPercent, formatPrice } from "@/lib/utils";
import { Breadcrumbs, StarRating } from "@/components/ui/common";
import { Badge } from "@/components/ui/primitives";
import { ProductActions } from "@/components/product/product-actions";
import { jsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore();
  const product = store.products.find((p) => p.slug === slug);
  if (!product) return { title: "منتج غير موجود" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
      type: "website",
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStore();
  const product = store.products.find((p) => p.slug === slug && p.active);
  if (!product) notFound();

  const category = store.categories.find((c) => c.id === product.categoryId);
  const related = store.products
    .filter(
      (p) =>
        p.active &&
        p.id !== product.id &&
        p.categoryId === product.categoryId
    )
    .slice(0, 4);

  const hasRelated = related.length > 0;
  void hasRelated;

  const discount = discountPercent(product.price, product.oldPrice);
  const stockOut = product.stock === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd.product(product, SITE.url),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "المتجر", href: "/products" },
          { label: category?.name || "التصنيف", href: category ? `/categories/${category.slug}` : "/products" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-night-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute start-4 top-4 flex flex-col items-start gap-2">
              {discount > 0 && <Badge tone="rose" className="text-sm">خصم {discount}%</Badge>}
              {product.badge && <Badge tone="volt" className="text-sm">{product.badge}</Badge>}
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="size-5" />
            <span className="text-sm text-slate-500">
              ({product.reviewsCount} تقييم)
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-black leading-snug text-white md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-end gap-4">
            <span className="text-4xl font-black text-gradient">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="pb-1.5 text-xl text-slate-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-8 text-slate-400 md:text-base">
            {product.description}
          </p>

          {product.features.length > 0 && (
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="size-4.5 shrink-0 text-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl glass p-3.5 text-center">
              <Zap className="mx-auto mb-1.5 size-5 text-amber-400" />
              <p className="text-xs font-bold text-white">التنفيذ</p>
              <p className="mt-0.5 text-[11px] text-slate-500">{product.deliveryTime}</p>
            </div>
            <div className="rounded-2xl glass p-3.5 text-center">
              <ShieldCheck className="mx-auto mb-1.5 size-5 text-emerald-400" />
              <p className="text-xs font-bold text-white">الدفع</p>
              <p className="mt-0.5 text-[11px] text-slate-500">فوري / كاش / بنك</p>
            </div>
            <div className="rounded-2xl glass p-3.5 text-center">
              <Truck className="mx-auto mb-1.5 size-5 text-sky-400" />
              <p className="text-xs font-bold text-white">الشحن</p>
              <p className="mt-0.5 text-[11px] text-slate-500">خلال دقائق</p>
            </div>
            <div className="rounded-2xl glass p-3.5 text-center">
              <Gem className="mx-auto mb-1.5 size-5 text-volt-400" />
              <p className="text-xs font-bold text-white">الحالة</p>
              <p
                className={`mt-0.5 text-[11px] font-bold ${
                  stockOut ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {stockOut ? "نفد المخزون" : "متوفر"}
              </p>
            </div>
          </div>

          <ProductActions product={product} />

          {product.requiredFields.length > 0 && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-sky-500/20 bg-sky-500/8 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-sky-400" />
              <div className="text-xs leading-6 text-slate-400">
                <p className="font-bold text-sky-300">إعداد البيانات المطلوبة</p>
                ستظهر حقول إدخال بيانات الحساب (مثل Player ID والمنطقة) عند
                إضافة المنتج للسلة أو إتمام الشراء المباشر.
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2.5 text-xs text-slate-500">
            <CalendarClock className="size-4" />
            متوسط تقييم العملاء {product.rating} من 5 — طلبات قابلة للمتابعة من
            صفحة تتبع الطلب.
          </div>
        </div>
      </div>
    </div>
  );
}