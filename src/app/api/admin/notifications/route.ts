import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  return NextResponse.json((await getStore()).notifications);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ message: "عنوان الإشعار مطلوب" }, { status: 422 });

  let id = "";
  await saveStore((s) => {
    id = uid("ntf_");
    logAudit({ adminName: adminName(s, admin.userId), action: "create", entity: "notification", entityId: id, ip: getClientIp(request) }, s);
    s.notifications.unshift({
      id,
      type: String(body.type || "announcement"),
      title,
      body: String(body.body || "").trim() || undefined,
      link: String(body.link || "").trim() || undefined,
      read: false,
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ notification: { id }, ok: true }, { status: 201 });
}