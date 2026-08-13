import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  const products = store.products.filter((p) => p.active);
  return NextResponse.json(products);
}