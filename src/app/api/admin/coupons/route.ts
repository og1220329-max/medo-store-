import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Coupon } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).coupons);
}

function cleanCoupon(body: Record<string, unknown>, existing?: Coupon): Coupon {
  const code = String(body.code || existing?.code || "")
    .trim()
    .toUpperCase();
  return {
    id: existing?.id || uid("cpn_"),
    code,
    type: body.type === "fixed" ? "fixed" : "percent",
    value: Math.max(0, Number(body.value ?? existing?.value ?? 0)),
    minOrder: body.minOrder ? Math.max(0, Number(body.minOrder)) : undefined,
    maxUses: Math.max(1, Number(body.maxUses ?? existing?.maxUses ?? 100)),
    used: existing?.used || 0,
    expiresAt: body.expiresAt ? String(body.expiresAt) : existing?.expiresAt,
    active: body.active != null ? Boolean(body.active) : existing?.active !== false,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!String(body.code || "").trim()) {
    return NextResponse.json({ message: "كود الخصم مطلوب" }, { status: 422 });
  }

  let conflict = false;
  const coupon = cleanCoupon(body);
  await saveStore((s) => {
    if (s.coupons.some((c) => c.code.toUpperCase() === coupon.code)) {
      conflict = true;
      return;
    }
    s.coupons.push(coupon);
    logAudit({ adminName: adminName(s, admin.userId), action: "create", entity: "coupon", entityId: coupon.id, details: { code: coupon.code }, ip: getClientIp(request) }, s);
  });
  if (conflict) {
    return NextResponse.json({ message: "هذا الكود مسجل بالفعل" }, { status: 409 });
  }
  return NextResponse.json({ coupon, ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف الكوبون مطلوب" }, { status: 422 });

  let updated: Coupon | null = null;
  await saveStore((s) => {
    const existing = s.coupons.find((c) => c.id === id);
    if (!existing) return;
    updated = cleanCoupon(body, existing);
    Object.assign(existing, updated);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "coupon", entityId: id, ip: getClientIp(request) }, s);
  });
  if (!updated) return NextResponse.json({ message: "الكوبون غير موجود" }, { status: 404 });
  return NextResponse.json({ coupon: updated, ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  let found = false;
  await saveStore((s) => {
    const idx = s.coupons.findIndex((c) => c.id === id);
    if (idx >= 0) {
      s.coupons.splice(idx, 1);
      logAudit({ adminName: adminName(s, admin.userId), action: "delete", entity: "coupon", entityId: id, ip: getClientIp(request) }, s);
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "الكوبون غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}