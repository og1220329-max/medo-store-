import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { slugifyAscii, uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

function cleanProduct(body: Record<string, unknown>, existing?: Product): Product {
  const base: Pick<Product, "id" | "slug" | "createdAt"> & Partial<Product> =
  existing || {
    id: uid("p_"),
    slug: "",
    createdAt: new Date().toISOString(),
  };
  const name = String(body.name || base.name || "").trim();
  const slug =
    slugifyAscii(String(body.slug || "")) ||
    slugifyAscii(name) ||
    base.id;

  return {
    id: base.id,
    slug,
    name,
    description: String(body.description || base.description || "").trim(),
    categoryId: String(body.categoryId || base.categoryId || ""),
    image: String(body.image || base.image || ""),
    images: Array.isArray(body.images)
      ? (body.images as string[])
      : base.images,
    price: Math.max(0, Number(body.price ?? base.price ?? 0)),
    oldPrice:
      body.oldPrice != null && body.oldPrice !== ""
        ? Math.max(0, Number(body.oldPrice))
        : undefined,
    stock: Math.max(0, Number(body.stock ?? base.stock ?? 0)),
    rating: Number(body.rating ?? base.rating ?? 4.8),
    reviewsCount: Number(body.reviewsCount ?? base.reviewsCount ?? 0),
    featured: Boolean(body.featured ?? base.featured ?? false),
    active: body.active != null ? Boolean(body.active) : base.active !== false,
    deliveryTime: String(body.deliveryTime || base.deliveryTime || "سريع").trim(),
    features: Array.isArray(body.features)
      ? (body.features as string[]).map(String)
      : base.features || [],
    requiredFields: Array.isArray(body.requiredFields)
      ? (body.requiredFields as Product["requiredFields"])
      : base.requiredFields || [],
    badge: body.badge ? String(body.badge) : base.badge,
    createdAt: base.createdAt,
  };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!String(body.name || "").trim()) {
    return NextResponse.json({ message: "اسم المنتج مطلوب" }, { status: 422 });
  }

  const product = cleanProduct(body);
  await saveStore((s) => {
    s.products.push(product);
    logAudit({ adminName: adminName(s, admin.userId), action: "create", entity: "product", entityId: product.id, details: { name: product.name }, ip: getClientIp(request) }, s);
  });
  return NextResponse.json({ product, ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف المنتج مطلوب" }, { status: 422 });

  let updated: Product | null = null;
  await saveStore((s) => {
    const existing = s.products.find((p) => p.id === id);
    if (!existing) return;
    updated = cleanProduct(body, existing);
    Object.assign(existing, updated);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "product", entityId: id, ip: getClientIp(request) }, s);
  });

  if (!updated) {
    return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
  }
  return NextResponse.json({ product: updated, ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  if (!id) return NextResponse.json({ message: "معرف المنتج مطلوب" }, { status: 422 });

  let found = false;
  await saveStore((s) => {
    const idx = s.products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      s.products.splice(idx, 1);
      logAudit({ adminName: adminName(s, admin.userId), action: "delete", entity: "product", entityId: id, ip: getClientIp(request) }, s);
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "المنتج غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}