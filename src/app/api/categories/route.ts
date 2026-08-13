import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const categories = store.categories.map((c) => ({
    ...c,
    productCount: store.products.filter(
      (p) => p.active && p.categoryId === c.id
    ).length,
  }));
  return NextResponse.json(categories);
}