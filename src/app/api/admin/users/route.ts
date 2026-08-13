import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { adminName, getClientIp, logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  return NextResponse.json({
    roles: store.roles,
    users: store.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      roleId: u.roleId || null,
      active: u.active,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt || null,
    })),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف المستخدم مطلوب" }, { status: 422 });

  let updated = false;
  await saveStore((s) => {
    const user = s.users.find((u) => u.id === id);
    if (!user) return;
    if (body.role === "admin" || body.role === "customer") {
      user.role = body.role;
      if (body.roleId) user.roleId = String(body.roleId);
      else user.roleId = undefined;
    }
    if (body.active != null) user.active = Boolean(body.active);
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "user", entityId: id, details: { role: body.role, active: body.active }, ip: getClientIp(request) }, s);
    updated = true;
  });
  if (!updated) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
  return NextResponse.json({ ok: true });
}