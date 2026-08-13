import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { getStore } from "@/lib/db/store";
import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/filters";
import { Breadcrumbs } from "@/components/ui/common";
import { EmptyState, Skeleton } from "@/components/ui/primitives";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const store = await getStore();
  const categories = store.categories;

  const q = (params.q || "").trim().toLowerCase();
  const categorySlug = params.category || "";
  const sort = params.sort || "newest";

  let products = store.products.filter((p) => p.active);

  if (categorySlug) {
    const cat = categories.find((c) => c.slug === categorySlug);
    if (cat) products = products.filter((p) => p.categoryId === cat.id);
  }

  if (q) {
    const catNames = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));
    products = products.filter((p) => {
      const hay = [
        p.name,
        p.description,
        p.badge || "",
        catNames.get(p.categoryId) || "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    case "discount":
      products.sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return db - da;
      });
      break;
    default:
      products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 md:px-6 md:pt-36">
      <Breadcrumbs
        items={[{ label: activeCategory ? activeCategory.name : "المتجر" }]}
      />

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-black text-white md:text-4xl">
          {activeCategory ? activeCategory.name : "جميع المنتجات"}
        </h1>
        <p className="mt-2 text-sm text-slate-400 md:text-base">
          {q
            ? `نتائج البحث عن «${params.q}» — `
            : ""}
          {products.length} منتج متاح الآن
        </p>
      </div>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} sort={sort} />
      </Suspense>

      {products.length === 0 ? (
        <EmptyState
          icon={<SearchX className="size-7" />}
          title="لا توجد منتجات مطابقة"
          description="جرّب تغيير فلاتر البحث أو تصفح جميع الفئات."
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

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl glass">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return <ProductsSkeleton />;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const title = params.category
    ? `فئة ${params.category}`
    : params.q
    ? `بحث: ${params.q}`
    : "المتجر";
  return {
    title,
    description: "تصفح جميع منتجاتنا الرقمية — شدات ببجي وخدمات السوشيال ميديا.",
  };
}