import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).reviews);
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف التقييم مطلوب" }, { status: 422 });

  let updated: Review | null = null;
  await saveStore((s) => {
    const existing = s.reviews.find((r) => r.id === id);
    if (!existing) return;
    if (body.approved != null) existing.approved = Boolean(body.approved);
    if (body.featured != null) existing.featured = Boolean(body.featured);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "review", entityId: id, details: { approved: body.approved, featured: body.featured }, ip: getClientIp(request) }, s);
    updated = { ...existing };
  });
  if (!updated) return NextResponse.json({ message: "التقييم غير موجود" }, { status: 404 });
  return NextResponse.json({ review: updated, ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  let found = false;
  await saveStore((s) => {
    const idx = s.reviews.findIndex((r) => r.id === id);
    if (idx >= 0) {
      s.reviews.splice(idx, 1);
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "التقييم غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}