import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const catNames = new Map(store.categories.map((c) => [c.id, c.name]));
  const products = store.products.map((p) => ({
    ...p,
    categoryName: catNames.get(p.categoryId) || "",
  }));
  return NextResponse.json(products);
}