import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db/store";
import { PAYMENT_METHODS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const orders = store.orders.filter((o) => o.status !== "cancelled");
  const paidOrders = orders.filter((o) => o.payment.status === "paid");

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const byMethod: Record<string, number> = {};
  for (const o of paidOrders) {
    byMethod[o.payment.method] = (byMethod[o.payment.method] || 0) + o.total;
  }

  const byCategory: Record<string, { name: string; total: number; count: number }> = {};
  const byProduct: Record<string, { name: string; total: number; count: number; image: string }> = {};
  for (const o of paidOrders) {
    for (const it of o.items) {
      const p = store.products.find((x) => x.id === it.productId);
      const cat = p ? store.categories.find((c) => c.id === p.categoryId) : undefined;
      const catKey = cat?.id || "other";
      if (!byCategory[catKey]) {
        byCategory[catKey] = { name: cat?.name || "أخرى", total: 0, count: 0 };
      }
      byCategory[catKey].total += it.price * it.quantity;
      byCategory[catKey].count += it.quantity;
      if (!byProduct[it.productId]) {
        byProduct[it.productId] = { name: it.name, total: 0, count: 0, image: it.image };
      }
      byProduct[it.productId].total += it.price * it.quantity;
      byProduct[it.productId].count += it.quantity;
    }
  }

  const avgOrder = paidOrders.length ? revenue / paidOrders.length : 0;
  const pendingPayments = orders.filter((o) => o.payment.status === "pending").length;
  const cancelled = store.orders.filter((o) => o.status === "cancelled").length;

  return NextResponse.json({
    totals: {
      revenue,
      orders: orders.length,
      paidOrders: paidOrders.length,
      avgOrder,
      pendingPayments,
      cancelled,
    },
    byMethod,
    methodLabels: PAYMENT_METHODS,
    topProducts: Object.values(byProduct)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10),
    byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total),
    recentRevenue: store.orders
      .filter((o) => o.payment.status === "paid")
      .slice(-14)
      .map((o) => ({ day: o.createdAt.slice(0, 10), revenue: o.total, orders: 1 })),
  });
}