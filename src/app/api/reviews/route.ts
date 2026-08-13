import { NextResponse } from "next/server";
import { getStore, saveStore } from "@/lib/db/store";
import { getSession } from "@/lib/auth";
import { uid } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const store = await getStore();

    const orderId = String(body.orderId || "");
    const rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
    const text = String(body.text || "").trim();

    if (!orderId || !text || text.length < 3) {
      return NextResponse.json({ message: "يرجى كتابة تقييمك" }, { status: 422 });
    }
    if (!rating) {
      return NextResponse.json({ message: "اختر عدد النجوم" }, { status: 422 });
    }

    const order = store.orders.find(
      (o) =>
        o.id === orderId &&
        (o.userId === session?.userId || o.customer.phone === String(body.phone || ""))
    );
    if (!order) {
      return NextResponse.json({ message: "الطلب غير موجود" }, { status: 404 });
    }
    if (order.payment.status !== "paid" && order.status !== "delivered") {
      return NextResponse.json({ message: "يمكن التقييم بعد إتمام الدفع" }, { status: 422 });
    }
    if (store.reviews.some((r) => r.orderId === order.id)) {
      return NextResponse.json({ message: "قمت بتقييم هذا الطلب بالفعل" }, { status: 409 });
    }

    const product = store.products.find((p) => p.id === order.items[0]?.productId);
    const user = store.users.find((u) => u.id === session?.userId);

    let reviewId = "";
    await saveStore((s) => {
      reviewId = uid("rev_");
      s.reviews.unshift({
        id: reviewId,
        name: user?.name || order.customer.name,
        rating,
        text,
        date: new Date().toISOString(),
        product: product?.name,
        productId: product?.id,
        orderId: order.id,
        userId: order.userId,
        verified: true,
        approved: false,
        featured: false,
      });
    });

    return NextResponse.json({ review: { id: reviewId }, ok: true }, { status: 201 });
  } catch (err) {
    console.error("review error", err);
    return NextResponse.json({ message: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}