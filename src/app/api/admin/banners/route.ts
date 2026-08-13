import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Banner } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).banners);
}

function cleanBanner(body: Record<string, unknown>, existing?: Banner): Banner {
  return {
    id: existing?.id || uid("bnr_"),
    title: String(body.title || existing?.title || "").trim(),
    subtitle:
      body.subtitle != null
        ? String(body.subtitle).trim() || undefined
        : existing?.subtitle,
    image: String(body.image || existing?.image || "/images/uc-3850.svg"),
    buttonText:
      body.buttonText != null
        ? String(body.buttonText).trim() || undefined
        : existing?.buttonText,
    buttonUrl:
      body.buttonUrl != null
        ? String(body.buttonUrl).trim() || undefined
        : existing?.buttonUrl,
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
    return NextResponse.json({ message: "عنوان البانر مطلوب" }, { status: 422 });
  }

  let banner: Banner | null = null;
  await saveStore((s) => {
    banner = cleanBanner(body);
    s.banners.push(banner);
    logAudit({ adminName: adminName(s, admin.userId), action: "create", entity: "banner", entityId: banner.id, ip: getClientIp(request) }, s);
  });
  return NextResponse.json({ banner, ok: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف البانر مطلوب" }, { status: 422 });

  let updated: Banner | null = null;
  await saveStore((s) => {
    const existing = s.banners.find((b) => b.id === id);
    if (!existing) return;
    updated = cleanBanner(body, existing);
    Object.assign(existing, updated);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "banner", entityId: id, ip: getClientIp(request) }, s);
  });
  if (!updated) return NextResponse.json({ message: "البانر غير موجود" }, { status: 404 });
  return NextResponse.json({ banner: updated, ok: true });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";
  let found = false;
  await saveStore((s) => {
    const idx = s.banners.findIndex((b) => b.id === id);
    if (idx >= 0) {
      s.banners.splice(idx, 1);
      logAudit({ adminName: adminName(s, admin.userId), action: "delete", entity: "banner", entityId: id, ip: getClientIp(request) }, s);
      found = true;
    }
  });
  if (!found) return NextResponse.json({ message: "البانر غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}