import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/db/store";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/common";
import { EmptyState } from "@/components/ui/primitives";
import { PackageOpen } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore();
  const category = store.categories.find((c) => c.slug === slug);
  if (!category) return { title: "الفئة غير موجودة" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStore();
  const category = store.categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = store.products.filter(
    (p) => p.active && p.categoryId === category.id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs items={[{ label: "المتجر", href: "/products" }, { label: category.name }]} />

      <div className="relative mt-5 mb-10 overflow-hidden rounded-[2rem] border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-night-950 via-night-950/70 to-night-950/30" />
        <div className="relative px-6 py-12 md:px-10 md:py-16">
          <h1 className="text-3xl font-black text-white md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
            {category.description}
          </p>
          <span className="mt-4 inline-flex rounded-full border border-volt-500/30 bg-volt-500/10 px-3.5 py-1 text-xs font-bold text-volt-300">
            {products.length} منتج متاح
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="size-7" />}
          title="لا توجد منتجات في هذه الفئة"
          description="قريبًا سيتوفر المزيد من المنتجات هنا."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}