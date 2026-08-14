import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }

  const store = await getStore();
  const orders = store.orders;

  const paidOrders = orders.filter((o) => o.payment.status === "paid");

  const totals = {
    orders: orders.length,
    revenue: paidOrders.reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter((o) => o.status === "created" || o.status === "paid").length,
    processing: orders.filter((o) => o.status === "processing" || o.status === "executing").length,
    completed: orders.filter((o) => o.status === "delivered").length,
    customers: store.users.length,
    products: store.products.filter((p) => p.active).length,
  };

  // مبيعات آخر 7 أيام (المدفوعة فقط)
  const days: { label: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const dayOrders = paidOrders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= d.getTime() && t < next.getTime();
    });
    days.push({
      label: new Intl.DateTimeFormat("ar-EG", { weekday: "short" }).format(d),
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // توزيع الحالات
  const byStatus: Record<string, number> = {};
  for (const o of orders) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  }

  const recentOrders = orders
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8)
    .map((o) => ({
      number: o.number,
      status: o.status,
      paymentStatus: o.payment.status,
      total: o.total,
      customer: o.customer.name,
      createdAt: o.createdAt,
      items: o.items.length,
    }));

  return NextResponse.json({ totals, chart: days, byStatus, recentOrders });
}