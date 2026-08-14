import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getStore } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const customers = store.users.map((u) => {
    const userOrders = store.orders.filter((o) => o.userId === u.id);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || null,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt || null,
      ordersCount: userOrders.length,
      totalSpent: userOrders
        .filter((o) => o.payment.status === "paid" && o.status !== "cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    };
  });

  return NextResponse.json(customers);
}