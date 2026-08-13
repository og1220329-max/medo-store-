import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  if (q.length < 2) {
    return NextResponse.json({ products: [], query: q });
  }

  const store = await getStore();
  const categoryNames = new Map(
    store.categories.map((c) => [c.id, c.name.toLowerCase()])
  );

  const products = store.products
    .filter((p) => p.active)
    .filter((p) => {
      const haystack = [
        p.name,
        p.description,
        p.categoryId,
        p.badge || "",
        categoryNames.get(p.categoryId) || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 12)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      image: p.image,
      price: p.price,
      oldPrice: p.oldPrice,
    }));

  return NextResponse.json(products);
}