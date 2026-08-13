import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { nextStatus, pushTimeline } from "@/lib/orders";
import { adminName, getClientIp, logAudit } from "@/lib/audit";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const status = searchParams.get("status") || "";
  const store = await getStore();

  let orders = [...store.orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (q) {
    orders = orders.filter(
      (o) =>
        o.number.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q)
    );
  }
  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      number: o.number,
      status: o.status,
      paymentStatus: o.payment.status,
      paymentMethod: o.payment.method,
      customer: o.customer,
      total: o.total,
      subtotal: o.subtotal,
      discount: o.discount,
      items: o.items,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      couponCode: o.couponCode,
    }))
  );
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!id) return NextResponse.json({ message: "معرف الطلب مطلوب" }, { status: 422 });

  let order: OrderStatus | null = null;
  let error: string | null = null;

  await saveStore((s) => {
      logAudit(
        {
          adminName: adminName(s, admin.userId),
          action: "advance",
          entity: "order",
          entityId: id,
          details: { to: action },
          ip: getClientIp(request),
        },
        s
      );
    const o = s.orders.find((x) => x.id === id);
    if (!o) {
      error = "الطلب غير موجود";
      return;
    }
    if (action === "advance") {
      const nxt = nextStatus(o.status);
      if (!nxt) {
        error = "لا يمكن التقدم بالطلب من هذه الحالة";
        return;
      }
      pushTimeline(o, nxt);
      order = o.status;
    } else if (action === "cancel") {
      if (o.status === "delivered" || o.status === "cancelled") {
        error = "لا يمكن إلغاء هذا الطلب";
        return;
      }
      o.status = "cancelled";
      o.timeline.push({ status: "cancelled", at: new Date().toISOString() });
      o.updatedAt = new Date().toISOString();
      order = o.status;
    } else if (action === "refund") {
      if (o.payment.status !== "paid") {
        error = "الطلب غير مدفوع";
        return;
      }
      o.payment.status = "refunded";
      order = o.status;
    } else {
      error = "إجراء غير معروف";
    }
  });

  if (error) return NextResponse.json({ message: error }, { status: 400 });
  return NextResponse.json({ status: order, ok: true });
}