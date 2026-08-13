import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore, saveStore } from "@/lib/db/store";
import { PAYMENT_METHODS } from "@/lib/constants";
import { adminName, getClientIp, logAudit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const orders = store.orders;
  const byNumber = new Map(orders.map((o) => [o.id, o.number]));
  const payments = store.payments.map((p) => ({
    ...p,
    orderNumber: p.orderNumber || byNumber.get(p.orderId) || "",
  }));

  return NextResponse.json({
    payments: [...payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    methods: PAYMENT_METHODS,
    enabled: store.settings.paymentMethods,
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const method = String(body.method || "");
  const enabled = Boolean(body.enabled);

  if (!(method in PAYMENT_METHODS)) {
    return NextResponse.json({ message: "طريقة دفع غير معروفة" }, { status: 422 });
  }

  let enabledMethods: string[] = [];
  await saveStore((s) => {
    const set = new Set(s.settings.paymentMethods);
    if (enabled) set.add(method);
    else set.delete(method);
    s.settings.paymentMethods = [...set];
    logAudit({ adminName: adminName(s, admin.userId), action: "toggle", entity: "payment-method", entityId: method, details: { enabled }, ip: getClientIp(request) }, s);
    enabledMethods = [...s.settings.paymentMethods];
  });
  return NextResponse.json({ enabled: enabledMethods, ok: true });
}