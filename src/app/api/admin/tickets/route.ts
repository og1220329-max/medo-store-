import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { uid } from "@/lib/utils";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { Ticket } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const tickets = [...store.tickets].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  return NextResponse.json(tickets);
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ message: "معرف التذكرة مطلوب" }, { status: 422 });

  let updated: Ticket | null = null;
  await saveStore((s) => {
    const existing = s.tickets.find((t) => t.id === id);
    if (!existing) return;
    const reply = String(body.message || "").trim();
    if (reply) {
      existing.messages.push({
        id: uid("tkm_"),
        fromAdmin: true,
        message: reply,
        createdAt: new Date().toISOString(),
      });
      if (existing.status === "open") existing.status = "in_progress";
    }
    if (body.status && body.status !== existing.status) {
      existing.status = body.status;
    }
    existing.updatedAt = new Date().toISOString();
    logAudit({ adminName: adminName(s, admin.userId), action: "update", entity: "ticket", entityId: id, details: { status: existing.status }, ip: getClientIp(request) }, s);
    updated = { ...existing };
  });
  if (!updated) return NextResponse.json({ message: "التذكرة غير موجودة" }, { status: 404 });
  return NextResponse.json({ ticket: updated, ok: true });
}