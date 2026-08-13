import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Offer } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).offers);
}

function cleanOffer(body: Record<string, unknown>, existing?: Offer): Offer {
  const ids = Array.isArray(body.productIds)
    ? body.productIds.filter((x) => typeof x === "string")
    : existing?.productIds || [];
  return {
    id: existing?.id || uid("ofr_"),
    title: String(body.title || existing?.title || "").trim(),
    description:
      body.description != null
        ? String(body.description).trim() || undefined
        : existing?.description,
    badge:
      body.badge != null ? String(body.badge).trim() || undefined : existing?.badge,
    image:
      body.image != null ? String(body.image).trim() || undefined : existing?.image,
    discountPct:
      body.discountPct != null
        ? Math.max(0, Number(body.discountPct))
        : existing?.discountPct,
    productIds: ids as string[],
    startsAt:
      body.startsAt != null
        ? String(body.startsAt) || undefined
        : existing?.startsAt,
    endsAt:
      body.endsAt != null ? String(body.endsAt) || undefined : existing?.endsAt,
    active:
      body.active != null ? Boolean(body.active) : existing?.active !== false,
    order: Math.max(0, Number(body.order ?? existing?.order ?? 0)),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (!String(body.title || "").trim()) {
    return NextResponse.json({ message: "عنوان العرض مطلوب" }, { status: 422 });
  }

  let offer: Offer | null = null;
  await saveStore((s) => {
    offer = cleanOffer(body);
    s.offers.push(offer);
    logAudit({ adminName: adminName(s, admin.userId), action: "create", entity: "offer", entityId: offer.id, ip: getClientIp(request) }, s);
  });
  return NextResponse.json({ offer, ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف العرض مطلوب" }, { status: 422 });

  let updated: Offer | null = null;
  await saveStore((s) => {
    const existing = s.offers.find((o) => o.id === id);
    if (!existing) return;
    updated = cleanOffer(body, existing);
    Object.assign(existing, updated);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "offer", entityId: id, ip: getClientIp(request) }, s);
  });
  if (!updated) return NextResponse.json({ message: "العرض غير موجود" }, { status: 404 });
  return NextResponse.json({ offer: updated, ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  let found = false;
  await saveStore((s) => {
    const idx = s.offers.findIndex((o) => o.id === id);
    if (idx >= 0) {
      s.offers.splice(idx, 1);
      logAudit({ adminName: adminName(s, admin.userId), action: "delete", entity: "offer", entityId: id, ip: getClientIp(request) }, s);
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "العرض غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}