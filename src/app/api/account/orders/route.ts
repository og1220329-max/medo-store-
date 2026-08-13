import { NextResponse } from "next/server";
import { getStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const store = await getStore();
  const orders = store.orders
    .filter((o) => o.userId === session.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json(
    orders.map((o) => ({
      id: o.id,
      number: o.number,
      status: o.status,
      payment: o.payment,
      subtotal: o.subtotal,
      discount: o.discount,
      total: o.total,
      couponCode: o.couponCode,
      items: o.items,
      timeline: o.timeline,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      canReview:
        o.payment.status === "paid" || o.status === "delivered",
    }))
  );
}